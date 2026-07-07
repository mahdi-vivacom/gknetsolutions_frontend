import { Separator } from "@/components/ui/separator";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";


interface FooterLinkData {
  id: number;
  columnName: string;
  name: string;
  href: string;
  orderIndex: number;
}

export const Footer = () => {
  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetchAPI<Record<string, string>>("/settings"),
  });

  const { data: footerLinksData = [] } = useQuery<FooterLinkData[]>({
    queryKey: ["footerLinks"],
    queryFn: () => fetchAPI<FooterLinkData[]>("/footer-links"),
  });

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: settings.linkedin_url || "#", label: "LinkedIn" },
    { icon: Twitter, href: settings.twitter_url || "#", label: "Twitter" },
    { icon: Github, href: settings.github_url || "#", label: "GitHub" },
    { icon: Mail, href: settings.email_address || "#", label: "Email" }
  ];

  const companyLinks = footerLinksData.filter(l => l.columnName === "company");
  const servicesLinks = footerLinksData.filter(l => l.columnName === "services");
  const resourcesLinks = footerLinksData.filter(l => l.columnName === "resources");

  const defaultLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "/contact" }
    ],
    services: [
      { name: "Web Design", href: "/services/web-development" },
      { name: "E-commerce", href: "/services/custom-software" },
      { name: "SEO Optimization", href: "/services/seo" },
      { name: "Speed Optimization", href: "/services/custom-software" }
    ],
    resources: [
      { name: "Blog", href: "#" },
      { name: "Case Studies", href: "/projects" },
      { name: "Whitepapers", href: "#" },
      { name: "Support", href: "/contact" }
    ]
  };

  const companyLinksList = companyLinks.length > 0 ? companyLinks : defaultLinks.company;
  const servicesLinksList = servicesLinks.length > 0 ? servicesLinks : defaultLinks.services;
  const resourcesLinksList = resourcesLinks.length > 0 ? resourcesLinks : defaultLinks.resources;


  return (
    <footer className="bg-surface-dark border-t border-border">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
                {settings.brand_name || "Gknetsolutions"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Creating lucrative web designs that thrive. We build fast, 
                responsive websites that boost your business growth.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-surface-medium rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinksList.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {servicesLinksList.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourcesLinksList.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <Separator className="bg-border" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} {settings.brand_name || "Gknet Solutions"} Ltd. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};