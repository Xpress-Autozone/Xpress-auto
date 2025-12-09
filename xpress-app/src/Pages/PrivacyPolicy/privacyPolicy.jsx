import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 mb-8 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last Updated: 9th December 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may collect personal information that you voluntarily provide to us when you use our Website. This information may include but is not limited to, your name, email address, phone number, and any other information you choose to provide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We may also automatically collect certain information when you visit our Website, including your IP address, device type, operating system, browser type, and usage information.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use the information we collect from you to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>Provide, maintain, and improve our Website</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Communicate with you about our products, services, and promotions</li>
              <li>Personalize your experience and tailor content to your interests</li>
              <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Disclose Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with third parties in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>With your consent</li>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations or protect our rights</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, please be aware that no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security of your information.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Website is not intended for children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Changes to Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or change this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised Privacy Policy. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:xpressautozone@gmail.com"
                className="text-yellow-500 hover:text-yellow-600 font-medium"
              >
                xpressautozone@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
