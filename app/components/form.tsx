"use client";
import React from 'react'
import { useState } from 'react'
import type { CampaignType, UserContext } from '@/app/lib/types/campaign'


type Props = {
    userContext: UserContext;
    setUserContext: React.Dispatch<React.SetStateAction<UserContext>>;
}

export default function Form({ userContext, setUserContext }: Props) {
    const { campaignType, description, industry} = userContext
    const [otherToggle, setOtherToggle] = useState(false)


    //TEXT AREA LABEEL
    const label =
        campaignType === 'Audience'
        ? 'Tell us about your product'
        : 'Tell us about your audience';
  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!userContext.campaignType) {
            alert("Please select a campaign type.");
            return;
        }

        if (!userContext.description.trim()) {
            alert("Please provide a description.");
            return;
        }

        if (!userContext.industry || !userContext.industry.trim()) {
            alert("Please select or enter an industry.");
            return;
        }

        // If all checks pass
        console.log("✅ SUBMITTED USER CONTEXT:", userContext);
    };



  return (
<div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-lg space-y-8"
  >
    {/* CAMPAIGN TYPE */}
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Tell Us What Ya Think</h1>
        <p className="text-sm text-slate-400 mt-1">Choose a campaign goal to start.</p>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="audiance"
          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition
            ${campaignType === "Audience"
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            id="audiance"
            name="campaignType"
            value="Audience"
            checked={campaignType === "Audience"}
            onChange={(e) => {
              setUserContext((prev) => ({
                ...prev,
                campaignType: e.target.value as CampaignType,
              }));
            }}
            className="mt-1 accent-sky-500"
          />
          <div>
            <div className="text-sm font-semibold text-slate-100">
              TARGETED AUDIENCE FOR MY PRODUCT
            </div>
            <div className="text-xs text-slate-400 mt-1">
              You have a product and want to identify or test an audience.
            </div>
          </div>
        </label>

        <label
          htmlFor="product"
          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition
            ${campaignType === "Product"
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            id="product"
            name="campaignType"
            value="Product"
            checked={campaignType === "Product"}
            onChange={(e) => {
              setUserContext((prev) => ({
                ...prev,
                campaignType: e.target.value as CampaignType,
              }));
            }}
            className="mt-1 accent-sky-500"
          />
          <div>
            <div className="text-sm font-semibold text-slate-100">
              PRODUCT TO TARGET MY AUDIENCE
            </div>
            <div className="text-xs text-slate-400 mt-1">
              You have an audience and want to refine/test the product messaging.
            </div>
          </div>
        </label>
      </div>
    </div>

    {/* DESCRIPTION */}
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Tell us about your <span className="text-slate-100">{campaignType}</span>
        </h1>
        <span className="text-xs text-slate-500">Step 2</span>
      </div>

      <textarea
        placeholder={label}
        value={userContext.description}
        onChange={(e) =>
          setUserContext((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        className="w-full min-h-[140px] rounded-xl border border-slate-800 bg-slate-950/60
                   p-4 text-slate-100 placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>

    {/* INDUSTRY */}
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Tell us your industry
        </h2>
        <span className="text-xs text-slate-500">Step 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label
          htmlFor="cpg"
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
            ${industry === "consumer-product-goods"
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            id="cpg"
            name="industryType"
            value="consumer-product-goods"
            checked={industry === "consumer-product-goods"}
            onChange={() => {
              setOtherToggle(false);
              setUserContext((prev) => ({ ...prev, industry: "consumer-product-goods" }));
            }}
            className="accent-sky-500"
          />
          <span className="text-sm font-medium text-slate-100">CPG</span>
        </label>

        <label
          htmlFor="edu"
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
            ${industry === "education"
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            id="edu"
            name="industryType"
            value="education"
            checked={industry === "education"}
            onChange={() => {
              setOtherToggle(false);
              setUserContext((prev) => ({ ...prev, industry: "education" }));
            }}
            className="accent-sky-500"
          />
          <span className="text-sm font-medium text-slate-100">EDU</span>
        </label>

        <label
          htmlFor="hospitality"
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
            ${industry === "hospitality"
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            id="hospitality"
            name="industryType"
            value="hospitality"
            checked={industry === "hospitality"}
            onChange={() => {
              setOtherToggle(false);
              setUserContext((prev) => ({ ...prev, industry: "hospitality" }));
            }}
            className="accent-sky-500"
          />
          <span className="text-sm font-medium text-slate-100">HOSPITALITY</span>
        </label>
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
            ${otherToggle
              ? "border-sky-500 bg-sky-500/10"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}
          `}
        >
          <input
            type="radio"
            name="industryType"
            checked={otherToggle}
            onChange={() => {
              setOtherToggle(true);
              setUserContext((prev) => ({ ...prev, industry: "" }));
            }}
            className="accent-sky-500"
          />
          <span className="text-sm font-medium text-slate-100">OTHER</span>
        </label>

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
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60
                       p-3 text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        )}
      </div>
    </div>

    {/* SUBMIT */}
    <button
      type="submit"
      className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-slate-950
                 hover:bg-sky-400 transition"
    >
      Submit
    </button>
  </form>
</div>


  )
}