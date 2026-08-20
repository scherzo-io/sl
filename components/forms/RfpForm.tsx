"use client";

import rfp from "@/content/copy/rfp.json";

export function RfpForm() {
  const fields = rfp.fields;
  return (
    <form
      action={`mailto:${rfp.mailto}`}
      method="post"
      encType="text/plain"
      className="space-y-6 text-left"
    >
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block font-display text-sm font-light text-ink">
            {field.label}
            {field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              rows={5}
              className="w-full border border-ink bg-paper px-3 py-2 font-body text-sm font-light text-ink"
            />
          ) : (
            <input
              name={field.name}
              type="text"
              required={field.required}
              className="w-full border border-ink bg-paper px-3 py-2 font-body text-sm font-light text-ink"
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        className="w-full py-3 font-display text-md font-light text-red"
      >
        Request for pricing
      </button>
    </form>
  );
}
