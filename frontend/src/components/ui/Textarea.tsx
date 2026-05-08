import type { FC, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: FC<TextareaProps> = ({ label, id, ...rest }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
      {label}
    </label>
    <textarea
      id={id}
      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700
                 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white
                 placeholder-slate-400 text-sm resize-none
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      {...rest}
    />
  </div>
);

export default Textarea;
