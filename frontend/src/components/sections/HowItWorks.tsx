import type { FC } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { STEPS } from "../data";
import type { Step } from "../../types";

// Single step card
const StepCard: FC<Step> = ({ n, emoji, title, desc }) => (
  <Card className="relative p-5 sm:p-6 lg:p-7 cursor-default group hover:shadow-lg transition-all duration-300">
    
    {/* Step number — background decoration */}
    <div className="absolute top-4 right-4 text-2xl sm:text-3xl font-black 
      text-slate-100 dark:text-slate-800 
      group-hover:text-blue-100 
      transition-colors select-none">
      {n}
    </div>

    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{emoji}</div>

    <h3 className="text-base sm:text-lg font-bold 
      text-slate-500 dark:text-white mb-2">
      {title}
    </h3>

    <p className="text-sm sm:text-base 
      text-slate-500 dark:text-slate-300
       
      leading-relaxed">
      {desc}
    </p>
  </Card>
);

const HowItWorks: FC = () => (
  <section className="py-16 sm:py-20 lg:py-24 
    bg-slate-50 dark:bg-slate-950 
    transition-colors duration-300">
    
    <div className="max-w-7xl mx-auto 
      px-4 sm:px-6 lg:px-8">

      <SectionTitle 
        eyebrow="Simple Process" 
        title="How It Works" 
        center 
      />

      <div className="
        mt-12
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5 sm:gap-6
      ">
        {STEPS.map((step: Step) => (
          <StepCard key={step.n} {...step} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

