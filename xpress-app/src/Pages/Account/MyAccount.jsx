import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, updateUserProfile, fetchUserOrders } from '../../Redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  User,
  Heart,
  LogOut,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Save,
  X,
  MapPin,
  Loader2,
  Navigation
} from 'lucide-react';

const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other', 'N/A'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

const MyAccount = () => {
  const { user, orders, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editFormData, setEditFormData] = useState({
    phone: '',
    address: '',
    vehicle: {
      make: '',
      model: '',
      year: '',
      fuelType: ''
    }
  });

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEditFormData({
        phone: user.phone || '',
        address: user.address || '',
        vehicle: {
          make: user.vehicle?.make || '',
          model: user.vehicle?.model || '',
          year: user.vehicle?.year || '',
          fuelType: user.vehicle?.fuelType || ''
        }
      });
    }
  }, [user]);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditFormData({
        phone: user.phone || '',
        address: user.address || '',
        vehicle: {
          make: user.vehicle?.make || '',
          model: user.vehicle?.model || '',
          year: user.vehicle?.year || '',
          fuelType: user.vehicle?.fuelType || ''
        }
      });
      setSaveStatus(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vehicle.')) {
      const field = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        vehicle: { ...prev.vehicle, [field]: value }
      }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'Xpress-AutoZone-App'
              }
            }
          );
          const data = await response.json();
          if (data && data.display_name) {
            setEditFormData(prev => ({ ...prev, address: data.display_name }));
          } else {
            setEditFormData(prev => ({ ...prev, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setEditFormData(prev => ({ ...prev, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Failed to get your location. Please check your browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    setSaveStatus(null);
    const result = await dispatch(updateUserProfile(editFormData));
    if (updateUserProfile.fulfilled.match(result)) {
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);

  const handleDeleteAccount = async (force = false) => {
    try {
      setIsDeleting(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com"}/users/${user.uid}/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ force })
      });

      const data = await response.json();

      if (response.status === 409) {
        // Has pending orders
        setPendingOrders(data.pendingOrders);
        setShowDeleteWarning(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      // Success
      alert("Your account and data have been permanently deleted.");
      dispatch(signOut());
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error("Delete Account Error:", err);
      alert("Failed to delete account: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-left">

        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-12 border-b-2 border-black pb-6 md:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-500">
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-2 block">
              Member Dashboard
            </span>
            <h1 className="text-3xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-tight md:leading-none">
              My Account
            </h1>
          </div>
          <Link
            to="/cart"
            className="hidden md:flex items-center gap-2 text-black px-6 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-white transition-all border border-black md:border-none"
          >
            <Heart size={16} /> View Cart
          </Link>
        </div>

        {/* MOBILE STICKY NAV */}
        <div className="md:hidden sticky top-[70px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 flex overflow-x-auto scrollbar-hide mb-6 -mx-4 px-4">
          <MobileTab active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="History" />
          <MobileTab active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsEditing(false); }} label="Profile" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">

          {/* LEFT: NAV TABS (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-1">
            <TabBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Order History" icon={<Package size={18} />} />
            <TabBtn active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsEditing(false); }} label="Profile Details" icon={<User size={18} />} />
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
          <main className="lg:col-span-3 border-none md:border md:border-gray-100 p-0 md:p-12 relative">
            
            {saveStatus === 'success' && (
              <div className="fixed bottom-24 md:absolute md:top-4 md:right-8 left-4 right-4 md:left-auto md:w-auto bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 md:py-2 rounded shadow-xl md:shadow-none z-50 text-center animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4">
                Profile Updated Successfully
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="fixed bottom-24 md:absolute md:top-4 md:right-8 left-4 right-4 md:left-auto md:w-auto bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 md:py-2 rounded shadow-xl md:shadow-none z-50 text-center animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4">
                Failed to update profile
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">History</h3>
                {loading && orders.length === 0 ? (
                  <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px]">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading orders...
                  </div>
                ) : orders.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black">
                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.map((order) => (
                            <OrderRow key={order.id} order={order} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-8 md:p-12 border-2 border-dashed border-gray-100 text-center rounded-2xl">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No orders found yet</p>
                    <Link to="/xplore" className="mt-4 inline-block text-black font-black uppercase tracking-widest text-[10px] underline hover:text-yellow-500">Start Shopping</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Account Details</h3>
                      <div className="hidden md:flex gap-2">
                        <button
                          onClick={isEditing ? handleSave : handleEditToggle}
                          disabled={loading}
                          className="btn-golden disabled:opacity-50"
                        >
                          {loading && isEditing ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : isEditing ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}
                        </button>
                        {isEditing && (
                          <button
                            onClick={handleEditToggle}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all italic border-2 border-gray-200 text-gray-400 hover:border-black hover:text-black"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      {/* Mobile Edit Trigger */}
                      {!isEditing && (
                         <button
                         onClick={handleEditToggle}
                         className="md:hidden w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest italic rounded-full shadow-lg"
                       >
                         Edit Profile
                       </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <InfoGroup label="Full Name" value={user?.name || "Member Name"} isReadOnly={true} />
                      <InfoGroup label="Email Address" value={user?.email || "member@example.com"} isReadOnly={true} />
                      <InfoGroup
                        label="Phone Number"
                        value={editFormData.phone}
                        isEditing={isEditing}
                        name="phone"
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX"
                      />
                      <InfoGroup label="Member Status" value={user?.isOnboarded ? "Verified Member" : "Incomplete Profile"} isReadOnly={true} />
                    </div>
                    
                    <div className="pt-4 md:pt-6">
                      <InfoGroup
                        label="Shipping Address"
                        value={editFormData.address}
                        isEditing={isEditing}
                        name="address"
                        onChange={handleInputChange}
                        placeholder="e.g. 123 Xpress Ave, Accra"
                        icon={<MapPin size={14} className="text-gray-400" />}
                        onAction={handleGetCurrentLocation}
                        actionIcon={<Navigation size={12} />}
                        isLoading={isLocating}
                      />
                    </div>
                  </div>

                  {/* VEHICLE DETAILS */}
                  <div className="pt-8 md:pt-12 border-t border-gray-100 space-y-6 md:space-y-8">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Vehicle Details</h3>
                    <div className="bg-gray-50/50 md:bg-gray-50 p-4 md:p-8 border border-gray-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      <InfoGroup label="Make" value={editFormData.vehicle.make} isEditing={isEditing} name="vehicle.make" onChange={handleInputChange} placeholder="e.g. Toyota" />
                      <InfoGroup label="Model" value={editFormData.vehicle.model} isEditing={isEditing} name="vehicle.model" onChange={handleInputChange} placeholder="e.g. Camry" />
                      <InfoGroup label="Year" value={editFormData.vehicle.year} isEditing={isEditing} name="vehicle.year" onChange={handleInputChange} type="select" options={years} />
                      <InfoGroup label="Fuel" value={editFormData.vehicle.fuelType} isEditing={isEditing} name="vehicle.fuelType" onChange={handleInputChange} type="select" options={fuelTypes} />
                    </div>
                  </div>

                  {/* DANGER ZONE - MINIMAL */}
                  <div className="pt-12 border-t border-gray-100 flex flex-col items-center">
                    <button
                      onClick={() => handleDeleteAccount(false)}
                      disabled={isDeleting}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 size={12} />}
                      Permanently Delete Account
                    </button>
                    <p className="text-[9px] text-gray-300 mt-2 uppercase tracking-tighter">
                      This action is final and removes all history.
                    </p>
                  </div>
                </div>

                {/* PENDING ORDERS WARNING MODAL */}
                {showDeleteWarning && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white max-w-md w-full rounded-2xl p-8 border border-red-100 shadow-2xl animate-in zoom-in-95 duration-300">
                      <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <ShieldCheck className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight text-gray-900 text-center mb-2">
                        Active Orders Found
                      </h3>
                      <p className="text-sm text-gray-500 font-medium text-center mb-6">
                        You have <span className="text-red-600 font-bold">{pendingOrders.length}</span> active order(s) in progress. Deleting your account now will remove your access to track these orders.
                      </p>
                      
                      <div className="bg-gray-50 rounded-xl p-4 mb-8 max-h-32 overflow-y-auto">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Orders affected:</p>
                        {pendingOrders.map(order => (
                          <div key={order.id} className="text-xs font-bold text-gray-700 py-1">
                            #{order.orderNumber}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleDeleteAccount(true)}
                          className="w-full bg-red-600 hover:bg-black text-white font-black uppercase italic tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-red-600/20"
                        >
                          I understand, delete everything
                        </button>
                        <button
                          onClick={() => setShowDeleteWarning(false)}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all"
                        >
                          Wait, take me back
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MOBILE SIGN OUT */}
                <div className="md:hidden pt-8 pb-12">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 p-6 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 border-2 border-gray-100 rounded-2xl transition-all active:scale-95 bg-gray-50/50"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>

                {/* MOBILE STICKY ACTION BAR */}
                {isEditing && (
                  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 z-40 animate-in slide-in-from-bottom-full">
                     <button
                        onClick={handleEditToggle}
                        className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest italic rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-[2] py-4 bg-yellow-400 text-white text-[10px] font-black uppercase tracking-widest italic rounded-full shadow-lg shadow-yellow-200"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Save Changes'}
                      </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MobileTab = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest flex-shrink-0 border-b-2 transition-all ${
      active ? 'border-yellow-500 text-black' : 'border-transparent text-gray-400'
    }`}
  >
    {label}
  </button>
);

const OrderCard = ({ order }) => {
  const statusInfo = getStatusStyles(order.orderStatus);
  const dateStr = order.createdAt?._seconds
    ? new Date(order.createdAt._seconds * 1000).toLocaleDateString()
    : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—';
  
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase text-gray-400">Order #{order.orderNumber || order.id?.substring(0,8)}</p>
          <p className="text-[10px] font-bold text-gray-500">{dateStr}</p>
        </div>
        <span className={`text-[8px] font-black uppercase px-2 py-1 border rounded-full italic ${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </div>
      <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between items-end">
        <div className="flex-1 pr-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items</p>
          <p className="text-xs font-bold text-gray-600 line-clamp-1">
            {(order.items || []).map(i => `${i.productName || i.name || i.itemName || 'Part'}`).join(', ') || '—'}
          </p>
        </div>
        <p className="text-lg font-black italic">GH₵{order.total?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

const OrderRow = ({ order }) => {
  const statusInfo = getStatusStyles(order.orderStatus || order.status);
  const itemSummary = (order.items || []).map(i => `${i.productName || i.name || i.itemName || 'Part'} ×${i.quantity || 1}`).join(', ') || '—';
  const dateStr = order.createdAt?._seconds
    ? new Date(order.createdAt._seconds * 1000).toLocaleDateString()
    : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—';
    
  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="py-5 text-xs font-black uppercase tracking-tight">{order.orderNumber || order.id}</td>
      <td className="py-5 text-xs font-bold text-gray-500">{dateStr}</td>
      <td className="py-5 text-xs text-gray-500 max-w-[160px] truncate">{itemSummary}</td>
      <td className="py-5 text-sm font-black italic">GH₵{order.total?.toFixed(2) || '0.00'}</td>
      <td className="py-5">
        <span className={`text-[9px] font-black uppercase px-2 py-1 border rounded-full italic ${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </td>
    </tr>
  );
};

const getStatusStyles = (status) => {
  const statusMap = {
    requested:    { label: '📋 Requested',    cls: 'border-blue-400 text-blue-600 bg-blue-50' },
    payment_made: { label: '💳 Payment Made', cls: 'border-purple-400 text-purple-600 bg-purple-50' },
    dispatched:   { label: '🚚 Dispatched',   cls: 'border-orange-400 text-orange-600 bg-orange-50' },
    received:     { label: '✅ Received',     cls: 'border-green-500 text-green-600 bg-green-50' },
    cancelled:    { label: '❌ Cancelled',    cls: 'border-red-400 text-red-600 bg-red-50' },
    delivered:    { label: '🏠 Delivered',    cls: 'border-green-500 text-green-600 bg-green-50' },
    pending:      { label: '⏳ Pending',      cls: 'border-gray-400 text-gray-600 bg-gray-50' },
    confirmed:    { label: '📌 Confirmed',    cls: 'border-yellow-400 text-yellow-600 bg-yellow-50' },
    shipped:      { label: '📦 Shipped',      cls: 'border-orange-400 text-orange-600 bg-orange-50' },
    completed:    { label: '✅ Completed',    cls: 'border-green-500 text-green-600 bg-green-50' },
  };
  const s = status?.toLowerCase();
  return statusMap[s] || { label: status || 'Pending', cls: 'border-black text-black' };
};

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

const InfoGroup = ({ label, value, isEditing, name, onChange, isReadOnly, placeholder, type = "text", options = [], icon = null, onAction = null, actionIcon = null, isLoading = false }) => (
  <div className="space-y-2 border-b border-gray-50 pb-4 text-left">
    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block">{label}</label>
    {isEditing && !isReadOnly ? (
      <div className="relative">
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border-2 border-black p-3 md:p-2 text-xs md:text-sm font-bold uppercase outline-none focus:bg-yellow-50 transition-colors rounded-xl md:rounded-none"
          >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border-2 border-black p-3 md:p-2 text-xs md:text-sm font-bold uppercase outline-none focus:bg-yellow-50 transition-colors rounded-xl md:rounded-none ${onAction ? 'pr-12' : ''}`}
          />
        )}
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#4285F4] hover:bg-[#357ae8] text-white rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-md"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : React.cloneElement(actionIcon, { className: 'fill-white' })}
          </button>
        )}
      </div>
    ) : (
      <div className="flex items-center gap-2">
        {icon}
        <p className={`text-xs md:text-sm font-bold uppercase tracking-tight ${isReadOnly && isEditing ? 'text-gray-400' : 'text-black'}`}>
          {value || "Not Set"}
        </p>
      </div>
    )}
  </div>
);

export default MyAccount;
