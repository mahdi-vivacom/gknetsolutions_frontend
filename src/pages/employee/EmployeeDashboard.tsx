import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  LogOut,
  Plus,
  MessageSquare,
  Calendar,
  Send,
  Eye,
  ClipboardList,
  Target,
  Mail,
  Phone,
  Linkedin,
  Clock,
  Video,
  Globe,
  Building2,
  Compass,
  UserCheck,
  Award,
  AlertCircle,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";

// Import FullCalendar plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface LeadHistory {
  id: string;
  activityType: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string;
  createdAt: string;
  performedBy: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

interface CalendarEventBackend {
  id: string;
  title: string;
  eventType: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  lead?: {
    id: string;
    firstName: string;
    lastName?: string;
    companyName?: string;
  };
}

interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  linkedinProfile?: string;
  skypeId?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  country?: string;
  timezone: string;
  projectTitle: string;
  requirements?: string;
  estimatedBudget?: number;
  currency: string;
  leadSource: string;
  status: string;
  assignedTo?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  histories?: LeadHistory[];
  createdAt?: string;
}

interface LeadsStats {
  totalLeads: number;
  wonLeads: number;
  lostLeads: number;
  activeLeads: number;
  wonValue: number;
  conversionRate: number;
}

const KANBAN_STAGES = [
  { label: "New Lead", value: "New Lead", color: "border-t-blue-500" },
  { label: "Contacted", value: "Contacted", color: "border-t-sky-500" },
  { label: "Qualified", value: "Qualified", color: "border-t-indigo-500" },
  { label: "Meeting Scheduled", value: "Meeting Scheduled", color: "border-t-purple-500" },
  { label: "Demo Completed", value: "Demo Completed", color: "border-t-pink-500" },
  { label: "Proposal Sent", value: "Proposal Sent", color: "border-t-amber-500" },
  { label: "Negotiation", value: "Negotiation", color: "border-t-teal-500" },
  { label: "Won", value: "Won", color: "border-t-emerald-500" },
  { label: "Lost", value: "Lost", color: "border-t-destructive" },
  { label: "Follow-up Later", value: "Follow-up Later", color: "border-t-slate-500" },
];

interface DateTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  id?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, id }) => {
  const selectedDate = value ? new Date(value) : undefined;
  const selectedTime = value && value.includes("T") ? value.split("T")[1].substring(0, 5) : "09:00";

  const timeSlots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const hStr = hour.toString().padStart(2, "0");
      const mStr = min.toString().padStart(2, "0");
      timeSlots.push(`${hStr}:${mStr}`);
    }
  }

  const formatTimeSlot = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m.toString().padStart(2, "0");
    return `${displayHour}:${displayMin} ${ampm}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}T${selectedTime}`);
  };

  const handleTimeSelect = (time: string) => {
    const datePart = value && value.includes("T") ? value.split("T")[0] : (() => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = (today.getMonth() + 1).toString().padStart(2, "0");
      const dd = today.getDate().toString().padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    })();
    onChange(`${datePart}T${time}`);
  };

  return (
    <div className="flex gap-2 w-full" id={id}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 justify-start text-left font-normal bg-slate-950 border-slate-850 text-white text-xs h-9 hover:bg-slate-900"
          >
            <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
            {selectedDate && !isNaN(selectedDate.getTime()) ? format(selectedDate, "PPP") : <span className="text-slate-500">Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800 text-white" align="start">
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-slate-900 text-white"
          />
        </PopoverContent>
      </Popover>

      <select
        value={selectedTime}
        onChange={(e) => handleTimeSelect(e.target.value)}
        className="w-28 bg-slate-950 border border-slate-850 text-white text-xs rounded p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none"
      >
        {timeSlots.map((slot) => (
          <option key={slot} value={slot}>
            {formatTimeSlot(slot)}
          </option>
        ))}
      </select>
    </div>
  );
};

