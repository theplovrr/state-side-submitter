
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface TakeHomePayChartProps {
  offers: Array<{
    state: string;
    estimatedTakeHome: number;
    isWinner?: boolean;
  }>;
}

const TakeHomePayChart = ({ offers }: TakeHomePayChartProps) => {
  const isMobile = useIsMobile();
  
  // Format the data for the chart
  const chartData = offers.map((offer) => ({
    state: offer.state,
    takeHomePay: offer.estimatedTakeHome,
    isWinner: offer.isWinner || false,
  }));

  // Calculate the maximum value for better chart scaling
  const maxValue = Math.max(...chartData.map(item => item.takeHomePay)) * 1.1;

  return (
    <Card className="w-full shadow-lg bg-black text-white border-gray-800 mt-8">
      <CardHeader className="bg-black border-b border-gray-800 p-4">
        <CardTitle className="text-xl font-bold text-white">
          Estimated Take-Home Pay Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full" style={{ height: isMobile ? "300px" : "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: isMobile ? 20 : 40,
                bottom: isMobile ? 60 : 40,
              }}
            >
              <XAxis 
                dataKey="state" 
                tick={{ fill: "#ffffff" }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 70 : 60}
              />
              <YAxis 
                tick={{ fill: "#ffffff" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={isMobile ? 50 : 70}
                domain={[0, maxValue]}
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Take-Home Pay"]}
                contentStyle={{ backgroundColor: "#1A1F2C", color: "white", border: "1px solid #333" }}
                itemStyle={{ color: "white" }}
                labelStyle={{ color: "white", fontWeight: "bold" }}
              />
              <Bar 
                dataKey="takeHomePay" 
                name="Take-Home Pay"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isWinner ? "#F97316" : "#9b87f5"}
                    stroke={entry.isWinner ? "#ffa94d" : "#7E69AB"}
                    strokeWidth={entry.isWinner ? 2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 gap-6 text-sm">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-[#9b87f5] mr-2"></div>
            <span className="text-gray-300">Standard</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-[#F97316] mr-2"></div>
            <span className="text-gray-300">Winner</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TakeHomePayChart;
