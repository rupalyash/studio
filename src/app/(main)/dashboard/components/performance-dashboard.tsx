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

const salesByRegionData = [
  { region: "NA", sales: 4000 },
  { region: "EU", sales: 3000 },
  { region: "APAC", sales: 2000 },
  { region: "LATAM", sales: 2780 },
  { region: "MEA", sales: 1890 },
];

const opportunitiesByStageData = [
  { stage: "Prospect", value: 120 },
  { stage: "Qualify", value: 85 },
  { stage: "Proposal", value: 55 },
  { stage: "Negotiate", value: 25 },
  { stage: "Closed", value: 15 },
];

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

export async function PerformanceDashboard() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
        <Card>
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
                data={salesByRegionData}
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
        <Card>
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
                data={opportunitiesByStageData}
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
      </div>
    </>
  );
}
