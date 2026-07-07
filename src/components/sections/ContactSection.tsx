import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import { Send, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { toast } from "sonner";

export const ContactSection = () => {
  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => fetchAPI<Record<string, string>>("/settings"),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchAPI("/leads", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "N/A",
          subject: formData.subject || "Homepage Consultation Request",
          message: formData.message
        }),
      });
      toast.success("Consultation request sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Form */}
          <div className="space-y-8 slide-right">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Don't Miss Out
                <span className="text-gradient block">The Future!</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Ready to transform your business? Get in touch with our experts 
                and discover how we can help you achieve your technology goals.
              </p>
            </div>

            {/* Contact Form */}
            <Card className="glass-card hover-lift hover-glow">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="bg-surface-medium border-border hover-glow focus:scale-105 transition-all"
                      required
                    />
                    <Input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="bg-surface-medium border-border hover-glow focus:scale-105 transition-all"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="bg-surface-medium border-border hover-glow focus:scale-105 transition-all"
                    />
                    <Input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject / Company Name"
                      className="bg-surface-medium border-border hover-glow focus:scale-105 transition-all"
                    />
                  </div>
                  
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={4}
                    className="bg-surface-medium border-border resize-none hover-glow focus:scale-105 transition-all"
                    required
                  />
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full group hover-lift pulse-glow" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-2 group-hover:scale-110 transition-all" />
                  </Button>
                </form>
              </CardContent>
            </Card>

             {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center stagger-animation hover-scale">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 hover-lift pulse-glow">
                  <Phone className="h-6 w-6 text-primary rotate-in" />
                </div>
                <div className="font-semibold mb-1">Call Us</div>
                <div className="text-sm text-muted-foreground">{settings.company_phone || "+880 1919-850850"}</div>
              </div>
              
              <div className="text-center stagger-animation hover-scale">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 hover-lift pulse-glow">
                  <Mail className="h-6 w-6 text-primary rotate-in" />
                </div>
                <div className="font-semibold mb-1">Email Us</div>
                <div className="text-sm text-muted-foreground">{settings.company_email || "support@gknetsolutions.co.uk"}</div>
              </div>
              
              <div className="text-center stagger-animation hover-scale">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 hover-lift pulse-glow">
                  <MapPin className="h-6 w-6 text-primary rotate-in" />
                </div>
                <div className="font-semibold mb-1">Visit Us</div>
                <div className="text-xs text-muted-foreground leading-relaxed px-1">{settings.company_address || "846 HK Vertex Centre, Mirpur, Dhaka"}</div>
              </div>
            </div>
          </div>

          {/* Image & CTA */}
          <div className="space-y-8 slide-left">
            <div className="relative">
              <img 
                src={teamCollaboration}
                alt="Professional team collaboration and consultation"
                className="w-full h-auto rounded-2xl shadow-card hover-lift hover-tilt"
              />
              
              {/* Call-to-Action Card */}
              <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-xl max-w-xs float pulse-glow hover-scale">
                <h3 className="font-semibold mb-2">Free Consultation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get expert advice tailored to your business needs
                </p>
                <Button variant="outline" size="sm" className="w-full group hover-lift">
                  Schedule Call
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-2 group-hover:scale-110 transition-all" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};