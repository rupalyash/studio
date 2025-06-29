import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface TrendCardProps {
  trend: string;
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-lg">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="bg-accent/20 text-accent rounded-full p-2">
            <Lightbulb className="h-5 w-5" />
        </div>
        <p className="flex-1 text-sm font-medium pt-1.5 text-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
}
