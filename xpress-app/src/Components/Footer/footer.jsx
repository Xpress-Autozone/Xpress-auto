import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white w-full border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* TOP SECTION: LOGO & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Block */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">
              Xpress <span className="text-yellow-500">AutoZone</span>
            </h3>
            <p className="text-gray-200 text-md font-medium leading-relaxed max-w-sm  tracking-tight">
              Ghana's premier verified aftermarket platform. We bridge the gap 
              between high-performance engineering and the local consumer 
              through uncompromised quality control.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 border border-gray-800 hover:border-yellow-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/xpressautozone" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 border border-gray-800 hover:border-yellow-500 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-8">
              Navigation
            </h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest italic">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="hover:text-yellow-500 transition-colors">Categories</Link></li>
              <li><Link to="/xplore" className="hover:text-yellow-500 transition-colors">Xplore Inventory</Link></li>
              <li><Link to="/partner" className="hover:text-yellow-500 transition-colors">Partner Tracks</Link></li>
            </ul>
          </div>

          {/* Contact Block */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-8">
              Inquiries
            </h4>
            <ul className="space-y-6 text-[11px] font-bold uppercase tracking-tight text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href="tel:+233209021991" className="hover:text-white transition-colors">+233 20 902 1991</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a href="mailto:xpressautozone@gmail.com" className="hover:text-white transition-colors">xpressautozone@gmail.com</a>
              </li>
            </ul>
          </div>
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