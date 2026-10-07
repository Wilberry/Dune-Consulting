"use client";

import { useActionState, useState } from "react";
import {
  deleteTestimonial,
  saveTestimonial,
  type TestimonialActionState,
} from "@/app/admin/(dashboard)/testimonials/actions";
import type { Testimonial } from "@/lib/testimonials";

const initialState: TestimonialActionState = { status: "idle" };

export function TestimonialManager({ items }: { items: Testimonial[] }) {
  const [state, formAction, pending] = useActionState(
    saveTestimonial,
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
              {editingId ? "Edit feedback" : "Add feedback"}
            </p>
            <h2 className="text-navy mt-2 text-2xl font-extrabold">
              {editingId ? "Update a client review" : "Create a client review"}
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
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="testimonial-name" className="text-navy text-sm font-bold">
                Client name
              </label>
              <input
                id="testimonial-name"
                name="name"
                defaultValue={draftItem?.name ?? ""}
                placeholder="Amina Yusuf"
                required
                maxLength={120}
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="testimonial-role" className="text-navy text-sm font-bold">
                Position
              </label>
              <input
                id="testimonial-role"
                name="role"
                defaultValue={draftItem?.role ?? ""}
                placeholder="HSE Graduate"
                required
                maxLength={120}
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="testimonial-image" className="text-navy text-sm font-bold">
              Avatar or photo URL
            </label>
            <input
              id="testimonial-image"
              name="image"
              defaultValue={draftItem?.image ?? ""}
              placeholder="https://example.com/client-photo.jpg"
              maxLength={500}
              className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="testimonial-rating" className="text-navy text-sm font-bold">
              Star rating
            </label>
            <select
              id="testimonial-rating"
              name="rating"
              defaultValue={String(draftItem?.rating ?? 5)}
              className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="testimonial-quote" className="text-navy text-sm font-bold">
              Review write-up
            </label>
            <textarea
              id="testimonial-quote"
              name="quote"
              defaultValue={draftItem?.quote ?? ""}
              placeholder="Write the client feedback or testimonial text here."
              rows={5}
              required
              maxLength={800}
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
                ? "Update feedback"
                : "Save feedback"}
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
              Live list
            </p>
            <h2 className="text-navy mt-2 text-2xl font-extrabold">
              Current client feedback
            </h2>
          </div>
          <span className="text-muted text-sm font-semibold">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="border-line bg-off-white rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              No testimonials yet. Add your first client review above.
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id ?? `${item.name}-${item.role}`}
                className="border-line rounded-xl border p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-amber text-deep-navy flex h-full w-full items-center justify-center font-semibold">
                          {item.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-navy text-lg font-extrabold">
                        {item.name}
                      </h3>
                      <p className="text-muted text-sm">{item.role}</p>
                      <p className="mt-2 text-amber text-sm font-bold">
                        {"★".repeat(item.rating)}
                        {"☆".repeat(5 - item.rating)}
                      </p>
                      <p className="text-muted mt-2 text-sm leading-7">
                        “{item.quote}”
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id ?? null)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <form action={deleteTestimonial}>
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
