"use client";

import { useState, type FormEvent } from "react";

const PROJECT_TYPES = ["Garage", "Basement", "Pool Deck", "Sidewalk", "Other"];

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      zip: (form.elements.namedItem("zip") as HTMLInputElement).value,
      projectType: (form.elements.namedItem("projectType") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/15 text-orange mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-ink mb-2">Quote request sent!</h3>
        <p className="text-ink/60 text-lg">
          We&apos;ll call you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink/70 mb-1.5">
            Name <span className="text-orange">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="form-input-light"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink/70 mb-1.5">
            Phone <span className="text-orange">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="form-input-light"
            placeholder="(970) 555-1234"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-1.5">
            Email <span className="text-orange">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="form-input-light"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-ink/70 mb-1.5">
            ZIP / City <span className="text-orange">*</span>
          </label>
          <input
            id="zip"
            name="zip"
            type="text"
            required
            autoComplete="postal-code"
            className="form-input-light"
            placeholder="80525 or Fort Collins"
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-ink/70 mb-1.5">
          Project Type <span className="text-orange">*</span>
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          className="form-input-light appearance-none"
          defaultValue=""
        >
          <option value="" disabled>
            Select a surface
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink/70 mb-1.5">
          Message <span className="text-ink/30">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="form-input-light resize-none"
          placeholder="Anything else we should know?"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-pill btn-pill-primary w-full text-lg !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Get My Free Quote"}
      </button>

      <p className="text-center text-sm text-ink/40">
        No obligation. We&apos;ll call within one business day.
      </p>
    </form>
  );
}
