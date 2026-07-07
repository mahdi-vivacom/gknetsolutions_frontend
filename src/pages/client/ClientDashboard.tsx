import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Briefcase, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CreditCard,
  History,
  CheckCircle,
  ShieldCheck,
  Percent,
  Layers,
  ArrowUpRight,
  LogOut,
  TrendingUp,
  Receipt,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

interface ActiveService {
  id: string;
  serviceId: string;
  title: string;
  type: "one_time" | "monthly";
  price: number;
  icon: string;
  gradient: string;
  startedAt: string;
  nextBillingDate: string | null;
}

interface Invoice {
  id: string;
  amount: number;
  status: "pending" | "paid";
  dueDate: string;
  createdAt: string;
}

interface DashboardData {
  activeServices: ActiveService[];
  monthlyFee: number;
  pendingFee: number;
  pendingInvoices: Invoice[];
}

interface Transaction {
  id: string;
  amount: number;
  paymentMethod: string;
  trxId: string;
  status: string;
  createdAt: string;
}

interface OrderHistoryItem {
  id: string;
  title: string;
  type: "one_time" | "monthly";
  price: number;
  status: string;
  startedAt: string;
}

interface HistoryData {
  transactions: Transaction[];
  totalTransactions: number;
  totalPages: number;
  currentPage: number;
  orderHistory: OrderHistoryItem[];
}

