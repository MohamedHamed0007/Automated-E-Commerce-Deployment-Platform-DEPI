import type { FC } from "react";
import { STATS } from "../data";
import type { Stat } from "../../types";

const StatsSection: FC = () => (
  <section  id="impact" className="
    py-14 sm:py-16 lg:py-20
    bg-gradient-to-br
    from-blue-600 to-blue-800
    dark:from-blue-800 dark:to-slate-900
  ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-4
        gap-6 sm:gap-8 lg:gap-10
        text-center
      ">
        {STATS.map((s: Stat) => (
          <div
            key={s.label}
            className="
              py-4 sm:py-6
              rounded-xl
              transition-transform duration-300
              hover:scale-105
            "
          >
            <div className="
              text-3xl sm:text-4xl md:text-5xl
              font-black
              text-white
              mb-2
            ">
              {s.val}
            </div>

            <div className="
              text-blue-200
              text-xs sm:text-sm
              font-medium
              uppercase
              tracking-wider
            ">
              {s.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default StatsSection;
