"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
export type AccordionItem = { question: string; answer: string };
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-line divide-line divide-y overflow-hidden rounded-xl border bg-white">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                onClick={() => setOpen(active ? null : index)}
                aria-expanded={active}
                className="text-navy font-heading hover:bg-off-white flex w-full items-center justify-between gap-5 p-5 text-left font-bold sm:p-6"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "shrink-0 transition-transform duration-200",
                    active && "rotate-180",
                  )}
                  size={20}
                />
              </button>
            </h3>
            {active && (
              <div className="text-muted px-5 pb-5 text-sm leading-7 sm:px-6 sm:pb-6">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
