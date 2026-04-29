import React from "react";
import SEO from "../../lib/SEOHelper";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <SEO 
        title="Cookie Policy | Xpress AutoZone" 
        description="Learn about how Xpress AutoZone uses cookies to improve your browsing experience."
      />
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-yellow-600 transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        
        <div className="mb-12 border-b-2 border-black pb-6 flex items-center gap-4">
          <Cookie size={40} className="text-yellow-500" />
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-gray-900">
              Cookie Policy
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">
              Last Updated: April 2026
            </p>
          </div>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:italic prose-a:text-yellow-600 hover:prose-a:text-black">
          <section className="mb-10">
            <h2 className="text-2xl">1. Introduction</h2>
            <p className="text-gray-600 font-medium">
              This Cookie Policy explains how Xpress AutoZone ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl">2. What are cookies?</h2>
            <p className="text-gray-600 font-medium">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl">3. Why do we use cookies?</h2>
            <p className="text-gray-600 font-medium">
              We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our properties.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600 font-medium">
              <li><strong>Essential Cookies:</strong> Strictly necessary for providing you with services available through our website.</li>
              <li><strong>Performance and Functionality Cookies:</strong> Used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like video) may become unavailable.</li>
              <li><strong>Analytics and Customization Cookies:</strong> Collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl">4. How can I control cookies?</h2>
            <p className="text-gray-600 font-medium">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser controls. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl">5. Updates to this policy</h2>
            <p className="text-gray-600 font-medium">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
