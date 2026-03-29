import type { FC } from "react";
import { PARTNERS } from "../data";

const Partners: FC = () => (
  <section id="partners" className="
    py-12 sm:py-14 lg:py-16
    bg-white dark:bg-slate-900
    border-y border-slate-100 dark:border-slate-800
    transition-colors
  ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <p className="
        text-center
        text-[10px] sm:text-xs
        font-bold uppercase tracking-widest
        text-slate-400 dark:text-slate-500
        mb-8 sm:mb-10
      ">
        Our Trusted Logistics Partners
      </p>

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-6 sm:gap-8 lg:gap-12
        items-center
      ">
        {PARTNERS.map((name: string) => (
          <div
            key={name}
            className="
              text-center
              text-base sm:text-lg md:text-xl lg:text-2xl
              font-black
              text-slate-300 dark:text-slate-600
              hover:text-blue-500 dark:hover:text-blue-400
              transition-all duration-300
              cursor-pointer
              tracking-wide
              hover:scale-105
            "
          >
            {name}
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default Partners;
