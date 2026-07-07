import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Megaphone, 
  CreditCard, 
  Search, 
  Cog, 
  BarChart3,
  ArrowRight,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

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
  Globe,
  Megaphone,
  CreditCard,
  Search,
  Cog,
  Settings: Cog,
  BarChart3,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || HelpCircle;
};


// Loaded dynamically via API

export const ServicesSection = () => {
  const { data: services = [] } = useQuery<ServiceData[]>({
    queryKey: ["services"],
    queryFn: () => fetchAPI<ServiceData[]>("/services"),
  });

  return (
    <section className="py-24 bg-surface-dark">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-primary mr-3" />
            <Badge variant="outline" className="text-primary border-primary bg-primary/5">
              Our Services
            </Badge>
            <Sparkles className="h-6 w-6 text-primary ml-3" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Innovative Solutions
            </span>
            <br />
            <span className="text-foreground">for Modern Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Transform your business with our cutting-edge technology solutions. From web development to digital marketing,
            we deliver results that drive growth and success.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
              <Card 
                key={service.title}
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-background/50 to-muted/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <CardContent className="relative p-8">
                  {/* Icon Container */}
                  <div className={`inline-flex p-4 rounded-2xl ${service.iconBg} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <IconComponent className={`h-8 w-8 ${service.iconColor} group-hover:text-primary transition-colors duration-300`} />
                  </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group/btn p-0 h-auto font-medium text-primary hover:text-primary-foreground hover:bg-primary/10 transition-all duration-300"
                    >
                      <span className="mr-2">Explore Service</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </CardContent>
              </Card>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};