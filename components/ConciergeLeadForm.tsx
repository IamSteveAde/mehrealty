"use client";
import {useState, type FormEvent} from "react";
export type ConciergeDetails = {name: string; email: string; phone: string; development: string; request: string};
export default function ConciergeLeadForm({initial, busy, onReview, onCancel}: {
  initial: ConciergeDetails; busy: boolean; onReview: (details: ConciergeDetails) => void; onCancel: () => void;
}) {
  const [details, setDetails] = useState(initial);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = details.phone.replace(/\D/g, "");
    if (!/^\+?[\d\s().-]+$/.test(details.phone.trim()) || digits.length < 7 || digits.length > 15) {
      setError("Enter a valid phone number, including the country code."); return;
    }
    setError(""); onReview(details);
  }
  const fields = [
    {key: "name", label: "Full name", type: "text", placeholder: "Enter your full name", autoComplete: "name", max: 120},
    {key: "email", label: "Email address", type: "email", placeholder: "Enter your email address", autoComplete: "email", max: 200},
    {key: "phone", label: "Phone number", type: "tel", placeholder: "+234…", autoComplete: "tel", max: 40},
    {key: "development", label: "Property or development", type: "text", placeholder: "Enter the property or your preference", autoComplete: "off", max: 200},
  ] as const;
  return <form onSubmit={submit} className="space-y-3 rounded-xl border border-[#ded3c0] bg-white p-4 text-xs text-[#33332d]">
    <h3 className="text-base font-semibold">Your enquiry details</h3>
    <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
      {fields.map(field => <label key={field.key} className="block">
        <span className="mb-1 block font-medium">{field.label} *</span>
        <input name={field.key} type={field.type} autoComplete={field.autoComplete} required minLength={field.key === "email" ? undefined : 2} maxLength={field.max}
          placeholder={field.placeholder} value={details[field.key]} onChange={event => setDetails({...details, [field.key]: event.target.value})}
          className="min-h-11 w-full rounded-lg border border-[#ded6c9] bg-[#faf9f6] px-3 py-2 text-base focus:border-[#b8975a] focus:outline-none"/>
      </label>)}
      <label className="block"><span className="mb-1 block font-medium">How can we help? *</span>
        <textarea name="request" required minLength={2} maxLength={2000} rows={3} placeholder="Viewing, callback, pricing or other enquiry"
          value={details.request} onChange={event => setDetails({...details, request: event.target.value})}
          className="w-full rounded-lg border border-[#ded6c9] bg-[#faf9f6] px-3 py-2 text-base focus:border-[#b8975a] focus:outline-none"/>
      </label>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <p className="leading-5 text-[#756b5d]">Review your details next. We’ll ask for your permission before submitting them to our team.</p>
      <button type="submit" className="min-h-11 w-full rounded-lg bg-[#b8975a] px-4 font-medium">{busy ? "Please wait…" : "Review enquiry"}</button>
      <button type="button" onClick={onCancel} className="min-h-11 w-full underline">Continue chatting instead</button>
    </fieldset>
  </form>;
}
