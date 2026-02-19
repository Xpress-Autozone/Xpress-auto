import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../Redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  User,
  Heart,
  LogOut,
  Trash2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const MyAccount = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };

  // Mock Purchase History
  const purchaseHistory = [
    { id: "ORD-7721", date: "Dec 12, 2025", total: 450.00, status: "Delivered" },
    { id: "ORD-8902", date: "Nov 28, 2025", total: 125.50, status: "Processing" },
  ];

  const handleDeleteAccount = () => {
    if (window.confirm("WARNING: This action is permanent. Delete your Xpress AutoZone account?")) {
      // Logic for deletion goes here
      console.log("Account deleted");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER SECTION */}
        <div className="mb-12 border-b-2 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
              Member Dashboard
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              My <span className="text-gray-300">Account</span>
            </h1>
          </div>
          <Link
            to="/wishlist"
            className="flex items-center gap-2 bg-black text-white px-6 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all"
          >
            <Heart size={16} /> View Wishlist
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* LEFT: NAV TABS */}
          <aside className="lg:col-span-1 space-y-1">
            <TabBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Order History" icon={<Package size={18} />} />
            <TabBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Profile Details" icon={<User size={18} />} />
            <div className="pt-8 mt-8 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>

          {/* RIGHT: CONTENT AREA */}
          <main className="lg:col-span-3 border border-gray-100 p-8 md:p-12">

            {activeTab === 'history' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Purchase History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {purchaseHistory.map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="py-6 text-xs font-black uppercase tracking-tight">{order.id}</td>
                          <td className="py-6 text-xs font-bold text-gray-500">{order.date}</td>
                          <td className="py-6 text-sm font-black italic">GH₵{order.total.toFixed(2)}</td>
                          <td className="py-6">
                            <span className="text-[9px] font-black uppercase px-2 py-1 border border-black italic">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoGroup label="Full Name" value={user?.name || "Member Name"} />
                    <InfoGroup label="Email Address" value={user?.email || "member@example.com"} />
                    <InfoGroup label="Phone" value={user?.phone || "+233 -- --- ----"} />
                    <InfoGroup label="Member Since" value="January 2025" />
                  </div>
                </div>

                {/* VEHICLE DETAILS */}
                <div className="pt-12 border-t border-gray-100 space-y-6">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Vehicle Details</h3>
                  <div className="bg-gray-50 p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InfoGroup label="Make" value={user?.vehicle?.make || "Not Set"} />
                    <InfoGroup label="Model" value={user?.vehicle?.model || "Not Set"} />
                    <InfoGroup label="Year" value={user?.vehicle?.year || "Not Set"} />
                  </div>
                </div>

                {/* DANGER ZONE */}
                <div className="pt-12 border-t border-gray-100">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-600 mb-6">Security & Privacy</h4>
                  <div className="bg-red-50 p-8 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h5 className="font-black uppercase tracking-tight text-sm text-red-900">Delete Account</h5>
                      <p className="text-[10px] font-bold text-red-700 uppercase tracking-tight mt-1">
                        Permanently remove your data and order history from Xpress AutoZone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                      <Trash2 size={14} /> Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const TabBtn = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest italic transition-all border ${active ? 'bg-black text-white border-black' : 'text-gray-400 border-transparent hover:border-gray-100 hover:text-black'
      }`}
  >
    <span className="flex items-center gap-3">{icon} {label}</span>
    {active && <ChevronRight size={14} />}
  </button>
);

const InfoGroup = ({ label, value }) => (
  <div className="space-y-1 border-b border-gray-50 pb-4">
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
    <p className="text-sm font-bold text-black uppercase tracking-tight">{value}</p>
  </div>
);

export default MyAccount;