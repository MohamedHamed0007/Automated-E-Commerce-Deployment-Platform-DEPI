import type { FC } from "react";
// import { useAppDispatch } from "../../redux/hookredux";
// import { navigate } from "../../redux/navigateRedux/navigateSlice";
import { ArrowIcon } from "../icons";
import Button from "../Buttons/Buttons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ExclusiveOffers: FC = () => {
  // const dispatch = useAppDispatch();
const navigate = useNavigate();

const handleProtectedAction = () => {
  toast("Login required first 🚀", { icon: "🔒" });
navigate("/login", { state: { from: "/offers" } });
  
};
  // const handleClick = (page: string) => {
  //   dispatch(navigate(page)); 
  // };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10">
          <div className="mb-4 sm:mb-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
              Limited Time
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
              Exclusive Offers
            </h2>
          </div>
          <button
            className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline hidden sm:block"
            onClick={handleProtectedAction}
          >
            View all offers →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">

          {/* Offer 1 — New Customer */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/30">
            <div className="absolute -right-8 -top-8 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white/5" />
            <div className="absolute -right-4 -bottom-10 w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-white/5" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                New Customer
              </span>
              <h3 className="text-3xl sm:text-4xl font-black mb-2">30% OFF</h3>
              <p className="text-blue-100 text-base sm:text-lg font-semibold mb-1">First Shipment</p>
              <p className="text-blue-200 text-sm sm:text-base mb-6">
                Apply code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">WELCOME30</span> at checkout.
              </p>
              <Button
                variant="white"
                size="md"
                 onClick={handleProtectedAction}
                className="w-full sm:w-auto"
              >
                Claim Offer <ArrowIcon />
              </Button>
            </div>
          </div>

          {/* Offer 2 — Business */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 text-white shadow-xl border border-slate-700">
            <div className="absolute -right-8 -top-8 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-blue-500/5" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                Business Pro
              </span>
              <h3 className="text-xl sm:text-2xl md:text-2xl font-black mb-2">SME Freight Program</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Register your business to unlock volume discounts up to 15%. Dedicated account manager included.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto"
              >
                Register Now <ArrowIcon />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;