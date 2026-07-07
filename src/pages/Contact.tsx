import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import contactImage from "@/assets/contact-bg.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, MessageCircle, Home, ArrowRight, Bell, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fetchAPI } from "@/lib/api";


const Contact = () => {
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

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchAPI("/leads", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Message submitted successfully! We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Contact Us Banner Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 dark:bg-gradient-to-br dark:from-card dark:via-surface-light dark:to-primary/10">
        {/* Background Image - Only show in light theme */}
        <div className="absolute inset-0 dark:hidden">
          <img 
            src={contactImage} 
            alt="Technology Background" 
            className="w-full h-full object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>
        
        {/* Background Pattern for Dark Theme */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Contact us
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Home</span>
              <span className="mx-2">&gt;</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reach Out Us Now Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-6">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Reach Out Us Now!
            </h2>
          </div> */}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Our Location Card */}
            <Card className="contact-card">
              <CardContent className="p-6 text-center">
                <div className="contact-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Our location</h3>
                <p className="text-sm text-muted-foreground">
                846 HK Vertex Centre, 7th floor, East Shewraparabr Metro Pillar 318, Mirpur, Dhaka
                </p>
              </CardContent>
            </Card>

            {/* Email Us Card */}
            <Card className="contact-card">
              <CardContent className="p-6 text-center">
                <div className="contact-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Email us</h3>
                <p className="text-sm text-muted-foreground">
                  support@gknetsolutions.co.uk<br />
                  hello@gknetsolutions.co.uk
                </p>
              </CardContent>
            </Card>

            {/* Call Us Card */}
            <Card className="contact-card">
              <CardContent className="p-6 text-center">
                <div className="contact-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Call us</h3>
                <p className="text-sm text-muted-foreground">
                +880 1919-850850<br /></p>
              </CardContent>
            </Card>

            {/* Live Chat Card */}
            <Card className="contact-card">
              <CardContent className="p-6 text-center">
                <div className="contact-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Live chat</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  livechat@gknetsolutions.co.uk
                </p>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  Need Help?
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feel Free Contact with Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Contact Form */}
            <div className="flex">
              <Card className="contact-card flex-1">
              <CardContent className="p-8 h-full flex flex-col">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-foreground">
                Feel Free Contact with Us!
              </h2>
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Name*</label>
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name" 
                        className="form-input"
                        required
                      />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Email*</label>
                      <Input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email" 
                        className="form-input"
                        required
                      />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Phone*</label>
                      <Input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number" 
                        className="form-input"
                        required
                      />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Subject*</label>
                      <Select value={formData.subject} onValueChange={handleSubjectChange}>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Custom Software">Custom Software</SelectItem>
                          <SelectItem value="SEO Services">SEO Services</SelectItem>
                          <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                          <SelectItem value="POS Solutions">POS Solutions</SelectItem>
                          <SelectItem value="ERP Development">ERP Development</SelectItem>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Message*</label>
                    <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        rows={5}
                        className="form-input"
                        required
                    />
                  </div>
                  
                    <div className="mt-auto">
                      <Button 
                        type="submit"
                        variant="default" 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover-glow"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Now"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                </form>
              </CardContent>
            </Card>
                    </div>
                    
            {/* Map Section */}
            <div className="flex">
              <Card className="contact-card overflow-hidden flex-1">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-muted">
                <iframe
                      src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7301.400409900802!2d90.36866089265591!3d23.793687714563223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s846%20HK%20Vertex%20Centre%2C%207th%20floor%2C%20East%20Shewrapara%2C%20Metro%20Pillar%20318%2C%20Mirpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1778871427903!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
            </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

export default Contact;