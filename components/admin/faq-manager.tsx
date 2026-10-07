"use client";

import { useActionState, useState } from "react";
import {
  deleteFaqItem,
  saveFaqItem,
  type FAQActionState,
} from "@/app/admin/(dashboard)/faq/actions";
import type { FAQItem } from "@/lib/faq";

const initialState: FAQActionState = { status: "idle" };

export function FAQManager({ items }: { items: FAQItem[] }) {
  const [state, formAction, pending] = useActionState(
    saveFaqItem,
    initialState,
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const draftItem = items.find((item) => item.id === editingId) ?? null;

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        className="border-line rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
      >
        <input type="hidden" name="id" value={editingId ?? ""} />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
              {editingId ? "Edit FAQ" : "Add FAQ"}
            </p>
            <h2 className="text-navy mt-2 text-2xl font-extrabold">
              {editingId ? "Update an existing question" : "Create a new question"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-muted rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <label htmlFor="faq-question" className="text-navy text-sm font-bold">
              Question
            </label>
            <input
              id="faq-question"
              name="question"
              defaultValue={draftItem?.question ?? ""}
              placeholder="What does Dune Consulting do?"
              required
              maxLength={220}
              className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="faq-answer" className="text-navy text-sm font-bold">
              Answer
            </label>
            <textarea
              id="faq-answer"
              name="answer"
              defaultValue={draftItem?.answer ?? ""}
              placeholder="Add the answer the site visitors should see."
              rows={5}
              required
              maxLength={2000}
              className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>
        </div>

        <div className="mt-5 min-h-11" aria-live="polite">
          {state.message && (
            <p
              className={`rounded-lg border p-3 text-sm ${
                state.status === "success"
                  ? "border-success/30 bg-success/5 text-success"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
              role="status"
            >
              {state.message}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-amber text-deep-navy hover:bg-amber-hover rounded-lg px-5 py-3 font-bold disabled:cursor-wait disabled:opacity-60"
          >
            {pending
              ? editingId
                ? "Updating…"
                : "Saving…"
              : editingId
                ? "Update FAQ"
                : "Save FAQ"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-muted rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold"
            >
              Clear form
            </button>
          )}
        </div>
      </form>

      <section className="border-line rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
              Published list
            </p>
            <h2 className="text-navy mt-2 text-2xl font-extrabold">
              Current FAQ section
            </h2>
          </div>
          <span className="text-muted text-sm font-semibold">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="border-line bg-off-white rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              No FAQ entries yet. Add your first question above.
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id ?? `${item.question}-${item.answer}`}
                className="border-line rounded-xl border p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-navy text-lg font-extrabold">
                      {item.question}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-7">
                      {item.answer}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id ?? null)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <form action={deleteFaqItem}>
                      <input type="hidden" name="id" value={item.id ?? ""} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
