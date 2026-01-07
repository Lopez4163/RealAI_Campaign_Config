"use client";
import React from 'react'
import { useState } from 'react'
import type { UserContext } from '@/app/lib/types/campaign'


type Props = {
    userContext: UserContext;
    setUserContext: React.Dispatch<React.SetStateAction<UserContext>>;
    handleSubmit: (e?: React.FormEvent) => void | Promise<void>;
    error: boolean;
    showPreview: boolean;
    previewReady: boolean;}

export default function Form({ userContext, setUserContext, handleSubmit, error, showPreview, previewReady }: Props) {
    const { campaignType, description, industry, email } = userContext
    const [otherToggle, setOtherToggle] = useState(false)

    const label =
        campaignType === 'audience'
        ? 'Tell us about your product'
        : 'Tell us about your audience';
  return (
    <div
        className=
          "min-h-screen bg-slate-950 text-slate-100 px-4 py-1"
>   
   {/* CARD */}
    <div className="w-full max-w-160">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6"
      >
        {/* CAMPAIGN TYPE */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-200">
            Tell us what you want to see:
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="campaignType"
              checked={campaignType === "audience"}
              onChange={() =>
                setUserContext((prev) => ({ ...prev, campaignType: "audience" }))
              }
              className="h-4 w-4 accent-slate-100 cursor-pointer"
            />
            <span className="text-sm text-slate-200">
              Targeted audience for my product
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="campaignType"
              checked={campaignType === "product"}
              onChange={() =>
                setUserContext((prev) => ({ ...prev, campaignType: "product" }))
              }
              className="h-4 w-4 accent-slate-100 cursor-pointer"
            />
            <span className="text-sm text-slate-200">
              Products that will engage my existing audience
            </span>
          </label>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-200">{label}:</h2>
          <textarea
            placeholder="Describe it in 1–3 sentences…"
            value={description}
            onChange={(e) =>
              setUserContext((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full min-h-40 resize-none rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">Please enter a description.</p>}
        </div>

        {/* INDUSTRY */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-200">Tell us your industry:</h2>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "CPG", value: "consumer-product-goods" },
              { label: "EDU", value: "education" },
              { label: "HOSPITALITY", value: "hospitality" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setOtherToggle(false);
                  setUserContext((prev) => ({ ...prev, industry: opt.value }));
                }}
                className={`rounded-md border px-3 py-2 text-sm font-medium cursor-pointer hover:bg-slate-800
                  ${
                    industry === opt.value && !otherToggle
                      ? "border-slate-100 bg-slate-100 text-slate-900"
                      : "border-slate-800 bg-slate-900 text-slate-100"
                  }`}
              >
                {opt.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setOtherToggle(true);
                setUserContext((prev) => ({ ...prev, industry: "" }));
              }}
              className={`rounded-md border px-3 py-2 text-sm font-medium cursor-pointer hover:bg-slate-800
                ${
                  otherToggle
                    ? "border-slate-100 bg-slate-100 text-slate-900"
                    : "border-slate-800 bg-slate-900 text-slate-100"
                }`}
            >
              OTHER
            </button>
          </div>

          {otherToggle && (
            <input
              type="text"
              placeholder="Type your industry…"
              value={industry ?? ""}
              onChange={(e) =>
                setUserContext((prev) => ({ ...prev, industry: e.target.value }))
              }
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          )}
        </div>
        {/* EMAIL */}
        <div className='space-y-2'>
          <h2 className="text-sm font-medium text-slate-200">Enter Your Email:</h2>
          <input type='text' placeholder='Enter Email' className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none" 
          onChange={(e)=> {
            setUserContext((prev) => ({ ...prev, email: e.target.value }))
          }}/>
        </div>
        {/* BUTTONS */}
        <div className='flex flex-col gap-2'>
          {showPreview && previewReady && (
              <button
                type="submit"
                className="w-full rounded-md border border-slate-100 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update Preview
              </button>
          )}
          <button
            type="submit"
            disabled={!description || !description.trim() || !industry || !email.trim()}
            className="w-full rounded-md border border-slate-100 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPreview && previewReady ? "Complete PDF" : "Fetch Results"}
          </button>
        </div>

      </form>
    </div>
  </div>

  )
}