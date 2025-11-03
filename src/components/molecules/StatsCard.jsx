import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  gradient = "blue",
  delay = 0 
}) => {
  const gradients = {
    blue: "from-blue-500 to-primary",
    green: "from-emerald-500 to-success",
    purple: "from-purple-500 to-indigo-600",
    orange: "from-orange-500 to-amber-600"
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-secondary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
    >
      <Card className="p-6 hover:shadow-hover transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`w-12 h-12 bg-gradient-to-br ${gradients[gradient]} rounded-lg flex items-center justify-center shadow-md`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </motion.div>
          {change && (
            <motion.div 
              className={`flex items-center space-x-1 ${changeColors[changeType]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4" 
              />
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
        >
          <div className="text-3xl font-bold text-gradient mb-1 group-hover:scale-105 transition-transform duration-200">
            {value}
          </div>
          <p className="text-secondary text-sm font-medium">{title}</p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default StatsCard;