import React, { useState, useRef } from "react";
import { 
  Users, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  ChevronDown, 
  Send,
  Building2,
  ArrowRight
} from "lucide-react";

import hero from "../../assets/cargo.jpg";

export default function PartnerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  // Helper to scroll and open form
  const scrollToForm = () => {
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="bg-white min-h-screen pt-12">
      
      {/* 1. BUSINESS HERO */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center  overflow-hidden">
        {/* Fixed Background Image Formatting */}
        <img src={hero} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-3 relative z-10">
          <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block italic">
            Revolutionizing Auto Commerce
          </span>
          <span className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.85] text-white mb-15">Join Us </span>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl font-medium border-l-2 border-yellow-500 pl-6  pt-3 leading-relaxed">
            Xpress AutoZone is Ghana's premier platform for verified aftermarket components. 
            We provide the digital infrastructure to connect high-quality suppliers 
            with a growing market of discerning vehicle owners.
          </p>
        </div>
      </section>

      {/* 2. ABOUT THE PLATFORM */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Professional Standards</h2>
              <p className="text-gray-800 leading-relaxed text-md">
                The aftermarket parts industry in Ghana faces challenges with transparency 
                and quality consistency. Xpress AutoZone solves this through a rigorous 
                admin-review process. Every part listed is vetted for condition and 
                authenticity, ensuring that our partners can sell with authority.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-1">
                  <h4 className="text-4xl font-black italic uppercase text-black">Vetted</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-yellow-600">Supply Chain Control</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-4xl font-black italic uppercase text-black">Scalable</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-yellow-600">Digital Infrastructure</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               <div className="border-l-4 border-yellow-500 bg-gray-50 p-10 hover:bg-white hover:border-black transition-all group">
                  <ShieldCheck className="mb-4 text-black group-hover:text-yellow-600" size={28} />
                  <h3 className="font-black uppercase tracking-tight text-sm">Quality Verification</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-2">Stringent admin oversight for every SKU.</p>
               </div>
               <div className="border-l-4 border-yellow-500 bg-gray-50 p-10 hover:bg-white hover:border-black transition-all group">
                  <Truck className="mb-4 text-black group-hover:text-yellow-600" size={28} />
                  <h3 className="font-black uppercase tracking-tight text-sm">Logistics Support</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-2">End-to-end fulfillment for high-volume dealers.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PARTNERSHIP TRACKS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Partner Categories</h2>
            <div className="h-1.5 w-24 bg-yellow-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dealer Track */}
            <div className="bg-white border-2 border-transparent p-12 hover:border-yellow-500 transition-all group">
              <Building2 size={40} className="mb-8 text-black group-hover:text-yellow-600" />
              <h3 className="text-2xl font-black uppercase italic mb-6">Inventory Partners</h3>
              <ul className="space-y-4 mb-12">
                {['Verified Storefront Listing', 'Access to National Demand Data', 'Automated Stock Management', 'Bulk Logistics Handling'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
                    <div className="w-2 h-0.5 bg-yellow-500" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={scrollToForm} className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-2">
                Apply for Dealership <ArrowRight size={14} />
              </button>
            </div>

            {/* Mechanic Track */}
            <div className="bg-white border-2 border-transparent p-12 hover:border-yellow-500 transition-all group">
              <Wrench size={40} className="mb-8 text-black group-hover:text-yellow-600" />
              <h3 className="text-2xl font-black uppercase italic mb-6">Service Partners</h3>
              <ul className="space-y-4 mb-12">
                {['Certified Installer Program', 'Preferred Parts Referral', 'Technical Tooling Access', 'Verified Lead Generation'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
                    <div className="w-2 h-0.5 bg-yellow-500" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={scrollToForm} className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-2">
                Apply for Certification <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPLICATION FORM ACCORDION */}
      <section ref={formRef} className="max-w-4xl mx-auto px-6 py-24">
        <div className="border-4 border-black">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between p-10 bg-black text-white group"
          >
            <span className="text-2xl font-black uppercase italic tracking-widest group-hover:text-yellow-500 transition-colors">Connect with our team</span>
            <ChevronDown className={`transition-transform duration-500 ${isFormOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ${isFormOpen ? 'max-h-[1500px]' : 'max-h-0'}`}>
            <form className="p-10 space-y-8 bg-white" action="mailto:partnerships@xpressautozone.com" method="post" encType="text/plain">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Full Name" placeholder="Contact Person" name="name" />
                <InputGroup label="Business Name" placeholder="Registered Entity" name="business" />
                <InputGroup label="Email" placeholder="business@example.com" type="email" name="email" />
                <InputGroup label="Phone" placeholder="024 000 0000" name="phone" />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nature of Partnership</label>
                <select name="type" className="w-full border-b-2 border-gray-200 p-4 outline-none focus:border-yellow-500 transition-colors font-black uppercase text-xs appearance-none bg-gray-50">
                  <option>Spare Part Dealer</option>
                  <option>Certified Mechanic</option>
                  <option>Logistics/Delivery Partner</option>
                  <option>Corporate Fleet Services</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Business Summary</label>
                <textarea 
                  name="summary"
                  placeholder="Describe your current operations and goals..."
                  rows="4"
                  className="w-full border border-gray-100 p-4 outline-none focus:border-yellow-500 transition-colors font-bold uppercase text-xs leading-relaxed"
                />
              </div>

              <button type="submit" className="w-full bg-yellow-500 text-black py-6 font-black uppercase italic tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all">
                Submit Inquiry <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const InputGroup = ({ label, placeholder, type = "text", name }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
    <input 
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full border-b-2 border-gray-200 p-4 outline-none focus:border-yellow-500 transition-colors font-black uppercase text-xs bg-gray-50"
    />
  </div>
);