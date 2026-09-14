import React, { useState, useEffect } from 'react';
import { UserProfile, Invoice, PaymentTransaction, ProjectEnquiry, SupportTicket } from '../types';
import {
  getInvoices,
  getPaymentTransactions,
  getEnquiries,
  getSupportTickets,
  createSupportTicket,
} from '../services/db';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  User,
  FileText,
  CreditCard,
  Layers,
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  FolderGit2,
} from 'lucide-react';
import { CustomerProjectsSection } from '../components/CustomerProjectsSection';

interface CustomerDashboardPageProps {
  user: UserProfile;
  onNavigateToPayment: (amount?: number, note?: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  user,
  onNavigateToPayment,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'invoices' | 'payments' | 'tickets'
  >('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Ticket State
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  useEffect(() => {
    loadCustomerData();
  }, [user]);

  const loadCustomerData = async () => {
    const allInvoices = await getInvoices();
    const allPayments = await getPaymentTransactions();
    const allEnquiries = await getEnquiries();
    const allTickets = await getSupportTickets();

    // Match by email or customer_id
    const userInvoices = allInvoices.filter(
      (inv) => inv.customer_email.toLowerCase() === user.email.toLowerCase()
    );
    const userPayments = allPayments.filter(
      (p) => p.customer_email.toLowerCase() === user.email.toLowerCase()
    );
    const userEnquiries = allEnquiries.filter(
      (e) => e.email.toLowerCase() === user.email.toLowerCase()
    );
    const userTickets = allTickets.filter(
      (t) => t.customer_email.toLowerCase() === user.email.toLowerCase()
    );

    setInvoices(userInvoices);
    setPayments(userPayments);
    setEnquiries(userEnquiries);
    setTickets(userTickets);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    await createSupportTicket({
      customer_name: user.full_name,
      customer_email: user.email,
      customer_phone: user.phone || '7269068483',
      subject: newTicketSubject.trim(),
      message: newTicketMessage.trim(),
      priority: 'medium',
    });

    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowNewTicketModal(false);
    loadCustomerData();
  };

  const totalPaid = payments
    .filter((p) => p.status === 'verified')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'pending_verification').length;

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl font-['Outfit'] shadow-md shadow-sky-500/20">
            {user.full_name ? user.full_name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Welcome back, {user.full_name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold border border-cyan-500/30">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.email} • {user.phone || 'Varanasi, UP'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToPayment(5000, 'Project Milestone Advance')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Make UPI Payment</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Account Overview', icon: Layers },
          { id: 'projects', label: 'Projects & Work Time', icon: FolderGit2 },
          { id: 'invoices', label: `Tax Invoices (${invoices.length})`, icon: FileText },
          { id: 'payments', label: `UPI Payments (${payments.length})`, icon: CreditCard },
          { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Remitted</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Verified across {payments.length} transactions
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Active Invoices</span>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {invoices.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Issued by SrijanTech</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Verification Queue
              </span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                {pendingPayments}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Awaiting bank match</span>
            </div>
          </div>

          {/* Active Inquiries / Projects */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">My Project Inquiries</h3>
            {enquiries.length === 0 ? (
              <p className="text-xs text-slate-400">
                You currently have no project inquiries submitted under this email. Submit a project
                brief on the Home or Contact page to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold">
                          {enq.enquiry_number}
                        </span>
                        <span className="text-white font-semibold">{enq.service_name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 capitalize">
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1 line-clamp-1">{enq.project_description}</p>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Projects & Work Time */}
      {activeTab === 'projects' && (
        <CustomerProjectsSection customerEmail={user.email} />
      )}

      {/* Tab 2: Invoices */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit']">Issued Tax Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-xs text-slate-400">
              No tax invoices have been generated for your account yet. When you complete an advance
              or milestone payment, SrijanTech will issue your formal invoice here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Service / Project</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Total Amount</th>
                    <th className="py-3 px-3 text-right">Balance Due</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 px-3 text-white font-medium">{inv.service_name}</td>
                      <td className="py-3 px-3 text-slate-400">{inv.issue_date}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        ₹{inv.total_amount.toLocaleString('en-IN')}
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
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          View / Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: UPI Payments */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">UPI Transactions Log</h3>
            <button
              onClick={() => onNavigateToPayment(5000, 'Milestone Advance')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              + New Payment
            </button>
          </div>

          {payments.length === 0 ? (
            <p className="text-xs text-slate-400">
              No transactions recorded yet. Use the "Pay UPI" button to submit your advance.
            </p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{p.transaction_number}</span>
                      <span className="text-white font-semibold">{p.transaction_note}</span>
                    </div>
                    <div className="text-slate-400 mt-1 flex items-center gap-3">
                      <span>UTR: {p.utr_number || 'N/A'}</span>
                      <span>•</span>
                      <span>{new Date(p.created_at).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-white font-mono">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'verified'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {p.status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Support Tickets */}
      {activeTab === 'tickets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Support & Maintenance</h3>
              <p className="text-xs text-slate-400">
                Direct ticketing line with Srijan Singh in Varanasi.
              </p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open Support Ticket</span>
            </button>
          </div>

          {tickets.length === 0 ? (
            <p className="text-xs text-slate-400">
              No support tickets opened. Need assistance with an active website or question? Click
              "Open Support Ticket" above.
            </p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{t.ticket_number}</span>
                      <h4 className="text-white font-bold text-sm">{t.subject}</h4>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'resolved'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                    {t.message}
                  </p>

                  {t.admin_response && (
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
                      <strong className="text-cyan-400 block text-[11px] mb-1">
                        SrijanTech Response:
                      </strong>
                      <span>{t.admin_response}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Open a Maintenance &amp; Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Domain SSL renewal or Bug on checkout"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Issue Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  placeholder="Provide full details of what is happening or what needs to be changed..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPayNow={(inv) => onNavigateToPayment(inv.remaining_balance, `Invoice ${inv.invoice_number} Balance`)}
        />
      )}
    </div>
  );
};
