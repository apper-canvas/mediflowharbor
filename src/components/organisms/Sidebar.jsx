import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className, isMobileOpen, onMobileClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Patients", href: "/patients", icon: "Users" },
    { name: "Appointments", href: "/appointments", icon: "Calendar" },
    { name: "Beds", href: "/beds", icon: "Bed" },
    { name: "Departments", href: "/departments", icon: "Building2" },
    { name: "Emergency", href: "/emergency", icon: "Zap" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="Cross" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MediFlow
          </h1>
          <p className="text-xs text-gray-500">Hospital Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} 
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-surface border-r border-gray-200", className)}>
      <SidebarContent />
    </div>
  );

  // Mobile sidebar overlay
  const MobileSidebar = () => (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-200 lg:hidden"
      >
        <SidebarContent />
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;