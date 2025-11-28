import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-700 text-gray-100 mt-13 w-full">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12 md:py-16">
        {/* Company Info - Full Width */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4">Xpress AutoZone</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
            Your trusted source for premium verified auto parts. Quality,
            authenticity, and customer satisfaction guaranteed.
          </p>
        </div>

        {/* Quick Links and Contact Info - Side by Side */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Shop Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="pr-4 md:pr-3">
            <h4 className="text-lg font-semibold text-white mb-3">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-1">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.2" />
                <span className="text-gray-400 text-sm">Accra, Ghana</span>
              </li>
              <li className="flex gap-1">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a
                  href="tel:+233209021991"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  +233 20 902 1991
                </a>
              </li>
              <li className="flex gap-1">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a
                  href="mailto:xpressautozone@gmail.com"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  XpressAutozone
                </a>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/xpressautozone?igsh=MWZwY3BodzdzcG5maQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Xpress AutoZone. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>

          {/* Powered By */}
          <div className="text-center mt-5 pt-5 border-t border-gray-600">
            <p className="text-gray-400 text-sm">
              Powered by{" "}
              <a
                href="https://bookflywheel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                Flywheel Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
