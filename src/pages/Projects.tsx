import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Tag, ArrowRight, FolderOpen, Award, Star } from "lucide-react";
import heroImage from "@/assets/team-member-2.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

interface ProjectData {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  year: string;
  technologies: string[];
  features: string[];
}

const Projects = () => {
  const { data: projects = [] } = useQuery<ProjectData[]>({
    queryKey: ["projects"],
    queryFn: () => fetchAPI<ProjectData[]>("/projects"),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Full gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-50/60 via-transparent to-teal-50/40 dark:from-green-900/20 dark:via-transparent dark:to-teal-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-cyan-50/40 via-transparent to-emerald-50/30 dark:from-cyan-900/15 dark:via-transparent dark:to-emerald-900/10"></div>
        
        {/* Content */}
        <div className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Portfolio Showcase
                </div>
                
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  Our{" "}
                  <span className="text-gradient bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Projects
                  </span>
                </h1>
                
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Explore our portfolio of successful web development projects that showcase our expertise, creativity, and commitment to delivering exceptional digital solutions that drive business growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="group hover-lift">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="hover-lift">
                  View All Services
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative lg:order-2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-600/15 z-10"></div>
                
                {/* Main image */}
                <img 
                  src={heroImage} 
                  alt="Our Projects Portfolio" 
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="glass-card p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Portfolio Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="glass-card p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Award Winning</div>
                        <div className="text-xs text-muted-foreground">Quality Projects</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project showcase overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="glass-card p-6 backdrop-blur-sm text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <div className="text-sm font-semibold">Featured Project</div>
                    <div className="text-xs text-muted-foreground">Tesh Engineering</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-500/40 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-teal-400/30 to-cyan-500/40 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/30 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each project represents our dedication to creating outstanding digital experiences that drive business success.
            </p>
          </div>
          
          {/* 4-Column Grid for Desktop, Responsive for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="glass-card hover-lift overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-0">
                  {/* Project Image/Preview */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-xl font-bold text-primary mb-2">{project.title}</div>
                        <div className="text-sm text-muted-foreground">{project.category}</div>
                      </div>
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/90 to-teal-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        variant="secondary"
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                        onClick={() => window.open(project.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </div>
                  
                  {/* Project Content */}
                  <div className="p-6">
                    {/* Project Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {project.year}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{project.category}</span>
                      </div>
                    </div>
                    
                    {/* Project Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    {/* Project Description */}
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-4">
                      {project.description}
                    </p>
                    
                    {/* Action Button */}
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="w-full hover-glow bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      onClick={() => window.open(project.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { metric: "50+", description: "Projects Completed" },
              { metric: "98%", description: "Client Satisfaction" },
              { metric: "5+", description: "Years Experience" },
              { metric: "24/7", description: "Support Available" }
            ].map((stat, index) => (
              <Card key={index} className="glass-card text-center hover-scale">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.metric}</div>
                  <p className="text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Card className="glass-card p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Let's bring your vision to life with a custom web solution that drives results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">Get Started Today</Button>
              <Button variant="outline" size="lg">View All Services</Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;