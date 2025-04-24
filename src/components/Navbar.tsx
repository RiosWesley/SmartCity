
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Lightbulb,
  Car,
  Leaf,
  Bell,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    {
      name: "Iluminação",
      icon: Lightbulb,
      children: [
        { name: "Visão Geral", path: "/lighting" },
        { name: "Postes", path: "/lighting/poles" },
        { name: "Configurações", path: "/lighting/settings" },
      ]
    },
    { name: "Tráfego", path: "/traffic", icon: Car },
    { name: "Ambiente", path: "/environment", icon: Leaf },
    { name: "Alertas", path: "/alerts", icon: Bell },
    { name: "Dispositivos", path: "/devices", icon: Settings },
    { name: "Relatórios", path: "/reports", icon: BarChart3 },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Top navigation bar */}
      <header className="fixed top-0 inset-x-0 z-30 h-16 glass-card border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <Menu size={22} />
            </button>
            <div className="ml-4 flex items-center">
              <span className="text-xl font-semibold text-gradient">CityNexus</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-200">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-city-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-city-blue-100 flex items-center justify-center">
              <span className="text-city-blue-500 font-medium text-sm">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-full pt-16 glass-card border-r border-white/20 shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              {sidebarOpen ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          
          <nav className="flex-1 py-4 px-3">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                if (link.children) {
                  return (
                    <li key={link.name}>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={link.name}>
                          <AccordionTrigger className="flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-white/10 [&[data-state=open]>svg]:text-yellow-400 [&[data-state=open]>svg]:rotate-0">
                            <link.icon size={20} className={`${!sidebarOpen && "mx-auto"}`} />
                            {sidebarOpen && <span className="ml-3 font-medium">{link.name}</span>}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="ml-6 space-y-1">
                              {link.children.map((child) => {
                                const isChildActive = location.pathname === child.path;
                                return (
                                  <li key={child.path}>
                                    <Link
                                      to={child.path}
                                      className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                                        isChildActive
                                          ? "bg-city-blue-500 text-white"
                                          : "hover:bg-white/10"
                                      }`}
                                    >
                                      {sidebarOpen && <span className="ml-3 font-medium">{child.name}</span>}
                                      {isChildActive && sidebarOpen && (
                                        <motion.div
                                          layoutId="activeIndicator"
                                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white"
                                        />
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </li>
                  );
                }

                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 ${
                        isActive
                          ? "bg-city-blue-500 text-white"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <link.icon
                        size={20}
                        className={`${!sidebarOpen && "mx-auto"}`}
                      />
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{link.name}</span>
                      )}
                      {isActive && sidebarOpen && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            {sidebarOpen && (
              <div className="glass p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-city-green-400 mr-2"></div>
                  <div className="text-sm">Sistema Online</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">Última atualização: agora</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
