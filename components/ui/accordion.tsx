"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
export type AccordionItem = { question: string; answer: string };
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-line divide-line divide-y overflow-hidden rounded-3xl border bg-white shadow-sm">
      {items.map((item, index) => {
        const active = open === index;
        const contentId = `faq-item-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                onClick={() => setOpen(active ? null : index)}
                aria-expanded={active}
                aria-controls={contentId}
                className={cn(
                  "text-navy font-heading flex w-full items-center justify-between gap-5 rounded-t-3xl bg-white px-5 py-5 text-left font-bold transition-colors duration-200 sm:px-6 sm:py-6",
                  active
                    ? "bg-white shadow-[0_10px_30px_-15px_rgba(15,23,42,0.18)]"
                    : "hover:bg-off-white",
                )}
              >
                <span className="flex-1 text-left">{item.question}</span>
                {active ? (
                  <Minus className="text-amber shrink-0" size={20} />
                ) : (
                  <Plus className="text-navy shrink-0" size={20} />
                )}
              </button>
            </h3>
            <div
              id={contentId}
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                active ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
              )}
            >
              <div className="text-muted px-5 pb-5 text-sm leading-7 sm:px-6 sm:pb-6">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
