import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colors = {
    primary: "from-primary to-blue-700",
    secondary: "from-secondary to-blue-400", 
    success: "from-success to-green-600",
    warning: "from-warning to-yellow-600",
    error: "from-error to-red-600",
    accent: "from-accent to-cyan-600"
  };

  const isPositive = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                {value}
              </p>
              {trend && (
                <div className="flex items-center space-x-1">
                  <ApperIcon 
                    name={isPositive ? "TrendingUp" : "TrendingDown"} 
                    size={16} 
                    className={isPositive ? "text-success" : "text-error"} 
                  />
                  <span className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-success" : "text-error"
                  )}>
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center",
              colors[color]
            )}>
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;