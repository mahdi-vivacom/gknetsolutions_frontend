import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

interface PartnerData {
  id: number;
  name: string;
}

export const TestimonialsSection = () => {
  const { data: partners = [] } = useQuery<PartnerData[]>({
    queryKey: ["partners"],
    queryFn: () => fetchAPI<PartnerData[]>("/partners"),
  });

  const defaultCompanies = [
    "influence(You)",
    "tse",
    "monceau", 
    "coudac",
    "flomodia",
    "WEGLOT",
    "TechCorp",
    "DataFlow",
    "CloudSync",
    "DevTools"
  ];

  const companies = partners.length > 0 ? partners.map(p => p.name) : defaultCompanies;

  return (
    <section className="py-20 bg-surface-dark overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Over <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg">1000+</span> Companies with Techmino Here
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by leading companies worldwide for innovative technology solutions
          </p>
        </div>

        {/* Scrolling Logos */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-surface-dark to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-surface-dark to-transparent z-10" />
          
          {/* Main scrolling container */}
          <div className="flex animate-scroll-left">
            {/* First set of logos */}
            <div className="flex items-center space-x-8 min-w-max">
              {companies.map((company, index) => (
                <div
                  key={`first-${index}`}
                  className="flex items-center justify-center h-20 px-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-300 hover:bg-card/70"
                >
                  <span className="text-foreground/80 font-semibold text-lg whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-8 min-w-max ml-8">
              {companies.map((company, index) => (
                <div
                  key={`second-${index}`}
                  className="flex items-center justify-center h-20 px-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-300 hover:bg-card/70"
                >
                  <span className="text-foreground/80 font-semibold text-lg whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reverse scrolling row */}
        <div className="relative mt-8">
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-surface-dark to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-surface-dark to-transparent z-10" />
          
          <div className="flex animate-scroll-right">
            <div className="flex items-center space-x-8 min-w-max">
              {companies.slice().reverse().map((company, index) => (
                <div
                  key={`reverse-first-${index}`}
                  className="flex items-center justify-center h-20 px-8 bg-card/30 backdrop-blur-sm rounded-xl border border-border/10 hover:border-primary/20 transition-all duration-300 hover:bg-card/50"
                >
                  <span className="text-foreground/60 font-medium text-base whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-8 min-w-max ml-8">
              {companies.slice().reverse().map((company, index) => (
                <div
                  key={`reverse-second-${index}`}
                  className="flex items-center justify-center h-20 px-8 bg-card/30 backdrop-blur-sm rounded-xl border border-border/10 hover:border-primary/20 transition-all duration-300 hover:bg-card/50"
                >
                  <span className="text-foreground/60 font-medium text-base whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};