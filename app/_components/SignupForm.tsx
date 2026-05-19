"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "ok" | "error";

export default function SignupForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      property_count: String(form.get("property_count") || "").trim(),
    };
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }
      setState("ok");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-lg border border-teal/30 bg-teal/5 p-5 text-stone-800">
        <p className="font-medium">Got it. We&apos;ll be in touch within a day.</p>
        <p className="mt-1 text-sm text-stone-600">From greg@cleanerpay.ai, real human.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Your name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Select
        label="How many properties?"
        name="property_count"
        required
        options={["1", "2", "3", "4-9", "10+"]}
      />
      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-1 inline-flex items-center justify-center rounded-md bg-teal px-5 py-3 text-base font-medium text-white hover:bg-teal-dark transition disabled:opacity-60"
      >
        {state === "submitting" ? "Sending..." : "Get started"}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}

function Field(
  props: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
  },
) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-stone-700">{props.label}</span>
      <input
        name={props.name}
        type={props.type || "text"}
        required={props.required}
        autoComplete={props.autoComplete}
        className="rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-base text-stone-900 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
    </label>
  );
}

function Select(
  props: { label: string; name: string; required?: boolean; options: string[] },
) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-stone-700">{props.label}</span>
      <select
        name={props.name}
        required={props.required}
        defaultValue=""
        className="rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-base text-stone-900 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
      >
        <option value="" disabled>
          Pick one
        </option>
        {props.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
