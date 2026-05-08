import type { NavLink, Step, Stat, Service, FooterColumn } from "../../types/index";

export const NAV_LINKS: NavLink[] = [
  { label: "Home",     id: "home"     },
  { label: "Services", id: "services" },
  { label: "About",    id: "about"    },
  { label: "Contact",  id: "contact"  },
];

export const STEPS: Step[] = [
  { n: "01", emoji: "📦", title: "Enter",   desc: "Input your package details including origin, destination, and dimensions." },
  { n: "02", emoji: "⚖️", title: "Compare", desc: "Instantly see prices and delivery times from all major global carriers."   },
  { n: "03", emoji: "✅", title: "Choose",  desc: "Pick the best carrier based on price, speed, or carrier reputation."       },
  { n: "04", emoji: "📡", title: "Track",   desc: "Monitor your shipment in real-time until it safely arrives."               },
];

export const STATS: Stat[] = [
  { val: "50+",  label: "Global Carriers"   },
  { val: "30%",  label: "Average Savings"   },
  { val: "120+", label: "Countries Covered" },
  { val: "2M+",  label: "Shipments Tracked" },
];

export const SERVICES: Service[] = [
  { emoji: "🌐", title: "E-commerce Integration", desc: "Seamlessly connect your store. Supports Shopify, WooCommerce, Magento and more." },
  { emoji: "✈️", title: "International Freight",  desc: "Ship to 120+ countries with competitive rates. Full customs docs included."       },
  { emoji: "🛃", title: "Customs Clearance",      desc: "Our expert team handles all customs paperwork ensuring shipments clear borders."   },
  { emoji: "🏭", title: "Warehouse Management",   desc: "Real-time inventory tracking, pick-and-pack, and same-day dispatch."              },
  { emoji: "📡", title: "Live Tracking",          desc: "End-to-end visibility across all carriers. Get proactive alerts every step."      },
  { emoji: "💼", title: "SME Freight Program",    desc: "Volume discounts up to 15% for businesses. Dedicated account manager included."   },
];

export const PARTNERS: string[] = ["DHL", "FedEx", "Aramex", "Maersk", "Emirates"];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Solutions", items: ["E-commerce Integration", "International Freight", "Customs Clearance", "Warehouse Management"] },
  { title: "Company",   items: ["About Us", "Careers", "Press & Media", "Privacy Policy"]                                       },
  { title: "Support",   items: ["Help Center", "Carrier Status", "Contact Us", "Refund Policy"]                                 },
];
