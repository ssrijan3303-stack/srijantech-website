import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WebsiteSettings,
  ProjectEnquiry,
  Invoice,
  PaymentTransaction,
  Service,
  Project,
  PricingPlan,
  Testimonial,
  Faq,
  BlogPost,
  SupportTicket,
} from '../types';
import {
  getEnquiries,
  updateEnquiryStatus,
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getPaymentTransactions,
  verifyPaymentTransaction,
  getServices,
  saveService,
  getProjects,
  saveProject,
  getPricingPlans,
  savePricingPlan,
  getTestimonials,
  saveTestimonial,
  getFaqs,
  saveFaq,
  getBlogPosts,
  saveBlogPost,
  getSupportTickets,
  updateSupportTicket,
  getWebsiteSettings,
  saveWebsiteSettings,
} from '../services/db';
import { InvoiceModal } from '../components/InvoiceModal';
import { AdminTimeTrackingSection } from '../components/AdminTimeTrackingSection';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  CreditCard,
  Briefcase,
  FolderGit2,
  Tag,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Headphones,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Search,
  Check,
  Camera,
} from 'lucide-react';

interface AdminDashboardPageProps {
  adminUser: UserProfile;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(false);

  // Data States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Modal / Selection States
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  // Forms
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Invoice form state
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvPhone, setNewInvPhone] = useState('');
  const [newInvAddress, setNewInvAddress] = useState('Varanasi, UP');
  const [newInvService, setNewInvService] = useState('Custom Web Application');
  const [newInvAmount, setNewInvAmount] = useState(25000);
  const [newInvAdvance, setNewInvAdvance] = useState(10000);
  const [newInvDueDate, setNewInvDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // New Service form state
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(20000);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFeatures, setNewServiceFeatures] = useState('Responsive UI\nTypeScript Backend\nUPI Integration');

  // New Project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Full-Stack Web App');
  const [newProjCost, setNewProjCost] = useState(35000);
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('React, TypeScript, Vite, Tailwind, Supabase');
  const [newProjFeat, setNewProjFeat] = useState('Real-Time Updates, UPI Instant Checkout, Admin Control');

  // Notification / Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, enq, inv, pay, srv, prj, prc, tst, fq, blg, tkt] = await Promise.all([
        getWebsiteSettings(),
        getEnquiries(),
        getInvoices(),
        getPaymentTransactions(),
        getServices(),
        getProjects(),
        getPricingPlans(),
        getTestimonials(),
        getFaqs(),
        getBlogPosts(),
        getSupportTickets(),
      ]);

      setSettings(s);
      setEnquiries(enq);
      setInvoices(inv);
      setPayments(pay);
      setServices(srv);
      setProjects(prj);
      setPricing(prc);
      setTestimonials(tst);
      setFaqs(fq);
      setPosts(blg);
      setTickets(tkt);
    } finally {
      setLoading(false);
    }
  };

  // Status Handlers
  const handleEnquiryStatusChange = async (id: string, status: ProjectEnquiry['status']) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast('Enquiry status updated');
  };

  const handleVerifyPayment = async (txId: string) => {
    await verifyPaymentTransaction(txId);
    showToast('Payment verified and reconciled with bank!');
    loadAllData();
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvCustomer.trim() || !newInvEmail.trim()) return;

    const subtotal = Number(newInvAmount);
    const advance = Number(newInvAdvance);
    const balance = Math.max(0, subtotal - advance);

    const inv = await saveInvoice({
      customer_name: newInvCustomer.trim(),
      customer_email: newInvEmail.trim(),
      customer_phone: newInvPhone.trim(),
      customer_address: newInvAddress.trim(),
      service_name: newInvService.trim(),
      issue_date: new Date().toISOString().split('T')[0],
      due_date: newInvDueDate,
      items: [
        {
          description: newInvService.trim(),
          quantity: 1,
          unit_price: subtotal,
          amount: subtotal,
        },
      ],
      subtotal,
      tax_rate: 0,
      tax_amount: 0,
      discount_amount: 0,
      advance_paid: advance,
      total_amount: subtotal,
      remaining_balance: balance,
      status: balance === 0 ? 'paid' : advance > 0 ? 'partially_paid' : 'issued',
    });

    setInvoices([inv, ...invoices]);
    setShowCreateInvoiceModal(false);
    showToast(`Invoice ${inv.invoice_number} created!`);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(id);
      setInvoices(invoices.filter((i) => i.id !== id));
      showToast('Invoice deleted');
    }
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    await updateSupportTicket(ticketId, 'resolved', ticketReplyText.trim());
    setReplyTicketId(null);
    setTicketReplyText('');
    showToast('Support ticket resolved with customer response!');
    loadAllData();
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await saveWebsiteSettings(settings);
    showToast('Website & business settings saved successfully!');
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const srv = await saveService({
      slug: newServiceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newServiceTitle.trim(),
      short_description: newServiceDesc.trim(),
      detailed_description: newServiceDesc.trim(),
      icon: 'Globe',
      base_price: Number(newServicePrice),
      features: newServiceFeatures.split('\n').filter(Boolean),
      is_active: true,
      display_order: services.length + 1,
    });

    setServices([...services, srv]);
    setShowCreateServiceModal(false);
    setNewServiceTitle('');
    setNewServiceDesc('');
    showToast('Service added!');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const prj = await saveProject({
      slug: newProjTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newProjTitle.trim(),
      category: newProjCategory.trim(),
      description: newProjDesc.trim(),
      detailed_case_study: newProjDesc.trim(),
      technologies: newProjTech.split(',').map((s) => s.trim()).filter(Boolean),
      features: newProjFeat.split(',').map((s) => s.trim()).filter(Boolean),
      estimated_cost: Number(newProjCost),
      is_featured: true,
      display_order: projects.length + 1,
    });

    setProjects([...projects, prj]);
    setShowCreateProjectModal(false);
    setNewProjTitle('');
    setNewProjDesc('');
    showToast('Project prototype added!');
  };

  // KPIs
  const totalRevenue = payments
    .filter((p) => p.status === 'verified')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingVerificationCount = payments.filter(
    (p) => p.status === 'pending_verification'
  ).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: `Enquiries (${newEnquiriesCount})`, icon: Inbox },
    { id: 'invoices', label: `Invoices (${invoices.length})`, icon: FileText },
    { id: 'payments', label: `UPI Bank Match (${pendingVerificationCount})`, icon: CreditCard },
    { id: 'services', label: `Services (${services.length})`, icon: Briefcase },
    { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
    { id: 'time-tracking', label: 'Time Tracking & Progress', icon: Clock },
    { id: 'tickets', label: `Support Tickets (${openTicketsCount})`, icon: Headphones },
    { id: 'settings', label: 'Site & Founder Settings', icon: Settings },
  ];

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              SrijanTech Executive Admin Panel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
              Varanasi Node
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong>{adminUser.full_name}</strong> (mystoreorder0004@gmail.com) • UPI:{' '}
            <strong className="text-cyan-300 font-mono">7269068483@ptyes</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            title="Refresh database"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Verified Revenue</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Via Indian UPI</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Pending UTR Matches</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
                {pendingVerificationCount}
              </div>
              <button
                onClick={() => setActiveTab('payments')}
                className="text-[11px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Verify Transactions →
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">New Client Inquiries</span>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
                {newEnquiriesCount}
              </div>
              <button
                onClick={() => setActiveTab('enquiries')}
                className="text-[11px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Open CRM Pipeline →
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Support Tickets</span>
              <div className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">
                {openTicketsCount}
              </div>
              <button
                onClick={() => setActiveTab('tickets')}
                className="text-[11px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Respond to Clients →
              </button>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Admin Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateInvoiceModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Tax Invoice</span>
              </button>
              <button
                onClick={() => setShowCreateServiceModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project Concept</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENQUIRIES / CRM PIPELINE */}
      {activeTab === 'enquiries' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Client Enquiries &amp; CRM Pipeline
            </h3>
            <span className="text-xs text-slate-400">{enquiries.length} total entries</span>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{enq.enquiry_number}</span>
                    <h4 className="font-bold text-white text-sm">{enq.full_name}</h4>
                    <span className="text-slate-400">({enq.email} • {enq.phone})</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        handleEnquiryStatusChange(enq.id, e.target.value as ProjectEnquiry['status'])
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold focus:outline-none"
                    >
                      <option value="new">New Inquiry</option>
                      <option value="in_review">In Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>

                    <a
                      href={`https://wa.me/91${enq.whatsapp || enq.phone}?text=${encodeURIComponent(
                        `Hello ${enq.full_name}, this is Srijan Singh from SrijanTech (Varanasi). Regarding your enquiry ${enq.enquiry_number}:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Direct WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px]">
                  <div>
                    <strong>Service:</strong> {enq.service_name}
                  </div>
                  <div>
                    <strong>Budget:</strong> {enq.budget_range}
                  </div>
                  <div>
                    <strong>Channel:</strong> {enq.preferred_contact_method}
                  </div>
                </div>

                <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  {enq.project_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES MANAGER */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Tax Invoices Manager</h3>
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3 text-right">Total (INR)</th>
                  <th className="py-3 px-3 text-right">Advance Paid</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-3 text-white font-medium">
                      {inv.customer_name}
                      <span className="block text-[11px] text-slate-500">{inv.customer_email}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{inv.service_name}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ₹{inv.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">
                      ₹{inv.advance_paid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      ₹{inv.remaining_balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                      >
                        Print/PDF
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: UPI BANK RECONCILIATION */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                UPI Remittance &amp; UTR Reconciliation
              </h3>
              <p className="text-xs text-slate-400">
                Match customer submitted 12-digit UTR against your bank statement for{' '}
                <span className="text-cyan-300 font-mono">7269068483@ptyes</span>.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold">
              {pendingVerificationCount} Awaiting Verification
            </span>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{p.transaction_number}</span>
                    <span className="text-white font-bold text-sm">{p.customer_name}</span>
                    <span className="text-slate-400">({p.customer_phone})</span>
                  </div>
                  <div className="text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-slate-300 font-medium">Note: {p.transaction_note}</span>
                    <span>•</span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      UTR: {p.utr_number || 'N/A'}
                    </span>
                    <span>•</span>
                    <span>{new Date(p.created_at).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-extrabold text-white font-mono">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </span>

                  {p.status === 'pending_verification' ? (
                    <button
                      onClick={() => handleVerifyPayment(p.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify &amp; Confirm</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                      Verified &amp; Reconciled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES */}
      {activeTab === 'services' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Services Catalog</h3>
            <button
              onClick={() => setShowCreateServiceModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm font-['Outfit']">{srv.title}</h4>
                    <span className="font-mono text-cyan-400 font-bold">
                      ₹{srv.base_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{srv.short_description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {srv.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Demonstration Projects &amp; Concepts
            </h3>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Prototype</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((prj) => (
              <div
                key={prj.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm font-['Outfit']">{prj.title}</h4>
                    <span className="font-mono text-cyan-400 font-bold">
                      Est: ₹{prj.estimated_cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-500 block mt-0.5">
                    {prj.category}
                  </span>
                  <p className="text-slate-400 mt-2 line-clamp-2">{prj.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {prj.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TIME TRACKING & PROGRESS */}
      {activeTab === 'time-tracking' && (
        <AdminTimeTrackingSection onShowToast={showToast} />
      )}

      {/* TAB 7: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Customer Support &amp; Maintenance Tickets
          </h3>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{t.ticket_number}</span>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                    <span className="text-slate-400">({t.customer_name} • {t.customer_email})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  {t.message}
                </p>

                {t.admin_response ? (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                    <strong className="text-cyan-400 block text-[11px] mb-0.5">Your Response:</strong>
                    <span>{t.admin_response}</span>
                  </div>
                ) : (
                  <div className="pt-2">
                    {replyTicketId === t.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          placeholder="Type your reply to the customer..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyTicketId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplyTicket(t.id)}
                            className="px-4 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                          >
                            Send &amp; Resolve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyTicketId(t.id);
                          setTicketReplyText('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                      >
                        Reply &amp; Resolve Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: WEBSITE SETTINGS & FOUNDER PROFILE */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSettingsSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            SrijanTech Business &amp; Founder Profile Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Name</label>
              <input
                type="text"
                value={settings.founder_name}
                onChange={(e) => setSettings({ ...settings, founder_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Role</label>
              <input
                type="text"
                value={settings.founder_role}
                onChange={(e) => setSettings({ ...settings, founder_role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Business Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Indian UPI ID</label>
              <input
                type="text"
                value={settings.upi_id}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Founder Photo Asset (/assets/founder.jpeg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.founder_photo_url || ''}
                  onChange={(e) => setSettings({ ...settings, founder_photo_url: e.target.value })}
                  placeholder="/assets/founder.jpeg"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          const b64 = event.target?.result as string;
                          if (b64) {
                            setSettings({ ...settings, founder_photo_url: '/assets/founder.jpeg' });
                            localStorage.setItem('srijantech_founder_photo', b64);
                            window.dispatchEvent(new CustomEvent('founder_photo_updated', { detail: b64 }));
                            await fetch('/api/upload-founder-photo', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ imageBase64: b64 }),
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Bio</label>
              <textarea
                rows={3}
                value={settings.founder_bio}
                onChange={(e) => setSettings({ ...settings, founder_bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Vision</label>
              <textarea
                rows={2}
                value={settings.vision}
                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Mission</label>
              <textarea
                rows={2}
                value={settings.mission}
                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Outfit']">Generate New Tax Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={newInvCustomer}
                  onChange={(e) => setNewInvCustomer(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newInvPhone}
                    onChange={(e) => setNewInvPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Service / Project Item</label>
                <input
                  type="text"
                  required
                  value={newInvService}
                  onChange={(e) => setNewInvService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newInvAdvance}
                    onChange={(e) => setNewInvAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvDueDate}
                    onChange={(e) => setNewInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SERVICE MODAL */}
      {showCreateServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white font-['Outfit']">Add New Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="e.g. AI-Powered CRM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Base Price (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Summary of engineering deliverable"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={newServiceFeatures}
                  onChange={(e) => setNewServiceFeatures(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white font-['Outfit']">Add Prototype Concept</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Hospital OPD Queuing Portal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newProjCost}
                    onChange={(e) => setNewProjCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description / Scope</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={newProjTech}
                  onChange={(e) => setNewProjTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Prototype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal for Viewing/Printing */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};
