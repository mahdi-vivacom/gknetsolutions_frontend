import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import * as Icons from "lucide-react";

// Import local image assets to resolve from db keys
import heroBusinesswoman from "@/assets/hero-businesswoman.jpg";
import heroImageWebp from "@/assets/hero-image.webp";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import analyticsStats from "@/assets/analytics-stats.jpg";
import posImage from "@/assets/pos.png";

const imageMap: Record<string, string> = {
  "hero-businesswoman": heroBusinesswoman,
  "hero-image": heroImageWebp,
  "team-collaboration": teamCollaboration,
  "analytics-stats": analyticsStats,
  "pos": posImage,
};

const getHeroImage = (heroImageName?: string, slug?: string) => {
  if (heroImageName && imageMap[heroImageName]) return imageMap[heroImageName];
  if (slug && imageMap[slug]) return imageMap[slug];
  // Fallbacks
  if (slug === 'web-development') return heroImageWebp;
  if (slug === 'seo') return teamCollaboration;
  if (slug === 'erp-development') return analyticsStats;
  if (slug === 'pos') return posImage;
  return heroBusinesswoman;
};

// Dynamic helper to resolve Lucide icons by name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ServiceDetailData {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  gradient: string;
  link: string;
  slug: string;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  features?: Feature[] | string;
  processSteps?: ProcessStep[] | string;
  ctaTitle?: string;
  ctaDescription?: string;
}

interface ThemeConfig {
  gradientBg: string;
  gradientText: string;
  badgeBg: string;
  badgeText: string;
  statsText: string;
  floatingIconBg: string;
  decorativeGradients: {
    topRight: string;
    bottomLeft: string;
    middleRight: string;
  };
}

const themeMap: Record<string, ThemeConfig> = {
  "web-development": {
    gradientBg: "from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900/30 dark:to-teal-900/50",
    gradientText: "from-green-500 via-emerald-600 to-teal-600",
    badgeBg: "bg-green-500/10",
    badgeText: "text-green-600 dark:text-green-400",
    statsText: "text-green-600 dark:text-green-400",
    floatingIconBg: "from-green-500 to-emerald-600",
    decorativeGradients: {
      topRight: "from-green-400/30 to-emerald-500/40",
      bottomLeft: "from-emerald-400/30 to-teal-500/40",
      middleRight: "from-cyan-400/20 to-green-500/30"
    }
  },
  "digital-marketing": {
    gradientBg: "from-pink-50 via-rose-50 to-red-50 dark:from-slate-900 dark:via-pink-900/30 dark:to-red-900/50",
    gradientText: "from-pink-500 via-rose-600 to-red-600",
    badgeBg: "bg-pink-500/10",
    badgeText: "text-pink-600 dark:text-pink-400",
    statsText: "text-pink-600 dark:text-pink-400",
    floatingIconBg: "from-pink-500 to-rose-600",
    decorativeGradients: {
      topRight: "from-pink-400/30 to-rose-500/40",
      bottomLeft: "from-rose-400/30 to-red-500/40",
      middleRight: "from-amber-400/20 to-pink-500/30"
    }
  },
  "pos": {
    gradientBg: "from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900/30 dark:to-teal-900/50",
    gradientText: "from-green-500 via-emerald-600 to-teal-600",
    badgeBg: "bg-green-500/10",
    badgeText: "text-green-600 dark:text-green-400",
    statsText: "text-green-600 dark:text-green-400",
    floatingIconBg: "from-green-500 to-emerald-600",
    decorativeGradients: {
      topRight: "from-green-400/30 to-emerald-500/40",
      bottomLeft: "from-emerald-400/30 to-teal-500/40",
      middleRight: "from-cyan-400/20 to-green-500/30"
    }
  },
  "seo": {
    gradientBg: "from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-orange-900/30 dark:to-amber-900/50",
    gradientText: "from-orange-500 via-amber-600 to-yellow-600",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-600 dark:text-orange-400",
    statsText: "text-orange-600 dark:text-orange-400",
    floatingIconBg: "from-orange-500 to-amber-600",
    decorativeGradients: {
      topRight: "from-orange-400/30 to-amber-500/40",
      bottomLeft: "from-amber-400/30 to-yellow-500/40",
      middleRight: "from-red-400/20 to-orange-500/30"
    }
  },
  "erp-development": {
    gradientBg: "from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-indigo-900/30 dark:to-cyan-900/50",
    gradientText: "from-indigo-500 via-blue-600 to-cyan-600",
    badgeBg: "bg-indigo-500/10",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    statsText: "text-indigo-600 dark:text-indigo-400",
    floatingIconBg: "from-indigo-500 to-blue-600",
    decorativeGradients: {
      topRight: "from-indigo-400/30 to-blue-500/40",
      bottomLeft: "from-blue-400/30 to-cyan-500/40",
      middleRight: "from-purple-400/20 to-indigo-500/30"
    }
  },
  "custom-software": {
    gradientBg: "from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/30 dark:to-indigo-900/50",
    gradientText: "from-primary via-blue-600 to-purple-600",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    statsText: "text-primary",
    floatingIconBg: "from-blue-500 to-indigo-600",
    decorativeGradients: {
      topRight: "from-blue-400/30 to-indigo-500/40",
      bottomLeft: "from-indigo-400/30 to-purple-500/40",
      middleRight: "from-cyan-400/20 to-blue-500/30"
    }
  }
};

