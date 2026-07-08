import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Save } from "lucide-react";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const AddLeadPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Business Info
    companyName: "",
    phone: "",
    whatsapp: "",
    email: "", // Primary email, map to companyEmail or email
    address: "",
    industry: "",
    companyWebsite: "",
    companySize: "",

    // Contact Person
    firstName: "", // Required by backend
    lastName: "",
    jobTitle: "",
    personalPhone: "", // map to phone if business phone is companyPhone

    // Lead Info
    leadSource: "", // Required by backend
    assignedToId: "",
    status: "New Lead",
    priority: "Medium",

    // Project Info
    projectTitle: "", // Required by backend
    projectType: "",
    projectSummary: "",
    requirements: "",
    expectedUsers: "",

    // Budget & Timeline
    estimatedBudget: "",
    currency: "BDT",
    budgetRange: "",
    expectedStartDate: "",
    expectedDeliveryTimeline: "",

    // Attachments & Notes
    notes: "",
  });

  // Fetch active employees (for assignment)
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: () => fetchAPI<Employee[]>("/user/employees"),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      fetchAPI("/leads", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leadsStats"] });
      toast.success("Lead created successfully");
      navigate("/admin/leads");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create lead");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "none" ? "" : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map formData to DTO (sending null for empty strings)
    const payload = {
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      email: formData.email || null,
      phone: formData.personalPhone || formData.phone || null,
      whatsapp: formData.whatsapp || null,
      jobTitle: formData.jobTitle || null,
      companyName: formData.companyName || null,
      companyEmail: formData.email || null,
      companyPhone: formData.phone || null,
      address: formData.address || null,
      industry: formData.industry || null,
      companyWebsite: formData.companyWebsite || null,
      companySize: formData.companySize || null,
      projectTitle: formData.projectTitle || null,
      projectType: formData.projectType || null,
      projectSummary: formData.projectSummary || null,
      requirements: formData.requirements || null,
      expectedUsers: formData.expectedUsers || null,
      estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : null,
      budgetRange: formData.budgetRange || null,
      currency: formData.currency || "BDT",
      expectedStartDate: formData.expectedStartDate || null,
      expectedDeliveryTimeline: formData.expectedDeliveryTimeline || null,
      leadSource: formData.leadSource || null,
      status: formData.status || "New Lead",
      priority: formData.priority || "Medium",
      notes: formData.notes || null,
      assignedToId: formData.assignedToId || null,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/leads")}
            className="w-9 h-9 border-border/50 hover:bg-muted rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Create New Lead</h2>
            <p className="text-sm text-muted-foreground">Add a new prospect to your pipeline</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          {createMutation.isPending ? "Saving..." : "Save Lead"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        
        {/* 1. Business Information */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">1. Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Company Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
              <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input id="companyWebsite" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select value={formData.companySize} onValueChange={(val) => handleSelectChange("companySize", val)}>
                <SelectTrigger className="rounded-xl bg-transparent">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None selected</SelectItem>
                  <SelectItem value="1-10">1–10</SelectItem>
                  <SelectItem value="11-50">11–50</SelectItem>
                  <SelectItem value="51-200">51–200</SelectItem>
                  <SelectItem value="201-1000">201–1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 2. Contact Person Information */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">2. Contact Person Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalPhone">Direct Phone</Label>
              <Input id="personalPhone" name="personalPhone" value={formData.personalPhone} onChange={handleChange} className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* 3. Lead Information */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">3. Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Lead Source</Label>
              <Select value={formData.leadSource} onValueChange={(val) => handleSelectChange("leadSource", val)}>
                <SelectTrigger className="rounded-xl bg-transparent">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physical Visit">Physical Visit</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Google Search">Google Search</SelectItem>
                  <SelectItem value="Cold Email">Cold Email</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Existing Client">Existing Client</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead Owner</Label>
              <Select value={formData.assignedToId} onValueChange={(val) => handleSelectChange("assignedToId", val)}>
                <SelectTrigger className="rounded-xl bg-transparent">
                  <SelectValue placeholder="Assign employee..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
                <SelectTrigger className="rounded-xl bg-transparent">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Lead">New Lead</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                  <SelectItem value="Demo Completed">Demo Completed</SelectItem>
                  <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(val) => handleSelectChange("priority", val)}>
                <SelectTrigger className="rounded-xl bg-transparent">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 4. Project Information */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">4. Project Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input id="projectTitle" name="projectTitle" value={formData.projectTitle} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="projectSummary">Project Summary</Label>
              <Input id="projectSummary" name="projectSummary" value={formData.projectSummary} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="requirements">Detailed Requirements</Label>
              <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows={4} className="rounded-xl resize-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedUsers">Number of Users (Expected)</Label>
              <Input id="expectedUsers" name="expectedUsers" value={formData.expectedUsers} onChange={handleChange} className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* 5. Budget & Timeline */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">5. Budget & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="estimatedBudget">Estimated Budget</Label>
              <Input id="estimatedBudget" name="estimatedBudget" type="number" value={formData.estimatedBudget} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Input id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange} placeholder="e.g. $5k - $10k" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedStartDate">Expected Start Date</Label>
              <Input id="expectedStartDate" name="expectedStartDate" type="date" value={formData.expectedStartDate} onChange={handleChange} className="rounded-xl bg-transparent block" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryTimeline">Expected Delivery Timeline</Label>
              <Input id="expectedDeliveryTimeline" name="expectedDeliveryTimeline" value={formData.expectedDeliveryTimeline} onChange={handleChange} placeholder="e.g. 3 Months" className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* 6. Attachments (Placeholder) & 7. Notes */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">6. Attachments & 7. Notes</CardTitle>
            <CardDescription>File upload handling will be fully implemented in a later phase. Use notes for now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes & Additional Comments</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={5} className="rounded-xl resize-none" />
            </div>
          </CardContent>
        </Card>

      </form>
    </div>
  );
};
