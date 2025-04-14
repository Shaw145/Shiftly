import { useState, useRef, useEffect } from "react";
import TopNavbar from "./dashboard/TopNavbar";
import Sidebar from "./dashboard/Sidebar";

// Layout component to wrap all dashboard pages
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add click outside handler for sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen &&
        window.innerWidth < 768
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TopNavbar */}
      <TopNavbar toggleSidebar={toggleSidebar} ref={sidebarRef} />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        ref={sidebarRef}
      />

      {/* Main Content */}
      <main className="transition-all duration-200 ease-in-out md:ml-24 mt-16 p-4">
        {children}
      </main>
  
    </div>
  );
};

export default DashboardLayout;
