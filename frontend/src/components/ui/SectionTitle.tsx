import type { FC } from "react";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  center?: boolean;
}

const SectionTitle: FC<SectionTitleProps> = ({ eyebrow, title, center = false }) => (
  <div className={`mb-16 ${center ? "text-center" : ""}`}>
    <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
      {eyebrow}
    </p>
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
      {title}
    </h2>
    <div className={`w-12 h-1 bg-blue-600 rounded-full mt-4 ${center ? "mx-auto" : ""}`} />
  </div>
);

export default SectionTitle;
