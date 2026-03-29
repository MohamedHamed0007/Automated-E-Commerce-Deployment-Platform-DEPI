import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Building2,
  ExternalLink,
  Info,
  SendHorizontal,
} from "lucide-react";
import FooterContact from "../../components/FooterContact/FooterContact";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "Shipping Rates Comparison",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Please enter a valid email");
      return;
    }

    console.log("Form Submitted:", formData);

    setFormData({
      fullName: "",
      email: "",
      subject: "Shipping Rates Comparison",
      message: "",
    });
  };

  return (
    <>
     <div className="min-h-screen 
                bg-gray-100 dark:bg-slate-900 
                flex items-center justify-center p-6 transition-colors mt-5">

  <div className="bg-white dark:bg-slate-800 
                  rounded-2xl shadow-xl 
                  w-full max-w-6xl 
                  grid grid-cols-1 md:grid-cols-2 
                  overflow-hidden border 
                  border-gray-200 dark:border-slate-700">

    {/* LEFT SIDE - FORM */}
    <div className="p-10">

      <span className="text-sm 
                       bg-blue-100 dark:bg-blue-600/20 
                       text-blue-600 dark:text-blue-400 
                       px-4 py-1 rounded-full font-medium">
        GET IN TOUCH
      </span>

      <h2 className="text-3xl font-semibold mt-4 
                     text-gray-900 dark:text-white">
        Contact US
      </h2>

      <p className="text-gray-500 dark:text-slate-400 
                    mt-2 mb-8">
        We're here to help with your shipping needs 24/7.
        Send us a message and we will respond shortly.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-900
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-slate-500
                       rounded-lg p-3 w-full
                       focus:outline-none
                       focus:ring-2 focus:ring-blue-500/30
                       focus:border-blue-500
                       transition"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="border border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-900
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-slate-500
                       rounded-lg p-3 w-full
                       focus:outline-none
                       focus:ring-2 focus:ring-blue-500/30
                       focus:border-blue-500
                       transition"
          />
        </div>

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-900
                     text-gray-900 dark:text-white
                     rounded-lg p-3 w-full
                     focus:outline-none
                     focus:ring-2 focus:ring-blue-500/30
                     focus:border-blue-500
                     transition"
        >
          <option>Shipping Rates Comparison</option>
          <option>Tracking Shipment</option>
          <option>Business Inquiry</option>
        </select>

        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you today?"
          required
          className="border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-900
                     text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-slate-500
                     rounded-lg p-3 w-full resize-none
                     focus:outline-none
                     focus:ring-2 focus:ring-blue-500/30
                     focus:border-blue-500
                     transition"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700
                     text-white px-6 py-3
                     rounded-lg shadow-md
                     transition flex items-center gap-3"
        >
          Send Message <SendHorizontal size={16} />
        </button>
      </form>
    </div>

    {/* RIGHT SIDE - SUPPORT INFO */}
    <div className="bg-blue-50 dark:bg-slate-900/60 p-10
                    border-t md:border-t-0 md:border-l
                    border-gray-200 dark:border-slate-700">

      <div className="flex items-center gap-4 mb-6">
        <Info className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-semibold 
                       text-gray-900 dark:text-white">
          Support Channels
        </h3>
      </div>

      <div className="space-y-6">

        <div className="flex items-start gap-4">
          <Phone className="text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Phone Support
            </h4>
            <p className="text-gray-500 dark:text-slate-400">
              +1 (555) 000-1234
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MessageCircle className="text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Live WhatsApp
            </h4>
            <p className="text-gray-500 dark:text-slate-400">
              +971 50 123 4567
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Email Us
            </h4>
            <p className="text-gray-500 dark:text-slate-400">
              support@shipsphere.com
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white dark:bg-slate-800
                        rounded-lg p-6
                        border border-gray-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <Building2 className="text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Regional Hub - Egypt
              </h4>
              <p className="text-gray-500 dark:text-slate-400 my-3">
                Nile Business Tower, Floor 10 <br />
                Smart Village, Giza, Egypt
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 
                           flex items-center gap-2 hover:underline"
                href="https://maps.app.goo.gl/TUYAcLi1ydvTzTFr9"
              >
                View on Map
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>

      <FooterContact />
    </>
  );
};

export default Contact;