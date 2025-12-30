"use client";
import React from 'react'
import { useState } from 'react'
import type { CampaignType, UserContext } from '@/app/lib/types/campaign'


type Props = {
    userContext: UserContext;
    setUserContext: React.Dispatch<React.SetStateAction<UserContext>>;
    handleSubmit: (e?: React.FormEvent) => void | Promise<void>;
}

export default function Form({ userContext, setUserContext, handleSubmit }: Props) {
    const { campaignType, description, industry} = userContext
    const [otherToggle, setOtherToggle] = useState(false)


    //TEXT AREA LABEEL
    const label =
        campaignType === 'Audience'
        ? 'Tell us about your product'
        : 'Tell us about your audience';
  



  return (
    <div className="min-h-screen bg-[#4B95D6] flex flex-col items-center px-4 py-8">
    {/* HEADER */}
    <div className="w-full max-w-[640px] text-center">
      <h1 className="text-[#F4F06A] font-extrabold tracking-wide text-4xl sm:text-5xl md:text-6xl">
        CAMPAIGN CONFIGURATOR
      </h1>
      <div className="mt-3 text-[#F4F06A] font-extrabold tracking-wide text-xl sm:text-2xl md:text-3xl">
        POWERED BY <span className="text-white">REAL.AI</span>
      </div>
      <div className="mt-6 h-[3px] bg-white/45 w-full rounded-full" />
    </div>

    {/* CARD */}
    <div className="w-full max-w-[640px] mt-8">
      <form onSubmit={handleSubmit}
        className="bg-white rounded-[28px]
                   px-6 py-6
                   sm:px-8 sm:py-8
                   md:px-12 md:py-10
                   shadow-[0_12px_0_rgba(0,0,0,0.08)]
                   space-y-8"
      >
        {/* CAMPAIGN TYPE */}
        <div className="space-y-4">
          <h2 className="text-[#2D80C7] font-extrabold uppercase">
            Tell us what you want to see:
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="campaignType"
              checked={campaignType === "Audience"}
              onChange={() =>
                setUserContext((prev) => ({
                  ...prev,
                  campaignType: "Audience",
                }))
              }
              className="h-5 w-5 accent-[#2D80C7]"
            />
            <span className="font-extrabold uppercase text-slate-900">
              Targeted audience for my product
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="campaignType"
              checked={campaignType === "Product"}
              onChange={() =>
                setUserContext((prev) => ({
                  ...prev,
                  campaignType: "Product",
                }))
              }
              className="h-5 w-5 accent-[#2D80C7]"
            />
            <span className="font-extrabold uppercase text-slate-400">
              Products that will engage my existing audience
            </span>
          </label>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-4">
          <h2 className="text-[#2D80C7] font-extrabold uppercase">
            {label}:
          </h2>

          <textarea
            placeholder="WE MAKE WIDGETS THAT DO ANYTHING YOU COULD IMAGINE..."
            value={description}
            onChange={(e) =>
              setUserContext((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full resize-none rounded-[26px]
                       bg-[#CFE6FB] border-[4px] border-[#6E6E6E]
                       px-5 py-4 min-h-[160px] sm:min-h-[200px]
                       text-slate-800 placeholder-slate-400
                       focus:outline-none"
          />
        </div>

        {/* INDUSTRY */}
        <div className="space-y-4">
          <h2 className="text-[#2D80C7] font-extrabold uppercase">
            Tell us your industry:
          </h2>

          <div className="flex flex-wrap gap-3">
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
                  setUserContext((prev) => ({
                    ...prev,
                    industry: opt.value,
                  }));
                }}
                className={`rounded-[14px] px-6 py-3 border-[3px] font-extrabold uppercase
                  ${
                    industry === opt.value && !otherToggle
                      ? "bg-[#4B95D6] border-[#6E6E6E]"
                      : "bg-white border-[#6E6E6E]"
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
              className={`rounded-[14px] px-6 py-3 border-[3px] font-extrabold uppercase
                ${
                  otherToggle
                    ? "bg-[#4B95D6] border-[#6E6E6E]"
                    : "bg-white border-[#6E6E6E]"
                }`}
            >
              OTHER
            </button>
          </div>

          {otherToggle && (
            <input
              type="text"
              placeholder="TYPE YOUR INDUSTRY HERE"
              value={industry ?? ""}
              onChange={(e) =>
                setUserContext((prev) => ({
                  ...prev,
                  industry: e.target.value,
                }))
              }
              className="w-full rounded-[16px] border-[3px] border-[#6E6E6E]
                         px-4 py-3 text-slate-800 placeholder-slate-400
                         focus:outline-none"
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full rounded-full bg-[#F4F06A] py-4
                     text-[#2D80C7] font-extrabold uppercase tracking-wide text-xl
                     shadow-[0_6px_0_rgba(0,0,0,0.18)]
                     active:translate-y-[2px]"
        >
          Fetch Results
        </button>
      </form>
    </div>
  </div>



  )
}