export const EmployeeDashboard: React.FC = () => {
  const { user, logout, loading: loadingAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<"pipeline" | "calendar">("pipeline");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newLogNote, setNewLogNote] = useState("");
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Quick Meeting schedule form state (inline in actions panel)
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState("");
  const [meetingEndTime, setMeetingEndTime] = useState("");
  const [meetingType, setMeetingType] = useState("Meeting");
  const [meetingLink, setMeetingLink] = useState("");

  // Daily agenda date state
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<Date>(new Date());

  // Create Lead Modal and Form state
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const [leadFirstName, setLeadFirstName] = useState("");
  const [leadLastName, setLeadLastName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadLinkedin, setLeadLinkedin] = useState("");
  const [leadSkype, setLeadSkype] = useState("");
  const [leadCompanyName, setLeadCompanyName] = useState("");
  const [leadCompanyWebsite, setLeadCompanyWebsite] = useState("");
  const [leadCompanySize, setLeadCompanySize] = useState("1-10");
  const [leadCountry, setLeadCountry] = useState("");
  const [leadTimezone, setLeadTimezone] = useState("UTC");
  const [leadProjectTitle, setLeadProjectTitle] = useState("");
  const [leadRequirements, setLeadRequirements] = useState("");
  const [leadBudget, setLeadBudget] = useState("0");
  const [leadCurrency, setLeadCurrency] = useState("USD");
  const [leadSource, setLeadSource] = useState("LinkedIn");

  // Drag state for visual hover effects
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Redirect if unauthorized
  React.useEffect(() => {
    if (!loadingAuth && !user) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

  // Fetch employee leads
  const { data: leads = [], isLoading: loadingLeads } = useQuery<Lead[]>({
    queryKey: ["employeeLeads"],
    queryFn: () => fetchAPI<Lead[]>("/leads"),
    enabled: !!user,
  });

  // Fetch personal statistics
  const { data: stats, isLoading: loadingStats } = useQuery<LeadsStats>({
    queryKey: ["employeeStats"],
    queryFn: () => fetchAPI<LeadsStats>("/leads/stats"),
    enabled: !!user,
  });

  // Fetch calendar events
  const { data: calendarEvents = [], isLoading: loadingCalendar } = useQuery<CalendarEventBackend[]>({
    queryKey: ["employeeCalendarEvents"],
    queryFn: () => fetchAPI<CalendarEventBackend[]>("/calendar"),
    enabled: !!user,
  });

  // Fetch selected lead details (histories)
  const { data: leadDetails, refetch: refetchLeadDetails } = useQuery<Lead>({
    queryKey: ["leadDetails", selectedLeadId],
    queryFn: () => fetchAPI<Lead>(`/leads/${selectedLeadId}`),
    enabled: !!selectedLeadId,
  });

  // Create Lead Mutation
  const createLeadMutation = useMutation({
    mutationFn: (newLead: any) =>
      fetchAPI<Lead>("/leads", {
        method: "POST",
        body: JSON.stringify(newLead),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeLeads"] });
      queryClient.invalidateQueries({ queryKey: ["employeeStats"] });
      setShowCreateLeadModal(false);
      resetCreateForm();
      toast.success("Lead created successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create lead");
    }
  });

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ leadId, status, event }: { leadId: string; status: string; event?: any }) =>
      fetchAPI<Lead>(`/leads/${leadId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, event }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeLeads"] });
      queryClient.invalidateQueries({ queryKey: ["employeeStats"] });
      queryClient.invalidateQueries({ queryKey: ["employeeCalendarEvents"] });
      if (selectedLeadId) refetchLeadDetails();
      toast.success("Lead status updated successfully");
      setShowScheduleForm(false);
      resetMeetingForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update lead status");
    }
  });

  // Update Budget Mutation
  const budgetMutation = useMutation({
    mutationFn: ({ leadId, budget }: { leadId: string; budget: number }) =>
      fetchAPI<Lead>(`/leads/${leadId}/budget`, {
        method: "PUT",
        body: JSON.stringify({ budget }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeLeads"] });
      queryClient.invalidateQueries({ queryKey: ["employeeStats"] });
      if (selectedLeadId) refetchLeadDetails();
      toast.success("Budget updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update budget");
    }
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingAuth || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Validating employee session...</p>
        </div>
      </div>
    );
  }

  const resetMeetingForm = () => {
    setMeetingTitle("");
    setMeetingStartTime("");
    setMeetingEndTime("");
    setMeetingType("Meeting");
    setMeetingLink("");
  };

  const resetCreateForm = () => {
    setLeadFirstName("");
    setLeadLastName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadLinkedin("");
    setLeadSkype("");
    setLeadCompanyName("");
    setLeadCompanyWebsite("");
    setLeadCompanySize("1-10");
    setLeadCountry("");
    setLeadTimezone("UTC");
    setLeadProjectTitle("");
    setLeadRequirements("");
    setLeadBudget("0");
    setLeadCurrency("USD");
    setLeadSource("Website");
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, statusValue: string) => {
    e.preventDefault();
    if (dragOverColumn !== statusValue) {
      setDragOverColumn(statusValue);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData("text/plain");

    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status !== targetStatus) {
      if (targetStatus === "Meeting Scheduled") {
        setSelectedLeadId(leadId);
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = (today.getMonth() + 1).toString().padStart(2, "0");
        const dd = today.getDate().toString().padStart(2, "0");
        setMeetingStartTime(`${yyyy}-${mm}-${dd}T10:00`);
        setMeetingEndTime(`${yyyy}-${mm}-${dd}T11:00`);
        setMeetingTitle(`Discovery Call with ${lead.firstName}`);
        setShowScheduleForm(true);
        toast.info("Please fill in calendar details to schedule meeting.");
      } else {
        statusMutation.mutate({ leadId, status: targetStatus });
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim() || !selectedLeadId) return;

    setIsSubmittingLog(true);
    try {
      await fetchAPI(`/leads/${selectedLeadId}/logs`, {
        method: "POST",
        body: JSON.stringify({ note: newLogNote }),
      });
      setNewLogNote("");
      refetchLeadDetails();
      toast.success("Timeline note logged");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit note");
    } finally {
      setIsSubmittingLog(false);
    }
  };

  const handleScheduleMeetingDirectly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !meetingStartTime || !meetingEndTime || !meetingTitle) return;

    const eventPayload = {
      title: meetingTitle,
      startTime: new Date(meetingStartTime).toISOString(),
      endTime: new Date(meetingEndTime).toISOString(),
      eventType: meetingType,
      meetingLink: meetingLink || null,
    };

    statusMutation.mutate({
      leadId: selectedLeadId,
      status: "Meeting Scheduled",
      event: eventPayload
    });
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFirstName || !leadEmail || !leadProjectTitle || !leadSource) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      firstName: leadFirstName,
      lastName: leadLastName || null,
      email: leadEmail,
      phone: leadPhone || null,
      linkedinProfile: leadLinkedin || null,
      skypeId: leadSkype || null,
      companyName: leadCompanyName || null,
      companyWebsite: leadCompanyWebsite || null,
      companySize: leadCompanySize || null,
      country: leadCountry || null,
      timezone: leadTimezone,
      projectTitle: leadProjectTitle,
      requirements: leadRequirements || null,
      estimatedBudget: parseFloat(leadBudget) || 0,
      currency: leadCurrency,
      leadSource: leadSource,
      status: "New Lead",
      assignedToId: user.id
    };

    createLeadMutation.mutate(payload);
  };

  // Convert stats to FullCalendar format
  const getEventColors = (type: string) => {
    switch (type) {
      case "Meeting":
        return { bg: "#4f46e5", border: "#4338ca" }; // Indigo
      case "Demo":
        return { bg: "#ec4899", border: "#db2777" }; // Pink
      case "Proposal Review":
        return { bg: "#eab308", border: "#ca8a04" }; // Gold
      case "Follow-up Call":
        return { bg: "#10b981", border: "#059669" }; // Emerald
      default:
        return { bg: "#6b7280", border: "#4b5563" }; // Gray
    }
  };

  const mappedCalendarEvents = calendarEvents.map(event => {
    const leadName = event.lead
      ? `${event.lead.firstName} ${event.lead.lastName || ""}`.trim()
      : "Unlinked Lead";
    const company = event.lead?.companyName ? ` (${event.lead.companyName})` : "";
    const colors = getEventColors(event.eventType);

    return {
      id: event.id,
      title: `${event.title} - ${leadName}${company}`,
      start: event.startTime,
      end: event.endTime,
      extendedProps: {
        leadId: event.lead?.id || "",
        leadName,
        eventType: event.eventType,
        meetingLink: event.meetingLink
      },
      backgroundColor: colors.bg,
      borderColor: colors.border
    };
  });

  const handleEventClick = (info: EventClickArg) => {
    const leadId = info.event.extendedProps.leadId;
    if (leadId) {
      setSelectedLeadId(leadId);
    } else {
      toast.error("This event is not linked to any lead.");
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter agenda events for selectedAgendaDate
  const agendaEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.startTime);
    return isSameDay(eventDate, selectedAgendaDate);
  });

  // Sort agenda events by startTime asc
  agendaEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const target = user.monthlyTarget || 0;
  const currentWins = stats?.wonValue || 0;
  const targetPercent = target > 0 ? Math.min(100, Math.round((currentWins / target) * 100)) : 0;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (targetPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar Overlay (Mobile) */}
      {!sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-card border-r border-border/50 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
          } -translate-x-full lg:translate-x-0 lg:static h-screen`}
        style={{
          transform: sidebarOpen ? undefined : "translateX(0)"
        }}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              GK
            </div>
            {sidebarOpen && (
              <div className="leading-none text-left">
                <span className="font-bold text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent block">
                  GKNet CRM
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold">Employee Hub</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {/* Pipeline Button */}
          <button
            onClick={() => setCurrentTab("pipeline")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${currentTab === "pipeline"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <LayoutDashboard className={`w-5 h-5 shrink-0 ${currentTab === "pipeline" ? "" : "group-hover:scale-110 transition-transform"}`} />
            {sidebarOpen && <span className="text-sm">Pipeline Board</span>}
          </button>

          {/* Calendar Button */}
          <button
            onClick={() => setCurrentTab("calendar")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${currentTab === "calendar"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <Calendar className={`w-5 h-5 shrink-0 ${currentTab === "calendar" ? "" : "group-hover:scale-110 transition-transform"}`} />
            {sidebarOpen && <span className="text-sm">Meetings Calendar</span>}
          </button>

          {/* Create Lead Button */}
          <button
            onClick={() => setShowCreateLeadModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-orange-500 hover:bg-orange-500/10 transition-all duration-200 group"
          >
            <PlusCircle className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="text-sm">Add New Lead</span>}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/50 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-card/80 border-b border-border/50 flex items-center justify-between px-6 lg:px-8 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground">Employee Workspace</h1>
              <p className="text-[10px] text-muted-foreground">Manage your operations, pipeline leads, and events</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2.5 p-1.5 bg-muted/40 rounded-xl border border-border/40">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs uppercase">
                {user.firstName[0] + (user.lastName?.[0] || "")}
              </div>
              <div className="hidden md:block text-left pr-1">
                <div className="text-xs font-semibold leading-none">{user.firstName} {user.lastName || ""}</div>
                <span className="text-[9px] text-muted-foreground font-bold capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-8 bg-background/50">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* KPI Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Circular progress target ring */}
              <Card className="glass-card border border-border/40 shadow-lg relative overflow-hidden flex items-center p-5">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-muted"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-orange-500 transition-all duration-500"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-foreground">{targetPercent}%</span>
                </div>
                <div className="ml-5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Monthly Target</span>
                  <span className="text-xl font-bold block text-foreground">${currentWins.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground">
                    of <span className="font-semibold text-slate-400">${target.toLocaleString()}</span> target
                  </span>
                </div>
              </Card>

              {/* Assigned Leads */}
              <Card className="glass-card border border-border/40 shadow-lg p-5 flex items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="ml-5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Assigned Leads</span>
                  <span className="text-2xl font-black block text-foreground">
                    {loadingStats ? <Skeleton className="h-6 w-12" /> : stats?.totalLeads || 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">in active funnel</span>
                </div>
              </Card>

              {/* Leads won */}
              <Card className="glass-card border border-border/40 shadow-lg p-5 flex items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="ml-5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Monthly Wins</span>
                  <span className="text-2xl font-black block text-foreground">
                    {loadingStats ? <Skeleton className="h-6 w-12" /> : stats?.wonLeads || 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">converted deals</span>
                </div>
              </Card>

              {/* Conversion win rate */}
              <Card className="glass-card border border-border/40 shadow-lg p-5 flex items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div className="ml-5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Conversion Rate</span>
                  <span className="text-2xl font-black block text-foreground">
                    {loadingStats ? <Skeleton className="h-6 w-12" /> : `${stats?.conversionRate || 0}%`}
                  </span>
                  <span className="text-[10px] text-muted-foreground">deal conversion rate</span>
                </div>
              </Card>
            </div>

            {/* PIPELINE VIEW */}
            {currentTab === "pipeline" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-foreground">My Active Funnel</h3>
                  <span className="text-xs text-muted-foreground font-semibold">Drag cards between columns to transition status</span>
                </div>

                {/* Kanban Columns */}
                <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 select-none min-h-[500px]">
                  {KANBAN_STAGES.map((column) => {
                    const columnLeads = leads.filter(l => l.status === column.value);
                    const isOver = dragOverColumn === column.value;

                    return (
                      <div
                        key={column.value}
                        onDragOver={(e) => handleDragOver(e, column.value)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, column.value)}
                        className={`w-72 shrink-0 bg-card/60 backdrop-blur-md rounded-2xl border border-border/40 flex flex-col p-4 transition-all duration-200 ${isOver ? "bg-muted/40 border-orange-500/30 ring-2 ring-orange-500/10 scale-[1.01]" : ""
                          }`}
                      >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/30">
                          <span className="text-xs font-extrabold text-foreground">{column.label}</span>
                          <Badge variant="secondary" className="px-2 py-0 text-[10px] rounded-md font-bold bg-muted/80">
                            {columnLeads.length}
                          </Badge>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[550px] pr-0.5">
                          {loadingLeads ? (
                            <div className="space-y-2">
                              <Skeleton className="h-24 w-full rounded-xl" />
                              <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                          ) : columnLeads.length > 0 ? (
                            columnLeads.map((lead) => (
                              <div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead.id)}
                                className="bg-card border border-border/40 hover:border-orange-500/20 rounded-xl p-3.5 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover-lift relative overflow-hidden"
                              >
                                <h4 className="text-xs font-extrabold text-foreground tracking-tight line-clamp-1">
                                  {`${lead.firstName} ${lead.lastName || ""}`.trim()}
                                </h4>
                                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{lead.projectTitle}</p>

                                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-border/30">
                                  <span className="text-xs font-bold text-orange-500">
                                    {lead.estimatedBudget
                                      ? `${lead.currency || "USD"} ${Number(lead.estimatedBudget).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                      : "Budget: N/A"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    className="w-7 h-7 hover:bg-muted text-muted-foreground rounded-lg"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-32 border border-dashed border-border/40 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground italic">
                              No leads in stage
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CALENDAR VIEW */}
            {currentTab === "calendar" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-foreground">Meetings & Events Calendar</h3>
                  <span className="text-xs text-muted-foreground">Click calendar dates or slots to inspect that day's agenda</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column - FullCalendar Grid */}
                  <Card className="lg:col-span-8 p-6 bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
                    {loadingCalendar ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-[450px] w-full" />
                      </div>
                    ) : (
                      <div className="fc-theme-gk">
                        <FullCalendar
                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                          initialView="timeGridWeek"
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                          }}
                          events={mappedCalendarEvents}
                          eventClick={handleEventClick}
                          dateClick={(arg) => setSelectedAgendaDate(arg.date)}
                          height="65vh"
                          allDaySlot={false}
                          scrollTime="08:00:00"
                          nowIndicator={true}
                          editable={false}
                          selectable={false}
                          eventContent={(eventInfo) => {
                            return (
                              <div className="p-1.5 overflow-hidden text-[11px] text-white h-full flex flex-col justify-between">
                                <div className="font-semibold leading-tight truncate">
                                  {eventInfo.event.title}
                                </div>
                                <div className="opacity-95 text-[9px] flex items-center justify-between mt-1">
                                  <span>{eventInfo.event.extendedProps.eventType}</span>
                                  {eventInfo.event.extendedProps.meetingLink && (
                                    <Video className="w-3 h-3 text-white shrink-0 ml-1" />
                                  )}
                                </div>
                              </div>
                            );
                          }}
                        />
                      </div>
                    )}
                  </Card>

                  {/* Right Column - Daily Agenda List Panel */}
                  <Card className="lg:col-span-4 p-6 bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
                    <div className="pb-4 border-b border-border/30 shrink-0">
                      <h4 className="text-base font-bold text-foreground flex items-center">
                        <ClipboardList className="w-4 h-4 mr-2 text-orange-500" />
                        Daily Agenda
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agenda for {" "}
                        <span className="font-bold text-foreground">
                          {selectedAgendaDate.toLocaleDateString(undefined, { dateStyle: "long" })}
                        </span>
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto pt-4 space-y-4 min-h-[250px]">
                      {loadingCalendar ? (
                        <div className="space-y-3">
                          <Skeleton className="h-16 w-full rounded-xl" />
                          <Skeleton className="h-16 w-full rounded-xl" />
                        </div>
                      ) : agendaEvents.length > 0 ? (
                        agendaEvents.map((event) => {
                          const startTimeStr = new Date(event.startTime).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit"
                          });
                          const endTimeStr = new Date(event.endTime).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit"
                          });

                          const leadName = event.lead
                            ? `${event.lead.firstName} ${event.lead.lastName || ""}`.trim()
                            : "Unlinked Lead";

                          const company = event.lead?.companyName ? ` @ ${event.lead.companyName}` : "";
                          const colors = getEventColors(event.eventType);

                          return (
                            <div
                              key={event.id}
                              className="bg-muted/30 border border-border/30 hover:border-orange-500/20 rounded-xl p-3.5 space-y-2.5 transition-all relative overflow-hidden"
                            >
                              {/* Event type color bar */}
                              <div
                                className="absolute top-0 bottom-0 left-0 w-1"
                                style={{ backgroundColor: colors.bg }}
                              />

                              <div className="pl-1.5 flex justify-between items-start">
                                <div>
                                  <h4 className="text-xs font-extrabold text-foreground line-clamp-1">{event.title}</h4>
                                  <div className="text-[10px] text-muted-foreground flex items-center mt-1">
                                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                                    <span>{startTimeStr} - {endTimeStr}</span>
                                  </div>
                                </div>
                                <Badge
                                  className="text-[9px] font-bold px-1.5 py-0 rounded"
                                  style={{
                                    backgroundColor: `${colors.bg}15`,
                                    color: colors.bg,
                                    border: `1px solid ${colors.bg}30`
                                  }}
                                >
                                  {event.eventType}
                                </Badge>
                              </div>

                              {/* Lead Profile Link */}
                              {event.lead && (
                                <div className="pl-1.5 flex items-center justify-between pt-2 border-t border-border/20 text-xs">
                                  <div>
                                    <span className="text-muted-foreground text-[10px] block">Lead Contact</span>
                                    <button
                                      onClick={() => setSelectedLeadId(event.lead!.id)}
                                      className="font-bold text-orange-400 hover:underline hover:text-orange-500 text-left block"
                                    >
                                      {leadName}{company}
                                    </button>
                                  </div>

                                  {/* Meeting Join shortcut */}
                                  {event.meetingLink && (
                                    <a
                                      href={event.meetingLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-500 hover:text-emerald-400 rounded-lg transition-all"
                                      title="Join meeting call"
                                    >
                                      <Video className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-48 border border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center text-[11px] text-muted-foreground italic text-center p-4">
                          <AlertCircle className="w-6 h-6 text-slate-500 mb-2 shrink-0" />
                          <span>No meetings or calls scheduled for this date. Click different slots to check schedule.</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE NEW LEAD DIALOG MODAL */}
      <Dialog open={showCreateLeadModal} onOpenChange={(open) => {
        if (!open) {
          setShowCreateLeadModal(false);
          resetCreateForm();
        }
      }}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-800 text-white rounded-2xl overflow-y-auto max-h-[95vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-orange-500" />
              Add New Lead Prospect
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Fill in customer profile information, initial project title, requirements, and budget details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-4 py-4">
            {/* 1. Personal Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-slate-300 text-xs font-semibold">First Name *</Label>
                <Input
                  id="firstName"
                  value={leadFirstName}
                  onChange={(e) => setLeadFirstName(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-slate-300 text-xs font-semibold">Last Name</Label>
                <Input
                  id="lastName"
                  value={leadLastName}
                  onChange={(e) => setLeadLastName(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* 2. Contact details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-slate-300 text-xs font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  placeholder="+8801700000000"
                />
              </div>
            </div>

            {/* 3. Social Handles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-slate-300 text-xs font-semibold">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  value={leadLinkedin}
                  onChange={(e) => setLeadLinkedin(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="skype" className="text-slate-300 text-xs font-semibold">Skype ID</Label>
                <Input
                  id="skype"
                  value={leadSkype}
                  onChange={(e) => setLeadSkype(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* 4. Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-slate-300 text-xs font-semibold">Company Name</Label>
                <Input
                  id="companyName"
                  value={leadCompanyName}
                  onChange={(e) => setLeadCompanyName(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyWebsite" className="text-slate-300 text-xs font-semibold">Company Website</Label>
                <Input
                  id="companyWebsite"
                  value={leadCompanyWebsite}
                  onChange={(e) => setLeadCompanyWebsite(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  placeholder="https://company.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companySize" className="text-slate-300 text-xs font-semibold">Company Size</Label>
                <select
                  id="companySize"
                  value={leadCompanySize}
                  onChange={(e) => setLeadCompanySize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
            </div>

            {/* 5. Geographic Info & Source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-slate-300 text-xs font-semibold">Country</Label>
                <Input
                  id="country"
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-slate-300 text-xs font-semibold">Timezone</Label>
                <Input
                  id="timezone"
                  value={leadTimezone}
                  onChange={(e) => setLeadTimezone(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-sm"
                  placeholder="America/New_York"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="leadSource" className="text-slate-300 text-xs font-semibold">Lead Source *</Label>
                <select
                  id="leadSource"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Upwork">Upwork</option>
                  <option value="Website">Website</option>
                  <option value="Cold Email">Cold Email</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* 6. Project & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="projectTitle" className="text-slate-300 text-xs font-semibold">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={leadProjectTitle}
                  onChange={(e) => setLeadProjectTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-sm"
                  placeholder="SaaS Web App, Mobile App, etc."
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="budget" className="text-slate-300 text-xs font-semibold">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={leadBudget}
                    onChange={(e) => setLeadBudget(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-sm"
                    min="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency" className="text-slate-300 text-xs font-semibold">Currency</Label>
                  <select
                    id="currency"
                    value={leadCurrency}
                    onChange={(e) => setLeadCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BDT">BDT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 7. Requirements details */}
            <div className="space-y-1.5">
              <Label htmlFor="requirements" className="text-slate-300 text-xs font-semibold">Requirements Description</Label>
              <Textarea
                id="requirements"
                value={leadRequirements}
                onChange={(e) => setLeadRequirements(e.target.value)}
                className="bg-slate-950 border-slate-800 text-sm min-h-[100px] text-white"
                placeholder="Detail client expectations, technologies, or notes..."
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateLeadModal(false);
                  resetCreateForm();
                }}
                className="text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-xl px-5"
                disabled={createLeadMutation.isPending}
              >
                {createLeadMutation.isPending ? "Creating..." : "Create Lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SINGLE LEAD DETAILS - 3-PANEL LAYOUT DIALOG */}
      <Dialog open={!!selectedLeadId && !showCreateLeadModal} onOpenChange={(open) => {
        if (!open) {
          setSelectedLeadId(null);
          setShowScheduleForm(false);
          resetMeetingForm();
        }
      }}>
        <DialogContent className="max-w-7xl w-[95vw] p-6 rounded-2xl border-border bg-slate-950 text-white overflow-hidden max-h-[95vh] flex flex-col">
          {leadDetails ? (
            <div className="flex-1 flex flex-col overflow-hidden space-y-4">
              {/* Top Details Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
                <div>
                  <DialogTitle className="text-xl font-bold text-white flex items-center">
                    {`${leadDetails.firstName} ${leadDetails.lastName || ""}`.trim()}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-1">
                    Project Query: <span className="font-semibold text-slate-200">{leadDetails.projectTitle}</span>
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Status:</span>
                  <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/25 px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {leadDetails.status}
                  </Badge>
                </div>
              </div>

              {/* 3-Panel Grid Core */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-[300px]">

                {/* 1. LEFT PANEL - PROFILE & META INFO (4 cols) */}
                <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 border-r border-slate-800/60">
                  <div className="space-y-4">
                    {/* User Avatar Card */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-lg border border-orange-500/20">
                        {leadDetails.firstName[0] + (leadDetails.lastName?.[0] || "")}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {`${leadDetails.firstName} ${leadDetails.lastName || ""}`.trim()}
                        </h4>
                        <p className="text-[10px] text-slate-400 italic">Acquired from {leadDetails.leadSource}</p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Information</h5>

                      <div className="space-y-2.5">
                        <a href={`mailto:${leadDetails.email}`} className="text-xs text-orange-400 hover:underline flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-400" />
                          {leadDetails.email}
                        </a>

                        {leadDetails.phone ? (
                          <a href={`tel:${leadDetails.phone}`} className="text-xs text-slate-300 hover:underline flex items-center">
                            <Phone className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-400" />
                            {leadDetails.phone}
                          </a>
                        ) : (
                          <div className="text-xs text-slate-500 flex items-center italic">
                            <Phone className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-600" />
                            No phone provided
                          </div>
                        )}

                        {leadDetails.skypeId ? (
                          <div className="text-xs text-slate-300 flex items-center">
                            <MessageSquare className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-400" />
                            <span className="text-slate-500 mr-1">Skype:</span>
                            {leadDetails.skypeId}
                          </div>
                        ) : null}

                        {leadDetails.linkedinProfile ? (
                          <a href={leadDetails.linkedinProfile} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline flex items-center">
                            <Linkedin className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-400" />
                            LinkedIn Profile
                          </a>
                        ) : null}
                      </div>
                    </div>

                    {/* Company info */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Company Profile</h5>

                      <div className="space-y-2">
                        {leadDetails.companyName && (
                          <div className="text-xs text-slate-300 flex items-center">
                            <Building2 className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                            <span className="text-slate-500 mr-1">Company:</span>
                            {leadDetails.companyName}
                          </div>
                        )}

                        {leadDetails.companyWebsite && (
                          <a href={leadDetails.companyWebsite} target="_blank" rel="noreferrer" className="text-xs text-slate-300 hover:underline flex items-center">
                            <Globe className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                            Visit Website
                          </a>
                        )}

                        {leadDetails.companySize && (
                          <div className="text-xs text-slate-300 flex items-center">
                            <Users className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                            <span className="text-slate-500 mr-1">Size:</span>
                            {leadDetails.companySize} employees
                          </div>
                        )}

                        <div className="text-xs text-slate-300 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                          <span className="text-slate-500 mr-1">Timezone:</span>
                          {leadDetails.timezone}
                        </div>

                        {leadDetails.country && (
                          <div className="text-xs text-slate-300 flex items-center">
                            <Globe className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                            <span className="text-slate-500 mr-1">Country:</span>
                            {leadDetails.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CENTER PANEL - TIMELINE / HISTORY FEED (5 cols) */}
                <div className="lg:col-span-5 flex flex-col overflow-hidden border-r border-slate-800/60 pr-2">
                  <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                    {/* Add note/comment */}
                    <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                      <Input
                        placeholder="Log timeline update comment..."
                        value={newLogNote}
                        onChange={(e) => setNewLogNote(e.target.value)}
                        className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500 text-xs flex-1 h-9 text-white"
                        required
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl h-9 shrink-0"
                        disabled={isSubmittingLog}
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Log Note
                      </Button>
                    </form>

                    {/* Timeline logs */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                      <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center mb-1">
                        <ClipboardList className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                        Interaction Audit Log
                      </h5>
                      {leadDetails.histories && leadDetails.histories.length > 0 ? (
                        leadDetails.histories.map((log) => {
                          const name = log.performedBy?.profile
                            ? `${log.performedBy.profile.firstName} ${log.performedBy.profile.lastName || ""}`.trim()
                            : (log.performedBy?.email || "System");

                          const initials = log.performedBy?.profile
                            ? `${log.performedBy.profile.firstName?.[0] || ""}${log.performedBy.profile.lastName?.[0] || ""}`.toUpperCase()
                            : "S";

                          // Select icon based on activity type
                          const getActivityIcon = (type: string) => {
                            if (type.includes("Status") || type.includes("Stage")) return <TrendingUp className="w-3.5 h-3.5 text-blue-400" />;
                            if (type.includes("Created")) return <Plus className="w-3.5 h-3.5 text-emerald-400" />;
                            if (type.includes("Assigned")) return <UserCheck className="w-3.5 h-3.5 text-purple-400" />;
                            if (type.includes("Budget")) return <DollarSign className="w-3.5 h-3.5 text-amber-400" />;
                            if (type.includes("Meeting") || type.includes("Calendar")) return <Calendar className="w-3.5 h-3.5 text-indigo-400" />;
                            return <MessageSquare className="w-3.5 h-3.5 text-slate-400" />;
                          };

                          return (
                            <div key={log.id} className="flex items-start space-x-3 text-xs bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg">
                              <div className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold uppercase shrink-0 text-[9px]">
                                {initials}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                                    {name}
                                    {getActivityIcon(log.activityType)}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                                  </span>
                                </div>
                                <p className="text-slate-400 font-normal leading-relaxed">{log.comment}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic py-2">No timeline notes registered.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT PANEL - QUICK ACTIONS (3 cols) */}
                <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-1">
                  <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Quick Actions</h5>

                  {/* Stage Transition Selector */}
                  <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Transition Status</label>
                    <select
                      value={leadDetails.status}
                      onChange={(e) => {
                        const targetStatus = e.target.value;
                        if (targetStatus === "Meeting Scheduled") {
                          const today = new Date();
                          const yyyy = today.getFullYear();
                          const mm = (today.getMonth() + 1).toString().padStart(2, "0");
                          const dd = today.getDate().toString().padStart(2, "0");
                          setMeetingStartTime(`${yyyy}-${mm}-${dd}T10:00`);
                          setMeetingEndTime(`${yyyy}-${mm}-${dd}T11:00`);
                          setMeetingTitle(`Discovery Call with ${leadDetails.firstName}`);
                          setShowScheduleForm(true);
                        } else {
                          statusMutation.mutate({ leadId: leadDetails.id, status: targetStatus });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    >
                      {KANBAN_STAGES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget updater widget */}
                  <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Deal Budget ({leadDetails.currency})</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        defaultValue={leadDetails.estimatedBudget || 0}
                        onBlur={(e) => {
                          const budget = parseFloat(e.target.value);
                          if (!isNaN(budget) && budget !== leadDetails.estimatedBudget) {
                            budgetMutation.mutate({ leadId: leadDetails.id, budget });
                          }
                        }}
                        className="bg-slate-950 border-slate-850 focus-visible:ring-orange-500 text-xs h-8 text-white"
                      />
                    </div>
                  </div>

                  {/* Assignee Card */}
                  <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Owner</label>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Award className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="font-semibold">
                        {leadDetails.assignedTo?.profile
                          ? `${leadDetails.assignedTo.profile.firstName} ${leadDetails.assignedTo.profile.lastName || ""}`.trim()
                          : (leadDetails.assignedTo?.email || "Unassigned")}
                      </span>
                    </div>
                  </div>

                  {/* Inline Meeting Scheduling trigger */}
                  {!showScheduleForm ? (
                    <Button
                      onClick={() => {
                        const today = new Date();
                        const yyyy = today.getFullYear();
                        const mm = (today.getMonth() + 1).toString().padStart(2, "0");
                        const dd = today.getDate().toString().padStart(2, "0");
                        setMeetingStartTime(`${yyyy}-${mm}-${dd}T10:00`);
                        setMeetingEndTime(`${yyyy}-${mm}-${dd}T11:00`);
                        setMeetingTitle(leadDetails ? `Discovery Call with ${leadDetails.firstName}` : "Discovery Call");
                        setShowScheduleForm(true);
                      }}
                      variant="outline"
                      className="w-full border-slate-800 hover:bg-slate-900 text-white text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule Meeting/Call
                    </Button>
                  ) : null}

                  {/* NESTED MEETING SCHEDULER FORM */}
                  {showScheduleForm && (
                    <form onSubmit={handleScheduleMeetingDirectly} className="bg-slate-900/80 border border-orange-500/20 p-3.5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-orange-400 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          New Meeting
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowScheduleForm(false);
                            resetMeetingForm();
                          }}
                          className="h-5 p-1 text-[10px] text-slate-500 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Title</label>
                          <Input
                            value={meetingTitle}
                            onChange={(e) => setMeetingTitle(e.target.value)}
                            required
                            className="bg-slate-950 border-slate-850 focus-visible:ring-orange-500 text-xs h-7 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Event Type</label>
                          <select
                            value={meetingType}
                            onChange={(e) => setMeetingType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 text-xs text-white rounded p-1 focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="Meeting">Meeting</option>
                            <option value="Demo">Demo</option>
                            <option value="Proposal Review">Proposal Review</option>
                            <option value="Follow-up Call">Follow-up Call</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Start Time</label>
                          <DateTimePicker
                            value={meetingStartTime}
                            onChange={setMeetingStartTime}
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">End Time</label>
                          <DateTimePicker
                            value={meetingEndTime}
                            onChange={setMeetingEndTime}
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Meeting Link (Optional)</label>
                          <Input
                            placeholder="Zoom or Meet link"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className="bg-slate-950 border-slate-850 focus-visible:ring-orange-500 text-xs h-7 text-white"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 rounded-lg mt-2"
                      >
                        Schedule Event & Set Status
                      </Button>
                    </form>
                  )}

                  {/* Visitor inquiry message block */}
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl space-y-1.5 mt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Initial Requirement</label>
                    <p className="text-xs text-slate-400 leading-relaxed max-h-36 overflow-y-auto pr-0.5 whitespace-pre-wrap">
                      {leadDetails.requirements || "No details provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
