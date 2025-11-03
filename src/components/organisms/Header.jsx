import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ title, onMenuClick, onSearch, showSearch = false, action }) => {
  return (
    <motion.header
      className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2 lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gradient">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                placeholder="Search contacts and deals..."
                onSearch={onSearch}
                className="w-64"
              />
            </div>
          )}
          
          {action && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {action}
            </motion.div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            placeholder="Search contacts and deals..."
            onSearch={onSearch}
          />
        </div>
      )}
    </motion.header>
  );
};

export default Header;