const defaultTheme: ThemeConfig = themeMap["custom-software"];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, error } = useQuery<ServiceDetailData>({
    queryKey: ["service", slug],
    queryFn: () => fetchAPI<ServiceDetailData>(`/services/${slug}`),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="space-y-6 text-center max-w-lg px-6 w-full">
            <div className="animate-pulse flex flex-col items-center space-y-4">
              <div className="h-8 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-64 bg-muted rounded-2xl w-full mt-6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center max-w-md px-6">
            <Icons.AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The service you are looking for might have been moved or does not exist.
            </p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse JSON features & steps if they arrive as strings
  const parsedFeatures: Feature[] = Array.isArray(service.features)
    ? service.features
    : typeof service.features === "string"
    ? JSON.parse(service.features)
    : [];

  const parsedSteps: ProcessStep[] = Array.isArray(service.processSteps)
    ? service.processSteps
    : typeof service.processSteps === "string"
    ? JSON.parse(service.processSteps)
    : [];

  const theme = themeMap[service.slug] || defaultTheme;
  const heroImg = getHeroImage(service.heroImage, service.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Full dynamic gradient background matching light/dark modes */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientBg}`}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/60 via-transparent to-pink-50/40 dark:from-cyan-900/20 dark:via-transparent dark:to-pink-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-50/40 via-transparent to-emerald-50/30 dark:from-violet-900/15 dark:via-transparent dark:to-emerald-900/10"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className={`inline-flex items-center px-4 py-2 ${theme.badgeBg} ${theme.badgeText} rounded-full text-sm font-medium`}>
                    <DynamicIcon name={service.icon} className="w-4 h-4 mr-2" />
                    {service.heroBadge || service.title}
                  </div>

                  <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    {service.heroTitle?.split(" ").slice(0, -1).join(" ") || service.title}{" "}
                    <span className={`text-gradient bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
                      {service.heroTitle?.split(" ").slice(-1)[0] || ""}
                    </span>
                  </h1>

                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                    {service.heroDescription || service.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <Button variant="hero" size="lg" className="group hover-lift w-full sm:w-auto">
                      Start Your Project
                      <Icons.ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/projects">
                    <Button variant="outline" size="lg" className="hover-lift w-full sm:w-auto">
                      View Portfolio
                    </Button>
                  </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold ${theme.statsText}`}>100+</div>
                    <div className="text-sm text-muted-foreground">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold ${theme.statsText}`}>98%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold ${theme.statsText}`}>24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image & Graphic Overlays */}
              <div className="relative lg:order-2">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-600/10 z-10`}></div>

                  {/* Main image */}
                  <img
                    src={heroImg}
                    alt={service.title}
                    className="w-full h-[400px] lg:h-[550px] object-cover"
                  />

                  {/* Floating elements */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="glass-card p-4 backdrop-blur-sm shadow-lg border border-white/20 dark:border-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Active Deployment</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="glass-card p-4 backdrop-blur-sm shadow-lg border border-white/20 dark:border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${theme.floatingIconBg} rounded-lg flex items-center justify-center`}>
                          <DynamicIcon name={service.icon} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{service.title}</div>
                          <div className="text-xs text-muted-foreground">Enterprise Solutions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative glowing gradient blobs */}
                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${theme.decorativeGradients.topRight} rounded-full blur-xl`}></div>
                <div className={`absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br ${theme.decorativeGradients.bottomLeft} rounded-full blur-xl`}></div>
                <div className={`absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br ${theme.decorativeGradients.middleRight} rounded-full blur-lg`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {parsedFeatures.length > 0 && (
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Our {service.title}?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the direct benefits and core advantages of implementing our industry-leading {service.title} workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parsedFeatures.map((feature, index) => (
                <Card key={index} className="glass-card hover-lift border border-border/40 shadow-sm transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}>
                      <DynamicIcon name={feature.icon} className={`h-6 w-6 ${theme.statsText}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {parsedSteps.length > 0 && (
        <section className="py-20 bg-muted/10 relative border-y border-border/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Streamlined Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A structured, transparent methodology engineered to deliver high performance results on schedule.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {parsedSteps.map((phase, index) => (
                <div key={index} className="text-center group relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${theme.floatingIconBg} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="glass-card p-10 text-center max-w-3xl mx-auto border border-border/50 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.decorativeGradients.topRight} rounded-full blur-3xl opacity-30`}></div>
            <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br ${theme.decorativeGradients.bottomLeft} rounded-full blur-3xl opacity-30`}></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">{service.ctaTitle || "Ready to collaborate?"}</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {service.ctaDescription || "Get in touch with our engineering team today to review your business specifications."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/contact">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">Get Started Today</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Schedule Consultation</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
