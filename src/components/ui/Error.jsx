import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Error",
  variant = "default"
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  if (variant === "inline") {
    return (
      <motion.div
        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name="AlertCircle" className="w-5 h-5 text-error flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-red-800 font-medium">{title}</p>
          <p className="text-sm text-red-600 mt-1">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-1" />
            Retry
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-secondary mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {message}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button onClick={handleRetry} className="flex items-center space-x-2">
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;