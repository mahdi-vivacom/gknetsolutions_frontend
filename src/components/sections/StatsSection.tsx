import { Card, CardContent } from "@/components/ui/card";
import analyticsImage from "@/assets/analytics-stats.jpg";
import { TrendingUp, Users, Award, Clock, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

interface StatData {
  id: number;
  value: string;
  label: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, any> = {
  TrendingUp,
  Users,
  Award,
  Clock
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || HelpCircle;
};

export const StatsSection = () => {
  const { data: stats = [] } = useQuery<StatData[]>({
    queryKey: ["stats"],
    queryFn: () => fetchAPI<StatData[]>("/stats"),
  });

  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetchAPI<Record<string, string>>("/settings"),
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 slide-right">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gradient block">
                  {settings.stats_title || "Our online solution not only offers you"}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {settings.stats_description || "We deliver measurable results that drive your business forward. Our data-driven approach ensures every solution we implement contributes to your bottom line."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {stats.map((stat, index) => {
                const IconComponent = getIcon(stat.icon);
                return (
                  <Card 
                    key={stat.label}
                    className="glass-card hover-lift hover-glow stagger-animation"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 hover-scale pulse-glow">
                          <IconComponent className="h-5 w-5 text-primary rotate-in" />
                        </div>
                        <div className="text-3xl font-bold text-primary bounce-in">
                          {stat.value}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{stat.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative slide-left">
            <div className="relative">
              <img 
                src={analyticsImage}
                alt="Business analytics and statistics visualization"
                className="w-full h-auto rounded-2xl shadow-card hover-lift hover-tilt"
              />
              
              {/* Floating Metric Cards */}
              <div className="absolute -top-6 -right-6 glass-card p-4 rounded-xl float pulse-glow">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full pulse-glow" />
                  <div>
                    <div className="text-sm font-semibold">Live Analytics</div>
                    <div className="text-xs text-muted-foreground">Real-time monitoring</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl bounce-in hover-scale" style={{ animationDelay: "0.4s" }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-xs text-muted-foreground">Efficiency Boost</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};