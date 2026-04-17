import React from "react";
import { MessageSquare, Send, Mail, ArrowRight } from "lucide-react";

const FeedbackPage = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block italic">
            Customer Voice
          </span>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-[0.85] text-black mb-6 uppercase">
            We’d love to <br />
            <span className="text-gray-400 text-xl md:text-2xl">hear what you think!</span>
          </h1>
          <div className="h-1.5 w-24 bg-yellow-500" />
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gray-100 p-6 hover:border-black transition-all group">
            <MessageSquare className="mb-4 text-black group-hover:text-yellow-500 transition-colors" size={24} />
            <h3 className="text-lg font-black uppercase italic mb-3">Product Feedback</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">
              Experience issues with a specific part? Or have ideas on how we can improve our verification process?
            </p>
            <a 
              href="mailto:xpressautozone@gmail.com?subject=Product Feedback"
              className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic group-hover:text-yellow-600 transition-colors"
            >
              Share Thoughts <ArrowRight size={12} />
            </a>
          </div>

          <div className="border border-gray-100 p-6 hover:border-black transition-all group">
            <Send className="mb-4 text-black group-hover:text-yellow-500 transition-colors" size={24} />
            <h3 className="text-lg font-black uppercase italic mb-3">General Inquiry</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">
              Want to suggest a new feature or just say hello? We're always open to hearing from our community.
            </p>
            <a 
              href="mailto:xpressautozone@gmail.com?subject=General Inquiry"
              className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic group-hover:text-yellow-600 transition-colors"
            >
              Contact Team <ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Direct Mail Section */}
        <div className="bg-black text-white p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tight mb-2">Direct Mail</h2>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Speak directly with management</p>
          </div>
          <a 
            href="mailto:xpressautozone@gmail.com" 
            className="flex items-center gap-4 bg-yellow-500 text-black px-8 py-4 font-black uppercase italic tracking-widest text-[10px] hover:bg-white transition-all transform hover:scale-105"
          >
            <Mail size={16} /> Give Feedback
          </a>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed max-w-lg mx-auto italic">
          Your feedback helps us maintain the highest standards of automotive excellence in Ghana. 
          We review every message and aim to respond within 24-48 business hours.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;
