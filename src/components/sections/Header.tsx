import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Code, Globe, Search, CreditCard, Megaphone, Settings, ArrowRight, HelpCircle, BarChart3 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import speewebLogo from "@/assets/speeeweb-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";


interface ServiceData {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  gradient: string;
  link: string;
}

const iconMap: Record<string, any> = {
  Code,
  Globe,
  Search,
  CreditCard,
  Megaphone,
  Settings,
  Cog: Settings,
  BarChart3,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || HelpCircle;
};


export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: services = [] } = useQuery<ServiceData[]>({
    queryKey: ["services"],
    queryFn: () => fetchAPI<ServiceData[]>("/services"),
  });

  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetchAPI<Record<string, string>>("/settings"),
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-lg border-b border-border/30 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            
             <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {settings.brand_name || "Gknetsolutions"}
              </h1>
              <p className="text-xs sm:text-xs lg:text-sm text-muted-foreground font-medium">
                {settings.brand_sub || "Digital Solutions"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {/* Home */}
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-base relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* Services Custom Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-all duration-300 font-semibold text-base relative group"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[500px] lg:w-[600px] bg-background border border-border/20 rounded-xl shadow-xl z-50"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <div className="grid gap-1 p-6 lg:grid-cols-2">
                    {services.map((service) => {
                      const IconComponent = getIcon(service.icon);
                      return (
                        <Link
                          key={service.title}
                          to={service.link}
                          className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-lg hover:scale-[1.02] focus:bg-gradient-to-r focus:from-primary/10 focus:to-primary/5 focus:shadow-lg border border-transparent hover:border-primary/20"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-200">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors duration-200">
                                {service.title}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Projects */}
            <Link
              to="/projects"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-base relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-base relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Theme Toggle & Auth/Contact Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'employee' ? '/employee' : '/client'}>
                  <Button variant="ghost" className="font-semibold text-base flex items-center space-x-1.5 hover:text-primary transition-all">
                    <User className="w-4.5 h-4.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => { logout(); navigate("/login"); }}
                  className="font-semibold text-base text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 flex items-center space-x-1.5"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold text-base hover:text-primary transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="font-semibold text-base border-border hover:bg-muted transition-all">
                    Register
                  </Button>
                </Link>
              </>
            )}

            <Link to="/contact">
              <Button variant="hero" size="lg" className="font-bold text-base px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Tablet Navigation */}
          <nav className="hidden md:flex lg:hidden items-center space-x-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-sm"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-sm"
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-sm"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Theme Toggle & Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              className="p-3 text-foreground hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/30 bg-gradient-to-b from-background/95 to-background/90 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              {/* Home */}
              <Link
                to="/"
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 font-semibold text-base py-4 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Services Dropdown */}
              <div className="border-t border-border/30 pt-6">
                <div className="text-foreground font-bold py-3 mb-4 text-lg bg-gradient-to-r from-primary/20 to-transparent px-4 rounded-lg">Our Services</div>
                <div className="space-y-3">
                  {services.map((service) => {
                    const IconComponent = getIcon(service.icon);
                    return (
                      <Link
                        key={service.title}
                        to={service.link}
                        className="group flex items-center space-x-4 rounded-xl p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/10 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-primary/20"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-primary/15 flex items-center justify-center group-hover:from-primary/35 group-hover:to-primary/25 transition-all duration-300">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {service.title}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              <Link
                to="/projects"
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 font-semibold text-base py-4 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 font-semibold text-base py-4 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Auth actions for mobile */}
              <div className="pt-4 border-t border-border/30 px-4 flex flex-col space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <Link 
                      to={user.role === 'admin' ? '/admin' : user.role === 'employee' ? '/employee' : '/client'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full font-semibold text-base py-3 flex items-center justify-center space-x-1.5 border-border hover:bg-muted">
                        <User className="w-4.5 h-4.5" />
                        <span>Go to Dashboard</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => { logout(); setIsMenuOpen(false); navigate("/login"); }}
                      className="w-full font-semibold text-base text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 flex items-center justify-center space-x-1.5 py-3"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full font-semibold text-base py-3 text-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold text-base py-3 text-center border-border hover:bg-muted">
                        Register Account
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="pt-4 px-4">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="lg" className="w-full font-bold text-base py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};