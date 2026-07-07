import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle,
  Eye,
  User,
  DollarSign,
  ClipboardList,
  MessageSquare,
  Send,
  Linkedin,
  Clock,
  Globe,
  Building2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

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
  assignedTo: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  } | null;
  histories?: LeadHistory[];
  createdAt?: string;
}

type SortKey = "firstName" | "email" | "projectTitle" | "createdAt";
type SortOrder = "asc" | "desc";

export const LeadManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [globalSearch, setGlobalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Inspection modal details
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newLogNote, setNewLogNote] = useState("");
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Fetch leads
  const { data: leads = [], isLoading, error } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: () => fetchAPI<Lead[]>("/leads"),
  });

  // Fetch active employees (for assignment)
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: () => fetchAPI<Employee[]>("/user/employees"),
  });

  // Fetch details of selected lead (for logs/timeline details)
  const { data: leadDetails, refetch: refetchLeadDetails } = useQuery<Lead>({
    queryKey: ["leadDetails", selectedLeadId],
    queryFn: () => fetchAPI<Lead>(`/leads/${selectedLeadId}`),
    enabled: !!selectedLeadId,
  });

  // Assign Lead Mutation
  const assignMutation = useMutation({
    mutationFn: ({ leadId, employeeId }: { leadId: string; employeeId: string | null }) => 
      fetchAPI<Lead>(`/leads/${leadId}/assign`, {
        method: "PUT",
        body: JSON.stringify({ employeeId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leadsStats"] });
      if (selectedLeadId) refetchLeadDetails();
      toast.success("Lead assignment updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to assign lead");
    }
  });

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: string }) => 
      fetchAPI<Lead>(`/leads/${leadId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leadsStats"] });
      if (selectedLeadId) refetchLeadDetails();
      toast.success("Sales pipeline status updated");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
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
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leadsStats"] });
      if (selectedLeadId) refetchLeadDetails();
      toast.success("Deal budget adjusted");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update budget");
    }
  });

  // Add Log Note Mutation
  const addLog = async (e: React.FormEvent) => {
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
      toast.success("Note added to lead history");
    } catch (err: any) {
      toast.error(err.message || "Failed to post note");
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Filter & sort leads list
  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Filter by global search query
    if (globalSearch) {
      const query = globalSearch.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(query) ||
          (lead.lastName && lead.lastName.toLowerCase().includes(query)) ||
          lead.email.toLowerCase().includes(query) ||
          lead.projectTitle.toLowerCase().includes(query)
      );
    }

    // Sort items
    result.sort((a, b) => {
      let aVal = a[sortKey] || "";
      let bVal = b[sortKey] || "";

      if (sortKey === "firstName") {
        aVal = `${a.firstName} ${a.lastName || ""}`.trim().toLowerCase();
        bVal = `${b.firstName} ${b.lastName || ""}`.trim().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, globalSearch, sortKey, sortOrder]);

  // Paginated chunk
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedLeads, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedLeads.length / pageSize) || 1;

  const STAGE_COLORS = {
    "New Lead": "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    "Contacted": "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
    "Qualified": "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
    "Meeting Scheduled": "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    "Demo Completed": "bg-pink-500/10 text-pink-500 border border-pink-500/20",
    "Proposal Sent": "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    "Negotiation": "bg-teal-500/10 text-teal-500 border border-teal-500/20",
    "Won": "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    "Lost": "bg-destructive/10 text-destructive border border-destructive/20",
    "Follow-up Later": "bg-slate-500/10 text-slate-500 border border-slate-500/20"
  };

  if (error) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/10 rounded-xl flex items-center space-x-3 text-destructive font-sans">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h3 className="font-bold">Error loading leads</h3>
          <p className="text-sm">We couldn't connect to the backend server. Please verify database connectivity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Lead & Inquiries Management</h2>
        <p className="text-sm text-muted-foreground">Assign leads, adjust deal values, and coordinate customer timeline updates</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-card border-border/50 text-sm focus-visible:ring-primary rounded-xl"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground font-semibold">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-card border border-border/50 p-1.5 rounded-lg outline-none cursor-pointer focus:border-primary text-foreground"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border border-border/40 shadow-lg bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-b border-border/40 hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground py-4 px-6">
                    <button 
                      onClick={() => handleSort("firstName")} 
                      className="inline-flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <span>Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Contact Details</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Budget</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Assignee</TableHead>
                  <TableHead className="font-semibold text-foreground py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, idx) => (
                    <TableRow key={idx} className="border-b border-border/30 hover:bg-transparent">
                      <TableCell className="py-4 px-6"><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="py-4 text-right pr-6"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="border-b border-border/30 hover:bg-muted/10 transition-colors group"
                    >
                      <TableCell className="py-4 px-6 font-medium text-foreground">
                        <div>
                          <span className="block text-sm">{`${lead.firstName} ${lead.lastName || ""}`.trim()}</span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-xs">{lead.projectTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center text-xs text-muted-foreground block">
                            <Mail className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="inline-flex items-center text-xs text-muted-foreground block">
                              <Phone className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`px-2 py-0.5 text-xs font-semibold capitalize ${
                          STAGE_COLORS[lead.status as keyof typeof STAGE_COLORS] || "bg-muted text-muted-foreground"
                        }`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-sm">
                        {lead.estimatedBudget 
                          ? `${lead.currency || "USD"} ${Number(lead.estimatedBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        {lead.assignedTo ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-500 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                              {(lead.assignedTo.profile?.firstName?.[0] || "") + (lead.assignedTo.profile?.lastName?.[0] || "")}
                            </div>
                            <span className="text-xs text-foreground font-semibold">
                              {lead.assignedTo.profile?.firstName} {lead.assignedTo.profile?.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="hover:bg-primary/10 hover:text-primary rounded-xl"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground font-semibold">
                      No leads matching your filters were found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <span className="text-xs text-muted-foreground font-semibold">
          Showing {filteredAndSortedLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredAndSortedLeads.length)} of{" "}
          {filteredAndSortedLeads.length} items
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 border-border/50 hover:bg-muted rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-semibold px-3 py-1.5 bg-card border border-border/50 rounded-xl">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 border-border/50 hover:bg-muted rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lead Detail Inspector Dialog */}
      <Dialog open={!!selectedLeadId} onOpenChange={(open) => !open && setSelectedLeadId(null)}>
        <DialogContent className="max-w-2xl p-6 rounded-2xl border-slate-800 bg-slate-900 text-white overflow-y-auto max-h-[90vh]">
          {leadDetails ? (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between pr-4 mt-2">
                  <DialogTitle className="text-lg font-bold text-white">
                    {`${leadDetails.firstName} ${leadDetails.lastName || ""}`.trim()}
                  </DialogTitle>
                  <Badge className={`px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    STAGE_COLORS[leadDetails.status as keyof typeof STAGE_COLORS] || "bg-muted text-slate-400"
                  }`}>
                    {leadDetails.status}
                  </Badge>
                </div>
                <DialogDescription className="text-slate-400 text-xs mt-1">
                  Inquiry Topic: <span className="font-medium text-slate-300">{leadDetails.projectTitle}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Lead Details Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Email Address</span>
                    <a href={`mailto:${leadDetails.email}`} className="text-sm font-semibold text-orange-400 hover:underline flex items-center mt-1">
                      <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      {leadDetails.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Phone Contact</span>
                    {leadDetails.phone ? (
                      <a href={`tel:${leadDetails.phone}`} className="text-sm font-semibold text-slate-300 flex items-center mt-1">
                        <Phone className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        {leadDetails.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500 italic mt-1 block">No phone number</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Pipeline Action Items */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Deal Budget ({leadDetails.currency})</span>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4.5 w-4.5 text-slate-500" />
                      <Input 
                        type="number"
                        defaultValue={leadDetails.estimatedBudget || 0}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== leadDetails.estimatedBudget) {
                            budgetMutation.mutate({ leadId: leadDetails.id, budget: val });
                          }
                        }}
                        className="bg-slate-950 border-slate-800 pl-8 h-9 focus-visible:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Lead Assignee</span>
                    <Select
                      value={leadDetails.assignedTo?.id || "unassigned"}
                      onValueChange={(val) => {
                        const targetId = val === "unassigned" ? null : val;
                        assignMutation.mutate({ leadId: leadDetails.id, employeeId: targetId });
                      }}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-800 h-9 text-slate-300 focus:ring-orange-500 text-xs">
                        <SelectValue placeholder="Assign employee..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-slate-800 text-white">
                        <SelectItem value="unassigned" className="text-slate-400">Unassigned</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id} className="text-slate-200">
                            {emp.firstName} {emp.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Visitor Message</span>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{leadDetails.requirements}</p>
              </div>

              {/* CRM TIMELINE & NOTES */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold flex items-center text-slate-300">
                  <ClipboardList className="w-4 h-4 mr-2 text-orange-500" />
                  Interaction Logs & Audit History
                </h4>

                {/* Log list */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {leadDetails.histories && leadDetails.histories.length > 0 ? (
                    leadDetails.histories.map((log) => {
                      const name = log.performedBy?.profile 
                        ? `${log.performedBy.profile.firstName} ${log.performedBy.profile.lastName || ""}`.trim() 
                        : (log.performedBy?.email || "System");
                      const initials = log.performedBy?.profile
                        ? `${log.performedBy.profile.firstName?.[0] || ""}${log.performedBy.profile.lastName?.[0] || ""}`.toUpperCase()
                        : "S";
                      return (
                        <div key={log.id} className="flex items-start space-x-3 text-xs bg-slate-950/40 border border-slate-850 p-3 rounded-lg">
                          <div className="w-6 h-6 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold uppercase shrink-0 text-[9px]">
                            {initials}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-slate-300">{name}</span>
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
                    <p className="text-xs text-slate-500 italic py-2">No logs recorded for this lead yet.</p>
                  )}
                </div>

                {/* Add new log */}
                <form onSubmit={addLog} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Log a client interaction note..."
                    value={newLogNote}
                    onChange={(e) => setNewLogNote(e.target.value)}
                    className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-xs flex-1 h-9"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl h-9 shrink-0"
                    disabled={isSubmittingLog}
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Comment
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
