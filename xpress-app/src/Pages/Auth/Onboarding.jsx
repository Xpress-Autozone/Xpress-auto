import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeOnboarding, updateUser, signOut } from "../../Redux/userSlice";
import { useCart } from "../../Context/CartContext";
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
  Info,
  Edit,
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
  const { cartItems } = useCart();
  const auth = getAuth(app);
  const [step, setStep] = useState(1);
  const [isSkipped, setIsSkipped] = useState(false);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [phoneError, setPhoneError] = useState("");

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
    
    // Phone validation
    if (name === "phone") {
      const phoneRegex = /^[0-9\s]*$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Please enter only numbers");
      } else if (value.replace(/\s/g, "").length < 8) {
        setPhoneError("Phone number must be at least 8 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleFuelTypeToggle = (type) => {
    setFormData((prev) => ({ ...prev, fuelType: type }));
  };

  const goToStep = (targetStep) => {
    if (targetStep < step || (targetStep > step && canProceedToStep(targetStep))) {
      setStep(targetStep);
    }
  };

  const canProceedToStep = (targetStep) => {
    if (targetStep === 2) {
      return formData.phone.replace(/\s/g, "").length >= 8;
    }
    if (targetStep === 3) {
      return isSkipped || (formData.carMake && formData.carModel);
    }
    return true;
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

      if (cartItems && cartItems.length > 0) {
        navigate("/cart");
      } else {
        navigate("/");
      }
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
            <span className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
              Phase {step} of 3
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Account Set-up
            </h1>
            <p className="mt-4 text-gray-500 font-semibold tracking-tight text-sm max-w-md">
              Tailoring your online garage for the best experience and
              compatibility.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-bold tracking-widest text-[10px] transition-colors"
          >
            <LogOut size={14} /> Exit session
          </button>
        </div>

        {/* Progress Bar with Clickable Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => goToStep(s)}
                disabled={!canProceedToStep(s) && s > step}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  step === s
                    ? "bg-gray-900 text-white"
                    : step > s
                    ? "bg-yellow-100 text-yellow-700 cursor-pointer hover:bg-yellow-200"
                    : canProceedToStep(s)
                    ? "bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="font-bold text-xs">Phase {s}</span>
                {step > s && <CheckCircle className="w-3 h-3" />}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gray-900 h-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-10 border-l-4 border-yellow-500 pl-6">
                <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg shadow-black/10">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tight text-gray-900">
                    Identity Verification
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest">
                    Connect your mobile for instant access
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                    Secure Direct Line
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowVehicleInfo(!showVehicleInfo)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                  {showVehicleInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[10px] text-blue-800 animate-in fade-in slide-in-from-top-2">
                      <p className="font-semibold mb-1">Why we need this:</p>
                      <p>Your phone number enables order updates, delivery coordination, and account recovery. We never share it with third parties.</p>
                    </div>
                  )}
                <div className="flex gap-2 items-center">
                  <div className="relative w-32 shrink-0 border-2 border-gray-900 bg-white hover:bg-yellow-50 transition-colors">
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
                      className={`w-full border-2 p-4 pl-12 focus:bg-yellow-50 transition-colors font-bold outline-none ${
                        phoneError ? "border-red-500 focus:bg-red-50" : "border-gray-900"
                      }`}
                      required
                    />
                    {phoneError && (
                      <p className="text-red-500 text-[10px] mt-1 animate-in fade-in slide-in-from-top-1">
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full flex items-center justify-between bg-gray-900 text-white py-4 px-6 font-bold tracking-widest italic hover:bg-yellow-500 hover:text-gray-900 transition-all group rounded-lg shadow-md hover:shadow-lg"
              >
                Vehicle profiling{" "}
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-10 border-l-4 border-yellow-500 pl-6">
                <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg shadow-black/10">
                  <Car size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black italic tracking-tight text-gray-900">
                    Vehicle Profiling
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest">
                    Optimize compatibility filters
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVehicleInfo(!showVehicleInfo)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              {showVehicleInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[10px] text-blue-800 mb-6 animate-in fade-in slide-in-from-top-2">
                  <p className="font-semibold mb-1">Why we need this:</p>
                  <p>Vehicle details help us show compatible parts and accessories for your specific make and model. Skip if you don't have a vehicle yet.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
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
                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
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
                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                    Year of Engineering
                  </label>
                  <div className="relative border-2 border-gray-900 bg-white hover:bg-yellow-50 transition-colors">
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
                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                    Propulsion System
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleFuelTypeToggle(type)}
                        className={`px-4 py-3 border font-bold text-[10px] tracking-widest transition-all rounded-md ${
                          formData.fuelType === type
                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 border border-dashed border-gray-300 text-center rounded-lg">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">
                  No vehicle to profile yet?
                </p>
                <p className="text-[10px] text-gray-500 mb-4">
                  You can add vehicle details later in your account settings.
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
                  className="flex-1 border border-gray-200 bg-white p-4 font-bold tracking-widest italic hover:bg-gray-50 transition-all flex items-center justify-center gap-2 rounded-lg"
                >
                  <ArrowLeft size={18} /> Revert
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] bg-gray-900 text-white p-4 font-bold tracking-widest italic hover:bg-yellow-500 hover:text-gray-900 transition-all flex items-center justify-between group shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg"
                >
                  Validate & Review{" "}
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-block bg-yellow-400 p-8 mb-4 rounded-2xl shadow-xl shadow-yellow-500/20">
                <CheckCircle size={64} className="text-gray-900" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-gray-900">
                Configuration complete
              </h2>
              <p className="text-gray-500 font-semibold tracking-tight text-sm max-w-sm mx-auto">
                Account settings saved. You can now access the full Xpress
                AutoZone catalog.
              </p>

              <div className="bg-gray-50 p-8 border border-gray-200 text-left space-y-4 my-8 relative overflow-hidden rounded-xl">
                <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-3 py-1 text-[8px] font-bold uppercase italic rounded-bl-lg">
                  Saved
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-[10px] font-bold text-gray-400">
                    Name
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-gray-900">
                      {user?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-yellow-600 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-[10px] font-bold text-gray-400">
                    Phone
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-gray-900">
                      {formData.countryCode} {formData.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-yellow-600 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {isSkipped ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400">
                      Garage Status
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-tight text-yellow-600">
                        Standby / Pending
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-gray-400 hover:text-yellow-600 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-bold text-gray-400">
                        Machine
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-gray-900">
                          {formData.carYear} {formData.carMake}{" "}
                          {formData.carModel}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-gray-400 hover:text-yellow-600 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400">
                        Fuel Type
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-gray-900">
                          {formData.fuelType}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-gray-400 hover:text-yellow-600 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border border-gray-200 bg-white p-4 font-bold tracking-widest italic hover:bg-gray-50 transition-all rounded-lg"
                >
                  Adjust settings
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-gray-900 text-white p-4 font-bold tracking-widest italic hover:bg-yellow-500 hover:text-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 rounded-lg"
                >
                  Proceed to dashboard
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
