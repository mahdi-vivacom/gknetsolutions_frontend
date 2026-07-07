import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image-3.png";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";


export const HeroSection = () => {
  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetchAPI<Record<string, string>>("/settings"),
  });

  return (
    <section className="relative min-h-screen bg-gradient-dark flex items-center overflow-hidden pt-24">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          animation: "pulse 4s ease-in-out infinite"
        }}></div>
      </div>

      {/* Floating Tech Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-accent rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-primary/50 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-8 bg-gradient-to-b from-primary to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-8 h-1 bg-gradient-to-r from-accent to-transparent animate-pulse"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      
      {/* Dynamic Color Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-ping"></div>
      
      
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover-glow">
              <span className="text-primary text-sm font-medium">{settings.hero_badge || "⚡ Lightning Fast Web Solutions"}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient block">
                {settings.hero_title || "Digital Solutions That Drive Business Growth"}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl slide-up">
              {settings.hero_description || "Boost your business with lucrative web design solutions. We create fast, responsive websites that drive growth and maximize your online presence."}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 scale-in">
              <Link to="/contact">
                <Button variant="hero" size="xl" className="group hover-lift hover-glow">
                  {settings.hero_primary_cta || "Get Started Today"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/projects">
              <Button variant="glass" size="xl" className="group hover-scale">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {settings.hero_secondary_cta || "View Our Portfolio"}
              </Button>
              </Link>
            </div>
            
            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/20">
              <div className="text-center stagger-animation">
                <div className="text-2xl font-bold text-primary bounce-in">500+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center stagger-animation">
                <div className="text-2xl font-bold text-primary bounce-in">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center stagger-animation">
                <div className="text-2xl font-bold text-primary bounce-in">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div> */}
          </div>
          
          {/* Hero Image */}
          <div className="relative lg:ml-8 slide-left">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional businesswoman representing innovative tech solutions"
                className="w-full h-auto rounded-2xl  hover-lift hover-tilt"
              />
              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};