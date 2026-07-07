import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchAPI } from "@/lib/api";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Layers, 
  Briefcase,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Zod validation schemas
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  category: z.string().min(2, "Category must be at least 2 characters long"),
  year: z.string().regex(/^\d{4}$/, "Must be a 4-digit year"),
  technologies: z.string().min(2, "Enter technologies (comma separated)"),
  features: z.string().min(5, "Enter key features (comma separated)"),
});

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(2, "Icon name is required (e.g. Globe, Code)"),
  iconBg: z.string().min(2, "Icon background color class is required (e.g. bg-blue-500/10)"),
  iconColor: z.string().min(2, "Icon color class is required (e.g. text-blue-500)"),
  gradient: z.string().min(2, "Gradient class is required (e.g. from-blue-500/10 to-purple-500/10)"),
  link: z.string().min(2, "Frontend route is required (e.g. /services/web-development)"),
  slug: z.string().min(2, "Unique URL slug is required (e.g. web-development)"),
  heroBadge: z.string().optional(),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type ServiceFormValues = z.infer<typeof serviceSchema>;

export const DynamicFormPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isService = location.pathname.includes("/services/");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Zod schema selection
  const schema = isService ? serviceSchema : projectSchema;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: isService ? {
      icon: "Code",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      gradient: "from-primary/10 to-primary-glow/10",
    } : {
      year: new Date().getFullYear().toString()
    }
  });

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: (formData: any) => {
      const endpoint = isService ? "/services" : "/projects";
      return fetchAPI(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      toast.success(
        isService 
          ? "Service created successfully! It is now live in the database." 
          : "Project created successfully! It is now seeded to your portfolio."
      );
      queryClient.invalidateQueries({ queryKey: isService ? ["services"] : ["projects"] });
      reset();
      setImagePreview(null);
      setSelectedFile(null);
      navigate("/admin");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An error occurred while writing to the database. Make sure endpoints are active.");
    }
  });

  // Handle local image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Generate object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      toast.info(`Selected file: ${file.name} (Ready for submission preview)`);
    }
  };

  const onSubmit = (values: any) => {
    // Modify technologies and features comma-separated strings to array format for Projects
    if (!isService) {
      const formattedValues = {
        ...values,
        technologies: values.technologies.split(",").map((t: string) => t.trim()),
        features: values.features.split(",").map((f: string) => f.trim()),
      };
      mutation.mutate(formattedValues);
    } else {
      mutation.mutate(values);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/admin")}
          className="border-border/50 hover:bg-muted rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isService ? "Create New Service Category" : "Add Portfolio Project"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isService 
              ? "Register a new service route and detail content synced with database settings" 
              : "Register a completed customer project to showcase on the websites page"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Form Inputs */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/40 shadow-lg bg-card/60 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                {isService ? <Layers className="w-5 h-5 text-primary" /> : <Briefcase className="w-5 h-5 text-primary" />}
                <span>General Information</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Fill out the required information to populate the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {isService ? (
                  /* SERVICES FORM FIELDS */
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold">Service Title</Label>
                        <Input 
                          id="title" 
                          placeholder="e.g. Custom Software" 
                          {...register("title")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.title && <span className="text-xs text-destructive font-semibold">{errors.title.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-xs font-bold">Unique Slug</Label>
                        <Input 
                          id="slug" 
                          placeholder="e.g. custom-software" 
                          {...register("slug")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.slug && <span className="text-xs text-destructive font-semibold">{errors.slug.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-xs font-bold">Main Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Detailed service summary..." 
                        {...register("description")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl min-h-[100px]"
                      />
                      {errors.description && <span className="text-xs text-destructive font-semibold">{errors.description.message}</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="icon" className="text-xs font-bold">Lucide Icon</Label>
                        <Input 
                          id="icon" 
                          placeholder="e.g. Code, Globe" 
                          {...register("icon")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.icon && <span className="text-xs text-destructive font-semibold">{errors.icon.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="iconBg" className="text-xs font-bold">Icon Bg Class</Label>
                        <Input 
                          id="iconBg" 
                          placeholder="e.g. bg-blue-500/10" 
                          {...register("iconBg")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.iconBg && <span className="text-xs text-destructive font-semibold">{errors.iconBg.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="iconColor" className="text-xs font-bold">Icon Color Class</Label>
                        <Input 
                          id="iconColor" 
                          placeholder="e.g. text-blue-500" 
                          {...register("iconColor")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.iconColor && <span className="text-xs text-destructive font-semibold">{errors.iconColor.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gradient" className="text-xs font-bold">Background Gradient Class</Label>
                        <Input 
                          id="gradient" 
                          placeholder="from-blue-500/10 to-purple-500/10" 
                          {...register("gradient")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.gradient && <span className="text-xs text-destructive font-semibold">{errors.gradient.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link" className="text-xs font-bold">Frontend Route Link</Label>
                        <Input 
                          id="link" 
                          placeholder="/services/custom-software" 
                          {...register("link")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.link && <span className="text-xs text-destructive font-semibold">{errors.link.message}</span>}
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-4 mt-4 space-y-4">
                      <h3 className="text-sm font-semibold text-foreground">Dynamic Page Specifics</h3>
                      <div className="space-y-2">
                        <Label htmlFor="heroBadge" className="text-xs font-bold">Hero Badge (Optional)</Label>
                        <Input id="heroBadge" placeholder="e.g. 💻 Bespoke Software" {...register("heroBadge")} className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heroTitle" className="text-xs font-bold">Hero Title (Optional)</Label>
                        <Input id="heroTitle" placeholder="e.g. Bespoke Software Engineering" {...register("heroTitle")} className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heroDescription" className="text-xs font-bold">Hero Description (Optional)</Label>
                        <Textarea id="heroDescription" placeholder="Description for individual hero banner" {...register("heroDescription")} className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* PROJECTS FORM FIELDS */
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-xs font-bold">Project Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Tesh Engineering" 
                        {...register("title")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                      />
                      {errors.title && <span className="text-xs text-destructive font-semibold">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-xs font-bold">Category</Label>
                        <Input 
                          id="category" 
                          placeholder="e.g. Engineering" 
                          {...register("category")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.category && <span className="text-xs text-destructive font-semibold">{errors.category.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-xs font-bold">Year</Label>
                        <Input 
                          id="year" 
                          placeholder="e.g. 2025" 
                          {...register("year")} 
                          className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                        {errors.year && <span className="text-xs text-destructive font-semibold">{errors.year.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-xs font-bold">Project URL</Label>
                      <Input 
                        id="url" 
                        placeholder="https://example.com" 
                        {...register("url")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                      />
                      {errors.url && <span className="text-xs text-destructive font-semibold">{errors.url.message}</span>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-xs font-bold">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Detailed project summary..." 
                        {...register("description")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl min-h-[100px]"
                      />
                      {errors.description && <span className="text-xs text-destructive font-semibold">{errors.description.message}</span>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technologies" className="text-xs font-bold">Technologies (Comma separated)</Label>
                      <Input 
                        id="technologies" 
                        placeholder="React, Node.js, Tailwind CSS" 
                        {...register("technologies")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                      />
                      {errors.technologies && <span className="text-xs text-destructive font-semibold">{errors.technologies.message}</span>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="features" className="text-xs font-bold">Key Features (Comma separated)</Label>
                      <Input 
                        id="features" 
                        placeholder="Responsive Design, Stripe booking system" 
                        {...register("features")} 
                        className="bg-background/50 border-border/50 focus-visible:ring-primary rounded-xl"
                      />
                      {errors.features && <span className="text-xs text-destructive font-semibold">{errors.features.message}</span>}
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-border/30">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/admin")}
                    className="border-border/50 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md min-w-[120px]"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Record"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Asset Upload & Preview */}
        <div className="space-y-6">
          <Card className="border border-border/40 shadow-lg bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span>Feature Asset Upload</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Upload or review the cover image preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border/50 group shadow-md">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label 
                      htmlFor="image-upload-reselect" 
                      className="bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold shadow cursor-pointer hover:bg-white/90 transition"
                    >
                      Change File
                    </label>
                  </div>
                </div>
              ) : (
                <div className="h-48 rounded-xl border-2 border-dashed border-border/50 bg-background/30 flex flex-col items-center justify-center p-6 text-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-xs text-muted-foreground font-semibold mb-2">No image file selected</p>
                  <span className="text-[10px] text-muted-foreground/80">Support PNG, JPG, or WEBP formats</span>
                </div>
              )}

              <div className="flex justify-center">
                <input
                  type="file"
                  id="image-upload-select"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <input
                  type="file"
                  id="image-upload-reselect"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload-select"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 border border-border/50 hover:bg-muted text-xs font-semibold rounded-xl shadow cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Context Advisory Card */}
          <Card className="border border-destructive/10 bg-destructive/5 rounded-2xl p-4">
            <div className="flex space-x-3 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider">Dynamic Sync Warning</h4>
                <p className="text-xs leading-relaxed text-muted-foreground/90">
                  Submitting this form immediately adds rows to the database. These changes propagate to the frontend pages automatically.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
