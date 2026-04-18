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

import hero from "../../assets/cargo.webp";

export default function PartnerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = () => {
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="bg-white min-h-screen pt-12">
      
      {/* HERO */}
      <section className="relative h-[40vh] md:h-[45vh] flex items-center overflow-hidden">
        <img src={hero} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Sell on Xpress
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-lg leading-relaxed">
            Join Ghana's growing auto parts marketplace. List your products, 
            reach more customers, and grow your business with us.
          </p>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Why partner with us?</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Whether you're a parts dealer looking to reach more buyers, a supplier 
                wanting to move inventory, or a logistics provider — Xpress gives you 
                the platform and tools to grow. Every partner goes through a review 
                process to maintain quality for our customers.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Verified Partners</h4>
                    <p className="text-xs text-gray-500 mt-1">Every partner is vetted before going live.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Logistics Support</h4>
                    <p className="text-xs text-gray-500 mt-1">Use our delivery network to reach customers.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">How it works</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm text-gray-600">Submit your application below</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm text-gray-600">Our team reviews your business details</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-sm text-gray-600">Get approved and start listing your products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP OPTIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Partnership options</h2>
          <p className="text-sm text-gray-500 text-center mb-10">Choose the option that fits your business.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sell */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all flex flex-col justify-between">
              <div>
                <Building2 size={24} className="mb-4 text-yellow-600" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Sell on Xpress</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  List your auto parts and accessories for customers across Ghana.
                </p>
              </div>
              <button onClick={scrollToForm} className="w-full bg-black text-white py-3 text-xs font-semibold rounded hover:bg-yellow-500 hover:text-black transition-colors">
                Apply Now
              </button>
            </div>

            {/* Affiliate */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all flex flex-col justify-between">
              <div>
                <Users size={24} className="mb-4 text-yellow-600" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Become an Affiliate</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Refer customers and earn a commission on every sale you drive.
                </p>
              </div>
              <button onClick={scrollToForm} className="w-full bg-black text-white py-3 text-xs font-semibold rounded hover:bg-yellow-500 hover:text-black transition-colors">
                Join Program
              </button>
            </div>

            {/* Supply */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all flex flex-col justify-between">
              <div>
                <ShieldCheck size={24} className="mb-4 text-yellow-600" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Supply to Xpress</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Provide bulk inventory for our curated product collections.
                </p>
              </div>
              <button onClick={scrollToForm} className="w-full bg-black text-white py-3 text-xs font-semibold rounded hover:bg-yellow-500 hover:text-black transition-colors">
                Get Started
              </button>
            </div>

            {/* Deliver */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all flex flex-col justify-between">
              <div>
                <Truck size={24} className="mb-4 text-yellow-600" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">Deliver Packages</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Join our delivery team and help get orders to customers on time.
                </p>
              </div>
              <button onClick={scrollToForm} className="w-full bg-black text-white py-3 text-xs font-semibold rounded hover:bg-yellow-500 hover:text-black transition-colors">
                Start Driving
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section ref={formRef} className="max-w-3xl mx-auto px-6 py-16">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between p-6 bg-black text-white"
          >
            <span className="text-base font-semibold">Get in touch</span>
            <ChevronDown className={`transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-400 ${isFormOpen ? 'max-h-[1200px]' : 'max-h-0'}`}>
            <form className="p-6 md:p-8 space-y-6 bg-white" action="mailto:partnerships@xpressautozone.com" method="post" encType="text/plain">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" placeholder="Your name" name="name" />
                <InputGroup label="Business Name" placeholder="Your business" name="business" />
                <InputGroup label="Email" placeholder="you@example.com" type="email" name="email" />
                <InputGroup label="Phone" placeholder="024 000 0000" name="phone" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Type of Partnership</label>
                <select name="type" className="w-full border border-gray-200 rounded p-3 outline-none focus:border-yellow-500 transition-colors text-sm bg-gray-50">
                  <option>Parts Dealer / Seller</option>
                  <option>Affiliate Partner</option>
                  <option>Bulk Supplier</option>
                  <option>Logistics / Delivery</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Tell us about your business</label>
                <textarea 
                  name="summary"
                  placeholder="What do you sell or offer? How long have you been operating?"
                  rows="4"
                  className="w-full border border-gray-200 rounded p-3 outline-none focus:border-yellow-500 transition-colors text-sm leading-relaxed"
                />
              </div>

              <button type="submit" className="w-full bg-yellow-500 text-black py-4 font-semibold text-sm rounded flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all">
                Submit Application <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const InputGroup = ({ label, placeholder, type = "text", name }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <input 
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded p-3 outline-none focus:border-yellow-500 transition-colors text-sm bg-gray-50"
    />
  </div>
);