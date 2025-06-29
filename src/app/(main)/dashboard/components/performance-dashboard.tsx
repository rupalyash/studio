"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

// Data structure from Firestore
interface PerformanceData {
  totalRevenue?: number;
  newLeads?: number;
  conversionRate?: number;
  salesByRegion?: { region: string; sales: number }[];
  opportunitiesByStage?: { stage: string; value: number }[];
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Opportunities",
    color: "hsl(var(--chart-2))",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

// Default data to show if nothing is in Firestore
const initialData: PerformanceData = {
  totalRevenue: 0,
  newLeads: 0,
  conversionRate: 0,
  salesByRegion: [
    { region: "NA", sales: 0 },
    { region: "EU", sales: 0 },
    { region: "APAC", sales: 0 },
  ],
  opportunitiesByStage: [
    { stage: "Prospect", value: 0 },
    { stage: "Qualify", value: 0 },
    { stage: "Closed", value: 0 },
  ],
};

export function PerformanceDashboard() {
  const [data, setData] = useState<PerformanceData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "performance_metrics"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestData = querySnapshot.docs[0].data() as PerformanceData;
          // Merge fetched data with initial data to ensure all fields are present
          setData((prevData) => ({ ...prevData, ...latestData }));
        }
        // If empty, it will just use the initialData
      } catch (error) {
        console.error("Error fetching performance data:", error);
        // In case of error, we still have the initial data
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                Based on the latest data log
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.newLeads?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Based on the latest data log
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.conversionRate?.toLocaleString() ?? 0}%</div>
              <p className="text-xs text-muted-foreground">
                Based on the latest data log
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>
                Performance across different geographical regions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={data.salesByRegion}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="region"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
            <CardHeader>
              <CardTitle>Opportunities Pipeline</CardTitle>
              <CardDescription>
                Current distribution of sales opportunities by stage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={data.opportunitiesByStage}
                  layout="vertical"
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={80}
                  />
                  <XAxis dataKey="value" type="number" hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
