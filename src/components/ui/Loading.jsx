import { motion } from "framer-motion";

const LoadingCard = ({ className = "" }) => (
  <motion.div
    className={`bg-white rounded-lg p-4 shadow-card animate-pulse ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3 mb-2"></div>
    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
  </motion.div>
);

const LoadingTable = () => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden">
    <div className="p-4 border-b border-slate-200">
      <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48"></div>
    </div>
    {[...Array(8)].map((_, i) => (
      <div key={i} className="p-4 border-b border-slate-100 last:border-b-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const LoadingKanban = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, columnIndex) => (
      <div key={columnIndex} className="bg-slate-100 rounded-lg p-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-4 w-24"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, cardIndex) => (
            <LoadingCard key={cardIndex} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const LoadingStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="bg-gradient-card rounded-xl p-6 shadow-card animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-6"></div>
        </div>
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2 w-20"></div>
        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
      </motion.div>
    ))}
  </div>
);

const Loading = ({ variant = "default" }) => {
  switch (variant) {
    case "table":
      return <LoadingTable />;
    case "kanban":
      return <LoadingKanban />;
    case "stats":
      return <LoadingStats />;
    case "card":
      return <LoadingCard />;
    default:
      return (
        <motion.div
          className="flex items-center justify-center p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-secondary font-medium">Loading...</span>
          </div>
        </motion.div>
      );
  }
};

export default Loading;