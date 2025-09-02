import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-6 shadow-md border border-gray-100">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4" />
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-12"
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
        <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      </div>
    </motion.div>
  );
};

export default Loading;