export const ClientDashboard: React.FC = () => {
  const { user, logout, loading: loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isProcessingConfirm, setIsProcessingConfirm] = useState(false);

  // Redirect if unauthorized
  useEffect(() => {
    if (!loadingAuth && (!user || user.role !== "customer")) {
      navigate("/login");
    }
  }, [user, loadingAuth, navigate]);

  // Fetch client dashboard analytics
  const { data: dashboard, isLoading: loadingDash, error: errorDash } = useQuery<DashboardData>({
    queryKey: ["clientDashboard"],
    queryFn: () => fetchAPI<DashboardData>("/client/dashboard"),
    enabled: !!user && user.role === "customer",
  });

  // Fetch payment/order history
  const { data: historyData, isLoading: loadingHistory } = useQuery<HistoryData>({
    queryKey: ["clientHistory", page],
    queryFn: () => fetchAPI<HistoryData>(`/client/history?page=${page}&limit=10`),
    enabled: !!user && user.role === "customer",
  });

  // Stripe Checkout Session Mutation
  const checkoutMutation = useMutation({
    mutationFn: (invoiceId: string) => fetchAPI<{ url: string }>("/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ invoiceId }),
    }),
    onSuccess: (data) => {
      toast.info("Redirecting to payment gateway...");
      window.location.href = data.url;
    },
    onError: (err: any) => {
      toast.error(err.message || "Checkout initialization failed");
    }
  });

  // Check for Stripe Checkout success/cancel return callback parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const invoiceId = searchParams.get("invoice_id");
    const canceled = searchParams.get("canceled");

    if (success && sessionId && invoiceId && !isProcessingConfirm) {
      setIsProcessingConfirm(true);
      const confirmPayment = async () => {
        const loadingToastId = toast.loading("Verifying your payment transaction with Stripe...");
        try {
          await fetchAPI("/payments/confirm", {
            method: "POST",
            body: JSON.stringify({ sessionId, invoiceId }),
          });
          toast.success("Payment successfully received! Thank you.", { id: loadingToastId });
          queryClient.invalidateQueries({ queryKey: ["clientDashboard"] });
          queryClient.invalidateQueries({ queryKey: ["clientHistory"] });
        } catch (err: any) {
          toast.error(err.message || "Failed to verify payment status", { id: loadingToastId });
        } finally {
          setIsProcessingConfirm(false);
          // Clean the query parameters
          setSearchParams({});
        }
      };
      confirmPayment();
    } else if (canceled) {
      toast.warning("Payment process cancelled by the user.");
      setSearchParams({});
    }
  }, [searchParams, queryClient, setSearchParams, isProcessingConfirm]);

  const handlePayInvoice = (invoiceId: string) => {
    checkoutMutation.mutate(invoiceId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingAuth || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Validating client session...</p>
        </div>
      </div>
    );
  }

  const isLoading = loadingDash || loadingHistory;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="h-20 bg-card/85 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20">
            GK
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none">GKNet Solutions</h1>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">Client Portal</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2.5 p-1 px-3 bg-muted/60 rounded-xl border border-border/80">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
              {user.firstName[0] + (user.lastName?.[0] || "")}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-foreground/90">{user.firstName} {user.lastName}</div>
              <span className="text-[9px] text-muted-foreground font-bold capitalize">{user.role} Account</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-450 rounded-xl">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="px-6 py-8 lg:px-8 max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Billing & Service Console</h2>
            <p className="text-xs text-muted-foreground mt-1">Review active integrations, pay outstanding invoices via Stripe, and download statements</p>
          </div>
          <div className="inline-flex items-center space-x-2 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-550 dark:text-emerald-400" />
            <span>Secure SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Overview Metric Widgets */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Monthly Recurring cost */}
          <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg p-5 flex items-center group hover:border-border/85 hover:shadow-xl transition-all duration-350">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="ml-5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Monthly Recurring Fee</span>
              <span className="text-2xl font-black block text-foreground mt-0.5">
                {isLoading ? <Skeleton className="h-6 w-16" /> : `$${(dashboard?.monthlyFee || 0).toLocaleString()}`}
              </span>
              <span className="text-[10px] text-muted-foreground">Active monthly subscriptions cost</span>
            </div>
          </Card>

          {/* Pending Balance */}
          <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg p-5 flex items-center group hover:border-border/85 hover:shadow-xl transition-all duration-350">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="ml-5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Outstanding Balance</span>
              <span className="text-2xl font-black block text-amber-500 dark:text-amber-400 mt-0.5">
                {isLoading ? <Skeleton className="h-6 w-16" /> : `$${(dashboard?.pendingFee || 0).toLocaleString()}`}
              </span>
              <span className="text-[10px] text-muted-foreground">Total unpaid due balance</span>
            </div>
          </Card>

          {/* Integrated active systems */}
          <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg p-5 flex items-center group hover:border-border/85 hover:shadow-xl transition-all duration-350 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5" />
            </div>
            <div className="ml-5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Service Nodes</span>
              <span className="text-2xl font-black block text-foreground mt-0.5">
                {isLoading ? <Skeleton className="h-6 w-10" /> : dashboard?.activeServices.length || 0}
              </span>
              <span className="text-[10px] text-muted-foreground">System nodes currently online</span>
            </div>
          </Card>
        </div>

        {/* Dashboard Content split layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Services List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                Active Integrated Systems
              </h3>
              <Badge variant="outline" className="bg-muted text-[10px] border-border text-muted-foreground font-bold px-2 py-0.5">
                {dashboard?.activeServices.length || 0} Active
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-32 rounded-2xl" />
                  <Skeleton className="h-32 rounded-2xl" />
                </>
              ) : dashboard?.activeServices && dashboard.activeServices.length > 0 ? (
                dashboard.activeServices.map((node) => (
                  <Card key={node.id} className="border-border bg-card/50 backdrop-blur-md hover:border-border hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[9px] font-bold tracking-wide ${
                          node.type === "monthly" ? "bg-purple-500/10 text-purple-650 dark:text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-650 dark:text-blue-400 border-blue-500/20"
                        }`}>
                          {node.type === "monthly" ? "Monthly Plan" : "One-Time Integration"}
                        </Badge>
                        <span className="text-xs font-extrabold text-foreground/95">
                          ${node.price.toLocaleString()}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-extrabold text-foreground mt-2 group-hover:text-orange-500 dark:group-hover:text-orange-405 transition-colors">
                        {node.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1.5 pt-1">
                      <div className="flex justify-between">
                        <span>Started on:</span>
                        <span className="text-foreground/80 font-medium">
                          {new Date(node.startedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </div>
                      {node.type === "monthly" && node.nextBillingDate && (
                        <div className="flex justify-between border-t border-border/50 pt-1.5">
                          <span>Next Billing:</span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {new Date(node.nextBillingDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground text-xs italic">
                  No active system nodes detected on your account.
                </div>
              )}
            </div>

            {/* TABBED HISTORY & TRANSACTION LEDGERS */}
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="bg-muted border border-border/60 p-0.5 rounded-xl flex w-full max-w-xs mb-4">
                <TabsTrigger value="invoices" className="rounded-lg text-xs font-semibold flex-1 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                  Outstanding Bills
                </TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-lg text-xs font-semibold flex-1 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                  Receipts Log
                </TabsTrigger>
              </TabsList>

              {/* INVOICES LIST TAB */}
              <TabsContent value="invoices">
                <Card className="border-border bg-card/30 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40 border-b border-border">
                      <TableRow className="border-b border-border">
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Invoice ID</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Due Date</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 2 }).map((_, idx) => (
                          <TableRow key={idx} className="border-b border-border/50">
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : dashboard?.pendingInvoices && dashboard.pendingInvoices.length > 0 ? (
                        dashboard.pendingInvoices.map((inv) => (
                          <TableRow key={inv.id} className="border-b border-border/50 hover:bg-muted/30">
                            <TableCell className="font-semibold text-xs text-foreground/80">
                              #{inv.id.substring(0, 8)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {new Date(inv.dueDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </TableCell>
                            <TableCell className="text-xs font-extrabold text-foreground">
                              ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 uppercase">
                                {inv.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                size="sm"
                                onClick={() => handlePayInvoice(inv.id)}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-xl px-4 py-1 h-8 shadow-md shadow-orange-500/10 font-bold text-xs"
                                disabled={checkoutMutation.isPending}
                              >
                                {checkoutMutation.isPending ? "Connecting..." : "Pay Now"}
                                <ArrowRight className="w-3 h-3 ml-1.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-xs italic font-semibold">
                            Excellent! No outstanding balances detected.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* TRANSACTIONS TAB */}
              <TabsContent value="transactions" className="space-y-4">
                <Card className="border-border bg-card/30 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40 border-b border-border">
                      <TableRow className="border-b border-border">
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Trx Reference</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Method</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Date</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-xs font-extrabold text-muted-foreground text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 2 }).map((_, idx) => (
                          <TableRow key={idx} className="border-b border-border/50">
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell className="text-right pr-6"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : historyData?.transactions && historyData.transactions.length > 0 ? (
                        historyData.transactions.map((tx) => (
                          <TableRow key={tx.id} className="border-b border-border/50 hover:bg-muted/30">
                            <TableCell className="font-semibold text-xs text-foreground/80">
                              <span className="block truncate max-w-[120px] font-mono">{tx.trxId}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">{tx.paymentMethod}</TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                            </TableCell>
                            <TableCell className="text-xs font-extrabold text-foreground">
                              ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Badge className="bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 uppercase">
                                {tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-xs italic">
                            No receipts found on your account.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>

                {/* PAGINATION CONTROLS */}
                {historyData && historyData.totalPages > 1 && (
                  <div className="flex justify-end items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="border-border hover:bg-muted rounded-xl h-8 text-xs font-semibold"
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-semibold px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-muted-foreground">
                      Page {page} of {historyData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(historyData.totalPages, page + 1))}
                      disabled={page === historyData.totalPages}
                      className="border-border hover:bg-muted rounded-xl h-8 text-xs font-semibold"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Orders History & Agreement overview (Right 1 col) */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground flex items-center">
              <Receipt className="w-4 h-4 mr-2 text-orange-500" />
              Order & Contract History
            </h3>

            <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg p-5">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Purchase History</CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground">Record of systems acquired on contract</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-3 border-t border-border/50 space-y-3">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ) : historyData?.orderHistory && historyData.orderHistory.length > 0 ? (
                  historyData.orderHistory.map((order) => (
                    <div key={order.id} className="flex justify-between items-center text-xs p-3 bg-muted/40 border border-border rounded-xl hover:border-border/80 transition-colors">
                      <div className="space-y-1 pr-2">
                        <span className="font-semibold text-foreground/90 block truncate max-w-[150px]">{order.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">{order.type.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right space-y-1 shrink-0">
                        <span className="font-bold text-foreground/80 block">${order.price.toLocaleString()}</span>
                        <Badge className={`text-[9px] font-extrabold px-1.5 py-0 uppercase ${
                          order.status === "active" ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 border border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                        }`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No orders registered.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
