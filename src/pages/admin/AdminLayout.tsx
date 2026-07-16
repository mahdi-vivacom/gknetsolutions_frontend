import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  Briefcase,
  HelpCircle,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead submitted by Jane Foster", time: "5m ago", unread: true },
    { id: 2, text: "Lead 'Steve Rogers' stage updated to Won", time: "1h ago", unread: true },
    { id: 3, text: "System migration completed successfully", time: "2h ago", unread: false }
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      if (user?.role === "employee") {
        navigate("/employee", { replace: true });
      } else {
        navigate("/login", { replace: true, state: { from: location } });
      }
    }
  }, [user, loading, navigate, location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">Verifying administration session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Lead Management", path: "/admin/leads", icon: Users },
    { name: "Employee Management", path: "/admin?tab=employees", icon: UserCheck },
    { name: "Create Service", path: "/admin/services/new", icon: Layers },
    { name: "Create Project", path: "/admin/projects/new", icon: Briefcase },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar Overlay (Mobile) */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-card border-r border-border/50 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } -translate-x-full lg:translate-x-0 lg:static`}
        style={{
          transform: sidebarOpen ? undefined : "translateX(0)"
        }}
      >
        {/* Brand/Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-bold text-lg shadow-md">
              G
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                GKNet Admin
              </span>
            )}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path.includes("?")
              ? (location.pathname + location.search) === item.path
              : location.pathname === item.path && !location.search;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/50 space-y-1.5">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-all duration-200`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-card/80 border-b border-border/50 flex items-center justify-between px-6 lg:px-8 backdrop-blur-md sticky top-0 z-30 transition-colors">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">CRM Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your operations, leads, and assets</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notifications Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2 border-border/50">
                <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                  {notifications.map((notif) => (
                    <DropdownMenuItem 
                      key={notif.id} 
                      className={`flex flex-col items-start px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        notif.unread ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs ${notif.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {notif.text}
                        </span>
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">{notif.time}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2.5 p-1.5 hover:bg-muted rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">
                    {(user.firstName[0] || "") + (user.lastName?.[0] || "")}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold leading-none">{user.firstName} {user.lastName || ""}</div>
                    <span className="text-[10px] text-muted-foreground capitalize">{user.role}istrator</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border-border/50">
                <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')} className="rounded-lg cursor-pointer">Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/profile?tab=security')} className="rounded-lg cursor-pointer">Security Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-8 bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
