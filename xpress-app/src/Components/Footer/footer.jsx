import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, ArrowUpRight, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white w-full border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        
        {/* TOP SECTION: LOGO & LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 mb-16">
          
          {/* Brand Block */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-xl font-bold uppercase italic tracking-tighter">
              Xpress <span className="text-yellow-500">AutoZone</span>
            </h3>
            <div className="space-y-3">
              <p className="text-white text-[11px] font-bold uppercase italic tracking-tight leading-tight max-w-sm">
                Ghana’s Trusted Aftermarket Pit Stop <br /> 
                <span className="text-yellow-500">for Quality Parts & Accessories</span>
              </p>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest italic border-l-2 border-yellow-500 pl-3">
                Ghana Drives on Xpress — And So Do You!
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-yellow-500 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest italic">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="hover:text-yellow-500 transition-colors">Categories</Link></li>
              <li><Link to="/xplore" className="hover:text-yellow-500 transition-colors">Xplore Inventory</Link></li>
              <li><Link to="/feedback" className="hover:text-yellow-500 transition-colors">Give Feedback</Link></li>
            </ul>
          </div>

          {/* Make Money With Us */}
          <div className="col-span-1">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-yellow-500 mb-6">
              Pros
            </h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest italic">
              <li><Link to="/partner" className="hover:text-yellow-500 transition-colors">Sell</Link></li>
              <li><Link to="/partner" className="hover:text-yellow-500 transition-colors">Affiliate</Link></li>
              <li><Link to="/partner" className="hover:text-yellow-500 transition-colors">Supply</Link></li>
              <li><Link to="/partner" className="hover:text-yellow-500 transition-colors">Deliver</Link></li>
            </ul>
          </div>

          {/* Contact Block */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-yellow-500 mb-6">
              Inquiries
            </h4>
            <ul className="space-y-4 text-[10px] font-medium uppercase tracking-tight text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-white shrink-0" />
                <a href="tel:+233271665737" className="hover:text-white transition-colors">+233 27 166 5737</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-white shrink-0" />
                <a href="mailto:xpressautozone@gmail.com" className="hover:text-white transition-colors">xpressautozone@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* FEEDBACK TAB BAR */}
        <div className="bg-yellow-500 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer" onClick={() => navigate("/feedback")}>
          <div>
            <h3 className="text-black text-xl font-black uppercase italic tracking-tighter">We’d love to hear what you think!</h3>
            <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] italic">Help us build the future of Ghana's aftermarket</p>
          </div>
          <button className="bg-black text-white px-10 py-4 text-xs font-black uppercase italic tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
            Give Feedback <ArrowRight size={16} />
          </button>
        </div>

        {/* BOTTOM SECTION: LEGAL & POWERED BY */}
        <div className="border-t border-gray-900 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                &copy; {currentYear} Xpress AutoZone. Developed for performance.
              </p>
              <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest">
                <button onClick={() => navigate("/privacy-policy")} className="hover:text-white transition-colors">Privacy</button>
                <button onClick={() => navigate("/terms-of-service")} className="hover:text-white transition-colors">Terms</button>
                <button className="hover:text-white transition-colors">Cookies</button>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Digital Infrastructure by</span>
              <a
                href="https://bookflywheel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-black uppercase italic hover:text-yellow-500 transition-colors group"
              >
                Flywheel Technologies
                <ArrowUpRight size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;