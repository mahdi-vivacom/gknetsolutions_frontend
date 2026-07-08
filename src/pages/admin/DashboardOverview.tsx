import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Users, 
  Briefcase, 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Check,
  Shield,
  Percent,
  DollarSign,
  UserCheck,
  UserX,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Employee {
  id: string;
  email: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar: string;
  monthlyTarget: number;
  totalLeads: number;
  wonLeads: number;
  monthlyWins: number;
  conversionRate: number;
  achievementRate: number;
  kpiScore: number;
}

interface FunnelItem {
  stage: string;
  count: number;
  value: number;
}

interface LeadsStats {
  totalLeads: number;
  wonLeads: number;
  lostLeads: number;
  activeLeads: number;
  wonValue: number;
  conversionRate: number;
  funnel: FunnelItem[];
}

export const DashboardOverview: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formTarget, setFormTarget] = useState("0");

  // Fetch KPI Stats (Funnel, wins, conversion, active)
  const { data: stats, isLoading: loadingStats, error: errorStats } = useQuery<LeadsStats>({
    queryKey: ["leadsStats"],
    queryFn: () => fetchAPI<LeadsStats>("/leads/stats"),
  });

  // Fetch Employees
  const { data: employees = [], isLoading: loadingEmployees, error: errorEmployees } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: () => fetchAPI<Employee[]>("/user/employees"),
  });

  // Create Employee Mutation
  const addMutation = useMutation({
    mutationFn: (newEmp: any) => fetchAPI<any>("/user/employees", {
      method: "POST",
      body: JSON.stringify(newEmp),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create employee");
    }
  });

  // Update Employee Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => fetchAPI<any>(`/user/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["leadsStats"] });
      toast.success("Employee updated successfully");
      setIsDialogOpen(false);
      setEditingEmployee(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update employee");
    }
  });

  // Delete Employee Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchAPI<any>(`/user/employees/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee profile removed");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete employee");
    }
  });

  const resetForm = () => {
    setFormEmail("");
    setFormPassword("");
    setFormFirstName("");
    setFormLastName("");
    setFormPhone("");
    setFormAddress("");
    setFormTarget("0");
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormEmail(emp.email);
    setFormPassword(""); // Keep blank if not updating password
    setFormFirstName(emp.firstName);
    setFormLastName(emp.lastName);
    setFormPhone(emp.phone);
    setFormAddress(emp.address);
    setFormTarget(String(emp.monthlyTarget));
    setIsDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      email: formEmail,
      firstName: formFirstName,
      lastName: formLastName,
      phone: formPhone,
      address: formAddress,
      monthlyTarget: Number(formTarget),
    };

    if (formPassword) {
      payload.password = formPassword;
    }

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, data: payload });
    } else {
      // Password is required for new employee
      if (!formPassword) {
        toast.error("Password is required for new employees");
        return;
      }
      payload.password = formPassword;
      addMutation.mutate(payload);
    }
  };

  const handleToggleActive = (emp: Employee, checked: boolean) => {
    updateMutation.mutate({
      id: emp.id,
      data: { isActive: checked }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this employee profile?")) {
      deleteMutation.mutate(id);
    }
  };

  const isLoading = loadingStats || loadingEmployees;
  const isError = errorStats || errorEmployees;

  // Render stats error panel
  if (isError) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/10 rounded-xl flex items-center space-x-3 text-destructive">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h3 className="font-bold">Database Sync Alert</h3>
          <p className="text-sm">We couldn't connect to the NestJS CRM API. Verify that the backend server is active and connected to PostgreSQL.</p>
        </div>
      </div>
    );
  }

  // Calculate overall performance metrics
  const activeEmployees = employees.filter(e => e.isActive);
  const avgKpiScore = activeEmployees.length > 0
    ? Math.round(activeEmployees.reduce((sum, e) => sum + e.kpiScore, 0) / activeEmployees.length)
    : 0;

  const totalMonthlyTarget = activeEmployees.reduce((sum, e) => sum + e.monthlyTarget, 0);
  const totalMonthlyWins = activeEmployees.reduce((sum, e) => sum + e.monthlyWins, 0);
  const targetAchievementRate = totalMonthlyTarget > 0
    ? Math.round((totalMonthlyWins / totalMonthlyTarget) * 100)
    : 0;

  // Funnel chart configuration
  const FUNNEL_COLORS = {
    "New Lead": "#3b82f6",
    "Contacted": "#06b6d4",
    "Meeting Scheduled": "#a855f7",
    "Demo Completed": "#ec4899",
    "Proposal Sent": "#f59e0b",
    "Negotiation": "#14b8a6",
    "Won": "#10b981",
    "Lost": "#ef4444",
    "Follow-up": "#64748b"
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">CRM Global insights & KPIs</h2>
          <p className="text-sm text-muted-foreground">Admin panel monitoring sales funnels, pipeline conversion, and employee targets</p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-card border border-border/50 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Real-time API Sync</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads Card */}
        <Card className="glass-card border border-border/40 hover-lift relative overflow-hidden group shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total CRM Leads</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-3xl font-extrabold">{stats?.totalLeads || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Active sales funnel: <span className="font-semibold text-foreground">{stats?.activeLeads || 0} leads</span>
            </p>
          </CardContent>
        </Card>

        {/* Won Deal Revenues Card */}
        <Card className="glass-card border border-border/40 hover-lift relative overflow-hidden group shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won Revenues</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-3xl font-extrabold">
                ${Number(stats?.wonValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total converted deals
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate Card */}
        <Card className="glass-card border border-border/40 hover-lift relative overflow-hidden group shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
              <Percent className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-3xl font-extrabold">{stats?.conversionRate || 0}%</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Won leads vs total inquiries
            </p>
          </CardContent>
        </Card>

        {/* Average KPI Score Card */}
        <Card className="glass-card border border-border/40 hover-lift relative overflow-hidden group shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Target Achievement</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 transition-transform group-hover:scale-110">
              <Target className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-3xl font-extrabold">{targetAchievementRate}%</div>
            )}
            <div className="mt-2">
              <Progress value={Math.min(100, targetAchievementRate)} className="h-1.5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Sections */}
      <Tabs defaultValue="analytics" className="w-full space-y-6">
        <TabsList className="bg-card border border-border/50 p-1 rounded-xl w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="analytics" className="rounded-lg font-medium px-4 py-2 text-xs sm:text-sm">
            Overview & Funnel
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-lg font-medium px-4 py-2 text-xs sm:text-sm">
            KPI Leaderboard
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg font-medium px-4 py-2 text-xs sm:text-sm">
            Employee Accounts
          </TabsTrigger>
        </TabsList>

        {/* ANALYTICS & FUNNEL TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sales Pipeline Funnel */}
            <Card className="glass-card border border-border/40 shadow-lg p-6 flex flex-col">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base font-bold text-foreground">Sales Funnel Distribution</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Number of inquiries in each pipeline stage</CardDescription>
              </CardHeader>
              <div className="h-80 w-full flex-1 mt-4">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : stats?.funnel && stats.funnel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.funnel}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.3)" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                      <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border) / 0.5)",
                          borderRadius: "0.5rem"
                        }}
                        formatter={(value: any, name: any, props: any) => {
                          if (name === "count") return [`${value} leads`, "Count"];
                          if (name === "value") return [`$${Number(value).toLocaleString()}`, "Value"];
                          return [value, name];
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Leads Count">
                        {stats.funnel.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={FUNNEL_COLORS[entry.stage as keyof typeof FUNNEL_COLORS] || "#cbd5e1"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No funnel data available</div>
                )}
              </div>
            </Card>

            {/* Value Distribution Across Pipeline */}
            <Card className="glass-card border border-border/40 shadow-lg p-6 flex flex-col">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base font-bold text-foreground">Pipeline Deal Value ($)</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Cumulative deal value associated with each stage</CardDescription>
              </CardHeader>
              <div className="h-80 w-full flex-1 mt-4">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : stats?.funnel && stats.funnel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.funnel}
                      margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                      <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border) / 0.5)",
                          borderRadius: "0.5rem"
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, "Deal Value"]}
                      />
                      <Bar dataKey="value" fill="#f36a24" radius={[4, 4, 0, 0]} name="Value">
                        {stats.funnel.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={FUNNEL_COLORS[entry.stage as keyof typeof FUNNEL_COLORS] || "#f36a24"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No value data available</div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard">
          <Card className="glass-card border border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Employee KPI Leaderboard</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Rankings based on monthly target achievements and conversion performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : employees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Employee</TableHead>
                      <TableHead>Active Leads</TableHead>
                      <TableHead>Monthly Target</TableHead>
                      <TableHead>Monthly Wins</TableHead>
                      <TableHead>Achievement Rate</TableHead>
                      <TableHead>Win (Conversion) Rate</TableHead>
                      <TableHead className="text-right">KPI Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees
                      .sort((a, b) => b.kpiScore - a.kpiScore)
                      .map((emp) => (
                        <TableRow key={emp.id} className="border-border/50 hover:bg-muted/30">
                          <TableCell className="font-semibold py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm font-bold uppercase">
                                {(emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")}
                              </div>
                              <div>
                                <span className="block text-sm text-foreground">{emp.firstName} {emp.lastName}</span>
                                <span className="text-[10px] text-muted-foreground">{emp.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{emp.totalLeads} leads</TableCell>
                          <TableCell className="text-sm font-semibold">${emp.monthlyTarget.toLocaleString()}</TableCell>
                          <TableCell className="text-sm font-semibold text-emerald-500">${emp.monthlyWins.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-bold ${
                                emp.achievementRate >= 100 ? "text-emerald-500" : emp.achievementRate >= 50 ? "text-amber-500" : "text-destructive"
                              }`}>
                                {emp.achievementRate}%
                              </span>
                              <Progress value={Math.min(100, emp.achievementRate)} className="h-1.5 w-16 bg-muted [&>div]:bg-gradient-to-r" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{emp.conversionRate}%</TableCell>
                          <TableCell className="text-right">
                            <Badge className={`px-2.5 py-1 text-xs font-bold ${
                              emp.kpiScore >= 80 ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : 
                              emp.kpiScore >= 55 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : 
                              "bg-destructive/20 text-destructive border border-destructive/30"
                            }`}>
                              {emp.kpiScore} / 100
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">No employees configured. Go to the 'Employee Accounts' tab to create one.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* EMPLOYEE ACCOUNTS & CRUD TAB */}
        <TabsContent value="employees" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground">Employee Accounts Management</h3>
            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-xl px-4 py-2.5 shadow-md shadow-orange-500/10">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          <Card className="glass-card border border-border/40 shadow-lg">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : employees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Employee Profile</TableHead>
                      <TableHead>Phone / Address</TableHead>
                      <TableHead>Monthly Target</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {(emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")}
                            </div>
                            <div>
                              <span className="block font-bold text-sm text-foreground">{emp.firstName} {emp.lastName}</span>
                              <span className="text-xs text-muted-foreground">{emp.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="block text-xs text-foreground font-medium">{emp.phone || "No phone logged"}</span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-xs">{emp.address || "No address"}</span>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          ${emp.monthlyTarget.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2.5">
                            <Switch 
                              checked={emp.isActive} 
                              onCheckedChange={(checked) => handleToggleActive(emp, checked)}
                              className="data-[state=checked]:bg-emerald-500"
                            />
                            <Badge variant="outline" className={`text-[10px] font-bold ${
                              emp.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                            }`}>
                              {emp.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(emp)} className="hover:bg-muted text-blue-500">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="hover:bg-muted text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">No employee accounts created. Click 'Add Employee' to populate your team.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingEmployee ? "Edit Employee Profile" : "Create New Employee"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Configure credentials, targets, and contact details for the employee.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300 text-xs font-semibold">First Name</Label>
                <Input 
                  id="firstName"
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300 text-xs font-semibold">Last Name</Label>
                <Input 
                  id="lastName"
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-xs font-semibold">Email Address</Label>
              <Input 
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-xs font-semibold">
                Password {editingEmployee && <span className="text-muted-foreground">(leave blank to keep current)</span>}
              </Label>
              <Input 
                id="password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                required={!editingEmployee}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300 text-xs font-semibold">Phone Number</Label>
                <Input 
                  id="phone"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target" className="text-slate-300 text-xs font-semibold">Monthly Sales Target ($)</Label>
                <Input 
                  id="target"
                  type="number"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-300 text-xs font-semibold">Home/Office Address</Label>
              <Input 
                id="address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="bg-slate-950 border-slate-800 focus-visible:ring-orange-500 text-sm"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:bg-slate-800">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-xl px-5">
                {editingEmployee ? "Save Changes" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
