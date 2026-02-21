import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeOnboarding, updateUser, signOut } from "../../Redux/userSlice";
import {
  Car,
  User,
  Phone,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Fuel,
  Globe,
  FastForward,
} from "lucide-react";
import SEO from "../../lib/SEOHelper";
import { getAuth } from "firebase/auth";
import { app } from "../../Firebase/firebase";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com";

const countryCodes = [
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];


const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "Other"];

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1959 },
  (_, i) => currentYear - i,
);

const Onboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const auth = getAuth(app);
  const [step, setStep] = useState(1);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/");
  };

  const [formData, setFormData] = useState({
    countryCode: "+233",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: currentYear.toString(),
    fuelType: "Petrol",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFuelTypeToggle = (type) => {
    setFormData((prev) => ({ ...prev, fuelType: type }));
  };

  const nextStep = () => {
    setIsSkipped(false);
    setStep((prev) => prev + 1);
  };

  const skipVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      carMake: "N/A",
      carModel: "Personal Profile Only",
      carYear: "N/A",
      fuelType: "N/A",
    }));
    setIsSkipped(true);
    setStep(3);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get current Firebase user
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("User not authenticated");
      }

      // Get Firebase token
      const token = await firebaseUser.getIdToken();

      // Update onboarding status in backend
      const response = await fetch(
        `${API_BASE_URL}/users/${firebaseUser.uid}/onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isOnboarded: true,
            phone: `${formData.countryCode}${formData.phone}`,
            vehicle: isSkipped
              ? null
              : {
                  make: formData.carMake,
                  model: formData.carModel,
                  year: formData.carYear,
                  fuelType: formData.fuelType,
                },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          // Try to parse the error response as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || "Failed to update onboarding status.";
        } catch (e) {
          // If it's not JSON, use the raw text or a default message
          errorMessage = errorText || `Request failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      console.log("✓ Onboarding status updated successfully");

      // Force refresh token to get updated custom claims
      const refreshedTokenResult = await firebaseUser.getIdTokenResult(true);
      const updatedClaims = refreshedTokenResult.claims;

      console.log("✓ Token refreshed with updated claims:", updatedClaims);

      // Update Redux store with correct onboarded status and user data
      const updatedUserData = {
        ...user,
        phone: `${formData.countryCode}${formData.phone}`,
        isOnboarded: updatedClaims.isOnboarded || true,
        vehicle: isSkipped
          ? null
          : {
              make: formData.carMake,
              model: formData.carModel,
              year: formData.carYear,
              fuelType: formData.fuelType,
            },
      };

      dispatch(updateUser(updatedUserData));
      dispatch(completeOnboarding());
      navigate("/cart");
    } catch (error) {
      console.error("Error updating onboarding:", error);
      alert("Failed to save onboarding. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <SEO
        title="Account Setup | Xpress Auto"
        description="Finish setting up your account for the best automotive experience."
      />

      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
              PHASE {step} OF 3
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-none">
              Account Set-up
            </h1>
            <p className="mt-4 text-gray-500 font-bold uppercase tracking-tight text-xs max-w-md">
              Tailoring your online garage for the best experience and
              compatibility.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-black uppercase tracking-widest text-[10px] transition-colors"
          >
            <LogOut size={14} /> Exit Session
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1 mb-12 flex">
          <div
            className="bg-black h-full transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-l-4 border-black pl-4">
                <div className="bg-black text-white p-3 rounded-none italic">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">
                    Identity Verification
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Connect your mobile for instant access
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Secure Direct Line
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative w-32 shrink-0 border-2 border-black bg-white hover:bg-yellow-50 transition-colors">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="w-full p-4 font-black outline-none cursor-pointer bg-transparent"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code} ({country.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="50 000 0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-2 border-black p-4 pl-12 focus:bg-yellow-50 transition-colors font-bold outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full flex items-center justify-between bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all group"
              >
                Vehicle Profiling{" "}
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-l-4 border-black pl-4">
                <div className="bg-black text-white p-3 rounded-none italic">
                  <Car size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">
                    Vehicle Profiling
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Optimize compatibility filters
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    name="carMake"
                    placeholder="e.g. Mercedes-Benz"
                    value={formData.carMake}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black p-4 focus:bg-yellow-50 transition-colors font-bold outline-none"
                    required={!isSkipped}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Model Specification
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    placeholder="e.g. AMG GT"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className="w-full border-2 border-black p-4 focus:bg-yellow-50 transition-colors font-bold outline-none"
                    required={!isSkipped}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Year of Engineering
                  </label>
                  <div className="relative border-2 border-black bg-white hover:bg-yellow-50 transition-colors">
                    <select
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleInputChange}
                      className="w-full p-4 font-black outline-none cursor-pointer bg-transparent"
                      required={!isSkipped}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Propulsion System
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleFuelTypeToggle(type)}
                        className={`px-4 py-3 border-2 font-black uppercase text-[10px] tracking-widest transition-all ${
                          formData.fuelType === type
                            ? "bg-black text-white border-black shadow-[4px_4px_0px_#EAB308]"
                            : "bg-white text-black border-gray-200 hover:border-black"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 border border-dashed border-gray-300 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  No vehicle to profile yet?
                </p>
                <button
                  type="button"
                  onClick={skipVehicle}
                  className="flex items-center gap-2 mx-auto text-black font-black uppercase tracking-tighter italic border-b-2 border-black hover:text-yellow-500 hover:border-yellow-500 transition-all text-xs"
                >
                  <FastForward size={14} /> Skip this phase for now
                </button>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-black p-6 font-black uppercase tracking-widest italic hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} /> Revert
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-between group shadow-[8px_8px_0px_rgba(0,0,0,0.1)]"
                >
                  Validate & Review{" "}
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="inline-block bg-yellow-400 p-8 mb-4 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                <CheckCircle size={64} className="text-black" />
              </div>

              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                Configuration Complete
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-tight text-xs max-w-sm mx-auto">
                Account settings saved. You can now access the full Xpress
                AutoZone catalog.
              </p>

              <div className="bg-gray-50 p-8 border-2 border-black text-left space-y-4 my-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[8px] font-black uppercase italic">
                  Saved
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Name
                  </span>
                  <span className="text-sm font-black uppercase tracking-tight">
                    {user?.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Phone
                  </span>
                  <span className="text-sm font-black uppercase tracking-tight">
                    {formData.countryCode} {formData.phone}
                  </span>
                </div>
                {isSkipped ? (
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Garage Status
                    </span>
                    <span className="text-sm font-black uppercase tracking-tight text-yellow-600">
                      Standby / Pending
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">
                        Machine
                      </span>
                      <span className="text-sm font-black uppercase tracking-tight">
                        {formData.carYear} {formData.carMake}{" "}
                        {formData.carModel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase">
                        Fuel Type
                      </span>
                      <span className="text-sm font-black uppercase tracking-tight">
                        {formData.fuelType}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-black p-6 font-black uppercase tracking-widest italic hover:bg-gray-100 transition-all font-black"
                >
                  Adjust Settings
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-black text-white p-6 font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all shadow-[12px_12px_0px_#EAB308] active:translate-y-2 active:shadow-none"
                >
                  Proceed to Dashboard
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
