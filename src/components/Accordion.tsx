"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left group focus:outline-none"
      >
        <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900 group-hover:text-[#e4d2ef] transition-colors">{title}</span>
        <div className={`p-1 rounded-full bg-gray-50 group-hover:bg-[#e4d2ef]/10 transition-colors ${isOpen ? 'bg-[#e4d2ef]/10' : ''}`}>
          <ChevronDown
            className={`h-4 w-4 transform transition-transform duration-500 text-gray-400 group-hover:text-[#e4d2ef] ${
              isOpen ? "rotate-180 text-[#e4d2ef]" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden text-[13px] leading-relaxed text-gray-600 transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="prose prose-sm max-w-none text-gray-500 font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
