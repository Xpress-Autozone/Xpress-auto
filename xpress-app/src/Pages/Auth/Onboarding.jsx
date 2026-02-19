import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeOnboarding, updateUser, signOut } from '../../Redux/userSlice';
import { Car, User, Phone, CheckCircle, ChevronRight, ArrowLeft, LogOut } from 'lucide-react';
import SEO from "../../lib/SEOHelper";

const Onboarding = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [step, setStep] = useState(1);

    const handleSignOut = () => {
        dispatch(signOut());
        navigate('/');
    };

    const [formData, setFormData] = useState({
        phone: '',
        carMake: '',
        carModel: '',
        carYear: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({
            phone: formData.phone,
            vehicle: {
                make: formData.carMake,
                model: formData.carModel,
                year: formData.carYear,
            }
        }));
        dispatch(completeOnboarding());
        navigate('/cart');
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <SEO title="Complete Your Profile | Xpress Auto" description="Finish setting up your account to start shopping." />

            <div className="max-w-2xl mx-auto px-6">
                <div className="mb-12 flex justify-between items-start">
                    <div>
                        <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                            Step {step} of 3
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-none">
                            Welcome <span className="text-gray-300">Member</span>
                        </h1>
                        <p className="mt-4 text-gray-500 font-bold uppercase tracking-tight text-xs">
                            Help us personalize your experience for better parts compatibility.
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-black uppercase tracking-widest text-[10px] transition-colors"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1 mb-12 flex">
                    <div
                        className="bg-black h-full transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-black text-white p-3 rounded-none italic">
                                    <User size={24} />
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tight">Basic Profile</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+233 -- --- ----"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-black p-4 pl-12 focus:bg-yellow-50 transition-colors font-bold outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full flex items-center justify-between bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all group"
                            >
                                Continue to Vehicle <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-black text-white p-3 rounded-none italic">
                                    <Car size={24} />
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tight">Your Vehicle</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Make</label>
                                    <input
                                        type="text"
                                        name="carMake"
                                        placeholder="e.g. Toyota"
                                        value={formData.carMake}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-black p-4 focus:bg-yellow-50 transition-colors font-bold outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Model</label>
                                    <input
                                        type="text"
                                        name="carModel"
                                        placeholder="e.g. Camry"
                                        value={formData.carModel}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-black p-4 focus:bg-yellow-50 transition-colors font-bold outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Year</label>
                                    <input
                                        type="number"
                                        name="carYear"
                                        placeholder="e.g. 2022"
                                        value={formData.carYear}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-black p-4 focus:bg-yellow-50 transition-colors font-bold outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 border-2 border-black p-6 font-black uppercase tracking-widest italic hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-[2] bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-between group"
                                >
                                    Final Review <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
                            <div className="inline-block bg-yellow-400 p-6 mb-4">
                                <CheckCircle size={64} className="text-black" />
                            </div>

                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Everything looks good!</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-tight text-xs max-w-sm mx-auto">
                                You're all set to experience the full power of Xpress AutoZone.
                            </p>

                            <div className="bg-gray-50 p-8 border border-gray-100 text-left space-y-4 my-8">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Profile</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">{user?.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Phone</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">{formData.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Vehicle</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">{formData.carYear} {formData.carMake} {formData.carModel}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 border-2 border-black p-6 font-black uppercase tracking-widest italic hover:bg-gray-100 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
                                >
                                    Complete Setup
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
