import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Pipeline", href: "/pipeline", icon: "Kanban" },
    { name: "Deals", href: "/deals", icon: "Target" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white shadow-xl">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Pipeline Pro</h1>
            <p className="text-xs text-secondary">Sales CRM</p>
          </div>
        </motion.div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200 lg:hidden"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border-r-4 border-primary"
                    : "text-secondary hover:text-primary hover:bg-slate-100"
                }`
              }
            >
              <ApperIcon 
                name={item.icon} 
                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <motion.div
          className="bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-lg p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <ApperIcon name="TrendingUp" className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-1">Track your sales</p>
          <p className="text-xs text-secondary">Monitor deals and grow revenue</p>
        </motion.div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
        <motion.div
          className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden"
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <SidebarContent />
        </motion.div>
      </>
    );
  }

  return (
    <div className="hidden lg:block w-80 fixed left-0 top-0 bottom-0 z-30">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;