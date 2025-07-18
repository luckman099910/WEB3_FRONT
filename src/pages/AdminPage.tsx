import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Hand, 
  Users, 
  CreditCard, 
  BarChart, 
  Settings, 
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminBalanceManager from '../components/AdminBalanceManager';
import logo from '../assets/palmpay-logo.png';
import { getUsers, assignBalance, resetPassword } from '../api/adminApi';
import { getApplicants } from '../api/applicantsApi';
import { api } from '../api/palmPayApi';
import { Toaster, toast } from 'react-hot-toast';

const AdminPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState('');
  const [sendValueUser, setSendValueUser] = useState('');
  const [sendValueAmount, setSendValueAmount] = useState('');
  const [sendValueLoading, setSendValueLoading] = useState(false);
  const [sendValueError, setSendValueError] = useState('');
  const [sendValueSuccess, setSendValueSuccess] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState('');
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsError, setVendorsError] = useState('');
  const navigate = useNavigate();

  // Admin check
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.is_admin !== true) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    if (tabIndex === 0 || tabIndex === 1) {
      setUsersLoading(true);
      setUsersError('');
      getUsers()
        .then((res) => setUsers(res.data?.users || []))
        .catch((err) => setUsersError(err.message || 'Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [tabIndex]);

  // Fetch applicants
  useEffect(() => {
    if (tabIndex === 3) {
      setApplicantsLoading(true);
      setApplicantsError('');
      getApplicants()
        .then((res) => setApplicants(res.data?.applicants || res.applicants || []))
        .catch((err) => setApplicantsError(err.message || 'Failed to load applicants'))
        .finally(() => setApplicantsLoading(false));
    }
  }, [tabIndex]);

  // Fetch transactions
  useEffect(() => {
    if (tabIndex === 2) {
      setTransactionsLoading(true);
      setTransactionsError('');
      api.get('/api/transaction')
        .then((res) => setTransactions(res.data?.transactions || []))
        .catch((err) => setTransactionsError(err.message || 'Failed to load transactions'))
        .finally(() => setTransactionsLoading(false));
    }
  }, [tabIndex]);

  // Send value handler
  const handleSendValue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendValueError('');
    setSendValueSuccess('');
    setSendValueLoading(true);
    try {
      await assignBalance(sendValueUser, Number(sendValueAmount));
      setSendValueSuccess('Value sent successfully!');
      setSendValueUser('');
      setSendValueAmount('');
      // Refresh users
      getUsers().then((res) => setUsers(res.data?.users || []));
    } catch (err: any) {
      setSendValueError(err.message || 'Failed to send value');
    } finally {
      setSendValueLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '125,847',
      change: '+12.5%',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: CreditCard,
      title: 'Transactions Today',
      value: '₹45,23,890',
      change: '+8.3%',
      color: 'from-fintech-green to-electric-blue'
    },
    {
      icon: Shield,
      title: 'Security Score',
      value: '99.9%',
      change: '+0.1%',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: TrendingUp,
      title: 'Growth Rate',
      value: '23.4%',
      change: '+5.2%',
      color: 'from-orange-400 to-red-400'
    }
  ];

  const recentActivity = [
    {
      type: 'success',
      message: 'New user registration: john@example.com',
      time: '2 minutes ago'
    },
    {
      type: 'warning',
      message: 'High transaction volume detected',
      time: '5 minutes ago'
    },
    {
      type: 'success',
      message: 'Merchant verification completed',
      time: '8 minutes ago'
    },
    {
      type: 'info',
      message: 'System backup completed successfully',
      time: '15 minutes ago'
    }
  ];

  const tabList = [
    { label: 'Users', icon: Users },
    { label: 'Send Value', icon: DollarSign },
    { label: 'Transactions', icon: CreditCard },
    { label: 'Applicants', icon: Hand },
    { label: 'Inquiries', icon: AlertCircle },
    { label: 'Vendor Registrations', icon: CheckCircle }
  ];
  // Duplicate tabIndex declaration removed here

  useEffect(() => {
    if (tabIndex === 4) {
      setInquiriesLoading(true);
      setInquiriesError('');
      api.get('/api/inquiry')
        .then((res) => setInquiries(res.data?.inquiries || []))
        .catch((err) => setInquiriesError(err.message || 'Failed to load inquiries'))
        .finally(() => setInquiriesLoading(false));
    }
    if (tabIndex === 5) {
      setVendorsLoading(true);
      setVendorsError('');
      api.get('/api/vendor-registration')
        .then((res) => setVendors(res.data?.registrations || []))
        .catch((err) => setVendorsError(err.message || 'Failed to load vendor registrations'))
        .finally(() => setVendorsLoading(false));
    }
  }, [tabIndex]);

  // Add delete API calls
  const deleteUser = async (userId: string) => {
    await api.delete(`/api/auth/users/${userId}`);
  };
  const deleteTransaction = async (txid: string) => {
    await api.delete(`/api/transaction/${txid}`);
  };
  const deleteApplicant = async (applicantId: string) => {
    await api.delete(`/api/applicants/${applicantId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-2 sm:px-4 md:px-8 w-full">
      {/* Header */}
      <section className="mb-4 w-full flex flex-col items-center pt-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
      </section>
      {/* Tabs */}
      <div className="w-full flex flex-col items-center" style={{width: undefined}}>
        <div className="flex flex-col sm:flex-row border-b border-electric-blue/30 mb-6 w-full justify-center">
          {tabList.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setTabIndex(idx)}
              className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium transition-colors border-b-2 -mb-px ${
                tabIndex === idx
                  ? 'border-electric-blue text-electric-blue bg-white/5'
                  : 'border-transparent text-white/60 hover:text-electric-blue'
              }`}
            >
              <tab.icon size={18} className="sm:w-5 sm:h-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        
        <div className="bg-card-bg rounded-xl shadow-xl p-2 sm:p-6 min-h-[400px] w-full max-w-full sm:max-w-5xl">
          {tabIndex === 0 && (
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-bold">All Users</h2>
                <button
                  className="px-3 sm:px-4 py-2 rounded-lg bg-electric-blue text-white font-semibold shadow hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  onClick={() => {
                    // CSV generation logic
                    if (!users || users.length === 0) return;
                    const headers = [
                      'ID',
                      'Name',
                      'Email',
                      'Balance',
                      'Palm Hash',
                      'Role',
                      'Palm Registered',
                      'Created'
                    ];
                    const rows = users.map((u: any) => [
                      u.id,
                      u.username,
                      u.email,
                      u.balance,
                      u.palm_hash,
                      u.role,
                      u.palm_hash ? 'YES' : 'NO',
                      u.created_at?.slice(0, 10)
                    ]);
                    const csvContent = [
                      headers.join(','),
                      ...rows.map(r => r.map(field => `"${String(field ?? '').replace(/"/g, '""')}"`).join(','))
                    ].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'users.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download CSV
                </button>
              </div>
              {usersLoading ? (
                <div className="text-text-secondary">Loading users...</div>
              ) : usersError ? (
                <div className="text-red-400">{usersError}</div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[600px] sm:min-w-[900px] w-full text-left border-collapse text-xs sm:text-base">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-2 sm:px-3">Name</th>
                        <th className="py-2 px-2 sm:px-3">Email</th>
                        <th className="py-2 px-2 sm:px-3">Balance</th>
                        <th className="py-2 px-2 sm:px-3">Palm Hash</th>
                        <th className="py-2 px-2 sm:px-3">Role</th>
                        <th className="py-2 px-2 sm:px-3">Plam Registered</th>
                        <th className="py-2 px-2 sm:px-3">Created</th>
                        <th className="py-2 px-2 sm:px-3">Reset Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter((u: any) => u.role !== 'admin').map((u: any) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 sm:px-3">{u.username}</td>
                          <td className="py-2 px-2 sm:px-3">{u.email}</td>
                          <td className="py-2 px-2 sm:px-3">{u.balance}</td>
                          <td className="py-2 px-2 sm:px-3">{u.palm_hash}</td>
                          <td className="py-2 px-2 sm:px-3">{u.role}</td>
                          <td className="py-2 px-2 sm:px-3">{u.palm_hash?"YES":"NO"}</td>
                          <td className="py-2 px-2 sm:px-3">{u.created_at?.slice(0, 10)}</td>
                          <td className="py-2 px-2 sm:px-3">
                            <button
                              className="text-blue-400 hover:text-blue-600 font-bold text-xs sm:text-base"
                              onClick={async () => {
                                toast((t) => (
                                  <span>
                                    Reset this user's password to <b>"palmpay"</b>?<br/>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                      onClick={async () => {
                                        toast.dismiss(t.id);
                                        try {
                                          await resetPassword(u.id);
                                          toast.success('Password reset to "palmpay" for this user.');
                                        } catch (err: any) {
                                          toast.error('Failed to reset password: ' + (err?.response?.data?.message || err.message));
                                        }
                                      }}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                                      onClick={() => toast.dismiss(t.id)}
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                ));
                              }}
                            >
                              Reset Password
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
          {tabIndex === 1 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Send Value</h2>
              <form onSubmit={handleSendValue} className="space-y-4 flex flex-col items-center justify-center w-full max-w-full sm:max-w-lg mx-auto">
                <div className="w-full">
                  <label className="block text-sm text-white/70 mb-2">Select User</label>
                  <select
                    value={sendValueUser}
                    onChange={(e) => setSendValueUser(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none text-base sm:text-lg" style={{backgroundColor: "#29303c"}}
                    required
                  >
                    <option value="">-- Select a user --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username || u.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm text-white/70 mb-2">Amount</label>
                  <input
                    type="number"
                    value={sendValueAmount}
                    onChange={(e) => setSendValueAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none text-base sm:text-lg"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 rounded-full btn-primary animate-glow font-medium text-base sm:text-lg"
                  disabled={sendValueLoading}
                >
                  {sendValueLoading ? 'Sending...' : 'Send Value'}
                </button>
              </form>
              {sendValueError && <div className="mt-2 text-red-500 text-center">{sendValueError}</div>}
              {sendValueSuccess && <div className="mt-2 text-green-500 text-center">{sendValueSuccess}</div>}
            </div>
          )}
          {tabIndex === 2 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">All Transactions</h2>
              {transactionsLoading ? (
                <div className="text-text-secondary">Loading transactions...</div>
              ) : transactionsError ? (
                <div className="text-red-400">{transactionsError}</div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[600px] sm:min-w-[900px] w-full text-left border-collapse text-xs sm:text-base">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-2 sm:px-3">From User</th>
                        <th className="py-2 px-2 sm:px-3">To Merchant</th>
                        <th className="py-2 px-2 sm:px-3">Amount</th>
                        <th className="py-2 px-2 sm:px-3">Status</th>
                        <th className="py-2 px-2 sm:px-3">Created</th>
                        <th className="py-2 px-2 sm:px-3">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t: any) => (
                        <tr key={t.txid} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 sm:px-3">{t.from_user_id}</td>
                          <td className="py-2 px-2 sm:px-3">{t.to_merchant_id}</td>
                          <td className="py-2 px-2 sm:px-3">{t.amount}</td>
                          <td className="py-2 px-2 sm:px-3">{t.status}</td>
                          <td className="py-2 px-2 sm:px-3">{t.created_at?.slice(0, 10)}</td>
                          <td className="py-2 px-2 sm:px-3">
                            <button
                              className="text-red-400 hover:text-red-600 font-bold text-xs sm:text-base"
                              onClick={async () => {
                                toast((toastInst) => (
                                  <span>
                                    Delete this transaction?<br/>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                                      onClick={async () => {
                                        toast.dismiss(toastInst.id);
                                        try {
                                          await deleteTransaction(t.txid);
                                          setTransactions(transactions.filter((tx: any) => tx.txid !== t.txid));
                                          toast.success('Transaction deleted.');
                                        } catch (err: any) {
                                          toast.error('Failed to delete transaction: ' + (err?.response?.data?.message || err.message));
                                        }
                                      }}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                                      onClick={() => toast.dismiss(toastInst.id)}
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                ));
                              }}
                            >
                              Delete
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
          {tabIndex === 3 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Applicants</h2>
              {applicantsLoading ? (
                <div className="text-text-secondary">Loading applicants...</div>
              ) : applicantsError ? (
                <div className="text-red-400">{applicantsError}</div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[600px] sm:min-w-[900px] w-full text-left border-collapse text-xs sm:text-base">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-2 sm:px-3">Name</th>
                        <th className="py-2 px-2 sm:px-3">Email</th>
                        <th className="py-2 px-2 sm:px-3">Phone</th>
                        <th className="py-2 px-2 sm:px-3">Description</th>
                        <th className="py-2 px-2 sm:px-3">Created</th>
                        <th className="py-2 px-2 sm:px-3">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((a: any) => (
                        <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 sm:px-3">{a.username}</td>
                          <td className="py-2 px-2 sm:px-3">{a.email}</td>
                          <td className="py-2 px-2 sm:px-3">{a.phonenumber}</td>
                          <td className="py-2 px-2 sm:px-3">{a.description}</td>
                          <td className="py-2 px-2 sm:px-3">{a.created_at?.slice(0, 10)}</td>
                          <td className="py-2 px-2 sm:px-3">
                            <button
                              className="text-red-400 hover:text-red-600 font-bold text-xs sm:text-base"
                              onClick={async () => {
                                toast((toastInst) => (
                                  <span>
                                    Delete this applicant?<br/>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                                      onClick={async () => {
                                        toast.dismiss(toastInst.id);
                                        try {
                                          await deleteApplicant(a.id);
                                          setApplicants(applicants.filter((app: any) => app.id !== a.id));
                                          toast.success('Applicant deleted.');
                                        } catch (err: any) {
                                          toast.error('Failed to delete applicant: ' + (err?.response?.data?.message || err.message));
                                        }
                                      }}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      className="ml-2 px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                                      onClick={() => toast.dismiss(toastInst.id)}
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                ));
                              }}
                            >
                              Delete
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
          {tabIndex === 4 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">General Inquiries</h2>
              {inquiriesLoading ? (
                <div className="text-text-secondary">Loading inquiries...</div>
              ) : inquiriesError ? (
                <div className="text-red-400">{inquiriesError}</div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[600px] sm:min-w-[900px] w-full text-left border-collapse text-xs sm:text-base">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-2 sm:px-3">Name</th>
                        <th className="py-2 px-2 sm:px-3">Email/Phone</th>
                        <th className="py-2 px-2 sm:px-3">Role</th>
                        <th className="py-2 px-2 sm:px-3">Message</th>
                        <th className="py-2 px-2 sm:px-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq: any) => (
                        <tr key={inq.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 sm:px-3">{inq.name}</td>
                          <td className="py-2 px-2 sm:px-3">{inq.email_or_phone}</td>
                          <td className="py-2 px-2 sm:px-3">{inq.role}</td>
                          <td className="py-2 px-2 sm:px-3">{inq.message}</td>
                          <td className="py-2 px-2 sm:px-3">{inq.created_at?.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {tabIndex === 5 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Vendor Registrations</h2>
              {vendorsLoading ? (
                <div className="text-text-secondary">Loading vendor registrations...</div>
              ) : vendorsError ? (
                <div className="text-red-400">{vendorsError}</div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[600px] sm:min-w-[900px] w-full text-left border-collapse text-xs sm:text-base">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 px-2 sm:px-3">Business Name</th>
                        <th className="py-2 px-2 sm:px-3">Owner Name</th>
                        <th className="py-2 px-2 sm:px-3">Email</th>
                        <th className="py-2 px-2 sm:px-3">Phone</th>
                        <th className="py-2 px-2 sm:px-3">Address</th>
                        <th className="py-2 px-2 sm:px-3">Interests</th>
                        <th className="py-2 px-2 sm:px-3">Comments</th>
                        <th className="py-2 px-2 sm:px-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((v: any) => (
                        <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-2 sm:px-3">{v.business_name}</td>
                          <td className="py-2 px-2 sm:px-3">{v.owner_name}</td>
                          <td className="py-2 px-2 sm:px-3">{v.email}</td>
                          <td className="py-2 px-2 sm:px-3">{v.phone}</td>
                          <td className="py-2 px-2 sm:px-3">{v.address}</td>
                          <td className="py-2 px-2 sm:px-3">{Array.isArray(v.interests) ? v.interests.join(', ') : v.interests}</td>
                          <td className="py-2 px-2 sm:px-3">{v.comments}</td>
                          <td className="py-2 px-2 sm:px-3">{v.created_at?.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;