import React, { useState } from "react";
import { Search, Book, MessageCircle, Phone, Mail, Send } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input/Input";
import { Textarea } from "../../components/Textarea/Textarea";
import { Breadcrumb } from "../../components/Breadcrumb";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create my first shipment?",
        a: 'Click on "New Shipment" in the sidebar, fill in package details and addresses, then compare prices from different couriers.',
      },
      {
        q: "How does price comparison work?",
        a: "We gather real-time rates from all major courier companies and present them side-by-side so you can choose the best option.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept wallet balance, credit/debit cards, and digital payment methods.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all payments are encrypted and we never store your full card details.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by courier and service level, typically ranging from 2-7 business days.",
      },
      {
        q: "Can I track my shipment?",
        a: "Yes, you can track all shipments in real-time through our tracking page.",
      },
    ],
  },
];

const chatMessages = [
  {
    id: 1,
    sender: "support",
    text: "Hello! How can I help you today?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "I need help with tracking my shipment",
    time: "10:31 AM",
  },
  {
    id: 3,
    sender: "support",
    text: "I'd be happy to help! Could you provide your tracking number?",
    time: "10:31 AM",
  },
];

export default function Help() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="container mx-auto  space-y-6 bg-slate-820  text-white">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "Help Center" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white ">Help Center</h1>
        <p className="text-slate-400 mt-1">Find answers and get support</p>
      </div>

      {/* Search */}
      <Card
        className="bg-white dark:bg-slate-900 
             border border-gray-200 dark:border-slate-700 
             shadow-sm"
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 
                 w-5 h-5 
                 text-gray-400 dark:text-slate-400"
          />

          <input
            type="text"
            placeholder="Search for help articles..."
            className="w-full pl-12 pr-4 py-3 
                 bg-white dark:bg-slate-900
                 border border-gray-200 dark:border-slate-700
                 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-slate-500
                 rounded-lg
                 focus:outline-none
                 focus:ring-2 focus:ring-blue-500/30
                 focus:border-blue-500
                 transition-colors duration-200"
          />
        </div>
      </Card>

      {/* Quick Actions */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  {/* Live Chat */}
  <Card 
    className="cursor-pointer 
               bg-white dark:bg-slate-900
               border border-gray-200 dark:border-slate-700
               hover:shadow-md
               hover:-translate-y-1
               transition-all duration-300"
  >
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-blue-600/10 dark:bg-blue-600/20 
                      rounded-full flex items-center justify-center 
                      mx-auto mb-4">
        <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-500" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        Live Chat
      </h3>

      <p className="text-sm text-gray-500 dark:text-slate-400">
        Chat with our support team
      </p>
    </div>
  </Card>

  {/* Call Us */}
  <Card
    className="cursor-pointer 
               bg-white dark:bg-slate-900
               border border-gray-200 dark:border-slate-700
               hover:shadow-md
               hover:-translate-y-1
               transition-all duration-300"
  >
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-600/10 dark:bg-green-600/20 
                      rounded-full flex items-center justify-center 
                      mx-auto mb-4">
        <Phone className="w-8 h-8 text-green-600 dark:text-green-500" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        Call Us
      </h3>

      <p className="text-sm text-gray-500 dark:text-slate-400">
        1-800-SHIP-FAST
      </p>
    </div>
  </Card>

  {/* Email Support */}
  <Card
    className="cursor-pointer 
               bg-white dark:bg-slate-900
               border border-gray-200 dark:border-slate-700
               hover:shadow-md
               hover:-translate-y-1
               transition-all duration-300"
  >
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-purple-600/10 dark:bg-purple-600/20 
                      rounded-full flex items-center justify-center 
                      mx-auto mb-4">
        <Mail className="w-8 h-8 text-purple-600 dark:text-purple-500" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        Email Support
      </h3>

      <p className="text-sm text-gray-500 dark:text-slate-400">
        support@shipfast.com
      </p>
    </div>
  </Card>

</div>

      {/* FAQs */}
      <Card
  className="bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-700
             shadow-sm"
>
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div
      className="w-10 h-10 
                 bg-blue-600/10 dark:bg-blue-600/20
                 rounded-lg flex items-center justify-center"
    >
      <Book className="w-5 h-5 text-blue-600 dark:text-blue-500" />
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h3>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Quick answers to common questions
      </p>
    </div>
  </div>

  {/* FAQ Content */}
  <div className="space-y-6">
    {faqs.map((category, catIndex) => (
      <div key={catIndex}>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          {category.category}
        </h4>

        <div className="space-y-3">
          {category.items.map((faq, faqIndex) => {
            const key = catIndex * 100 + faqIndex;

            return (
              <div
                key={key}
                className="border border-gray-200 dark:border-slate-700
                           rounded-lg overflow-hidden
                           bg-gray-50 dark:bg-slate-800
                           transition-colors"
              >
                <button
                  onClick={() =>
                    setSelectedFaq(selectedFaq === key ? null : key)
                  }
                  className="w-full flex items-center justify-between
                             p-4 text-left
                             hover:bg-gray-100 dark:hover:bg-slate-700
                             transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.q}
                  </span>

                  <svg
                    className={`w-5 h-5 text-gray-400 dark:text-slate-400
                                transition-transform duration-200 ${
                                  selectedFaq === key ? "rotate-180" : ""
                                }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {selectedFaq === key && (
                  <div
                    className="px-4 pb-4 text-sm
                               text-gray-600 dark:text-slate-400"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
</Card>

      {/* Contact Form */}
     <Card
  className="bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-700
             shadow-sm"
>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
    Still Need Help?
  </h3>

  <div className="space-y-4">
    
    <Input
      label="Subject"
      className="bg-white dark:bg-slate-900
                 border-gray-300 dark:border-slate-700
                 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-slate-500
                 focus:ring-2 focus:ring-blue-500/30
                 focus:border-blue-500
                 transition-colors duration-200"
    />

    <Textarea
      label="Message"
      rows={5}
      className="bg-white dark:bg-slate-900
                 border-gray-300 dark:border-slate-700
                 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-slate-500
                 focus:ring-2 focus:ring-blue-500/30
                 focus:border-blue-500
                 transition-colors duration-200"
    />

    <Button
      className="w-full flex items-center justify-center gap-2
                 bg-blue-600 hover:bg-blue-700
                 text-white
                 transition-colors duration-200"
    >
      <Send className="w-4 h-4" />
      Submit Ticket
    </Button>

  </div>
</Card>
      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <p className="font-semibold">Live Support</p>
            <button
              onClick={() => setShowChat(false)}
              className="hover:bg-white/10 p-1 rounded"
            >
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 bg-slate-900 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 text-slate-400">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
