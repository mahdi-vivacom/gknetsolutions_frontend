import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";
import teamMember3 from "@/assets/team-member-3.jpg";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

interface TeamMemberData {
  id: number;
  name: string;
  role: string;
  image: string;
  experience: string;
  expertise: string[];
  linkedin: string;
  twitter: string;
  email: string;
}

const imageMap: Record<string, string> = {
  teamMember1,
  teamMember2,
  teamMember3
};

const getMemberImage = (imageKey: string) => {
  return imageMap[imageKey] || teamMember1;
};


export const TeamSection = () => {
  const { data: teamMembers = [] } = useQuery<TeamMemberData[]>({
    queryKey: ["teamMembers"],
    queryFn: () => fetchAPI<TeamMemberData[]>("/team-members"),
  });
  return (
    <section className="py-24 bg-surface-dark">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Our Expert Team
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet Our Talented
            <span className="text-gradient block">Integration Experts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our diverse team of technology experts brings decades of combined experience 
            in delivering innovative solutions for businesses worldwide.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.name}
              className="glass-card hover-lift hover-tilt group overflow-hidden stagger-animation"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={getMemberImage(member.image)}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-64 object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
                  />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 flex gap-3">
                      <a 
                        href={member.linkedin}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-glow hover-scale pulse-glow transition-all"
                      >
                        <Linkedin className="h-4 w-4 text-primary-foreground" />
                      </a>
                      <a 
                        href={member.twitter}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-glow hover-scale pulse-glow transition-all"
                      >
                        <Twitter className="h-4 w-4 text-primary-foreground" />
                      </a>
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-glow hover-scale pulse-glow transition-all"
                      >
                        <Mail className="h-4 w-4 text-primary-foreground" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {member.experience}
                    </Badge>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};