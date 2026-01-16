"use client";

import React, { useState } from "react";
import type { UserContext } from "@/app/lib/types/campaign";
import type { PdfState } from "../lib/types/pdf";
import CompletePdfButton from "./CompletePdfButton";

type Props = {
  userContext: UserContext;
  setUserContext: React.Dispatch<React.SetStateAction<UserContext>>;

  error: boolean;
  showPreview: boolean;
  isLoading: boolean;

  onGeneratePreview: () => void | Promise<void>;
  onCompletePdf: () => void | Promise<void>;
  pdfState: PdfState;
  canCompletePdf: boolean;
  emailError?: string | null;
  setEmailError: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Form({
  userContext,
  setUserContext,
  error,
  showPreview,
  onGeneratePreview,
  isLoading,
  onCompletePdf,
  pdfState, 
  canCompletePdf,
  emailError,
  setEmailError,

}: Props) {
  const { campaignType, description, industry, email, name, companyName } = userContext;
  const [otherToggle, setOtherToggle] = useState(false);

  const label =
    campaignType === "audience"
      ? "Tell us about your product"
      : "Tell us about your audience";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-160">
        <form className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div
            className='flex gap-4 flex-col'
        >
            <div className="flex gap-3 w-full flex-col">
              {/* NAME */}
              <div className='flex flex-col gap-1 w-full'>
                <label className="text-xs font-medium text-slate-400">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name ?? ""}
                  onChange={(e) =>
                    setUserContext((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                />
              </div>

              {/* COMPANY */}
              <div className='flex flex-col gap-1 w-full'>
                <label className="text-xs font-medium text-slate-400">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={companyName ?? ""}
                  onChange={(e) =>
                    setUserContext((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                />
              </div>

              {/* EMAIL */}
              <div className='flex flex-col gap-1 w-full'>
                <label className="text-xs font-medium text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Email address"
                  value={userContext.email ?? ""}
                  onChange={(e) => {
                    setUserContext((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    if (emailError) setEmailError(null);
                  }}
                  className={`
                    w-full rounded-md px-3 py-2 text-sm
                    bg-slate-950 text-slate-100 placeholder:text-slate-500
                    focus:outline-none
                    ${
                      emailError
                        ? "border border-red-500 ring-2 ring-red-400 focus:border-red-500"
                        : "border border-slate-800 focus:border-slate-600"
                    }
                  `}
                />
                {emailError && (
                  <p className="text-xs text-red-500">
                    {emailError}
                  </p>
                )}
              </div>

            </div>
          </div>
          {/* CAMPAIGN TYPE */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-200">
              Tell us what you want to see:
            </h2>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="campaignType"
                checked={campaignType === "audience"}
                onChange={() =>
                  setUserContext((prev) => ({ ...prev, campaignType: "audience" }))
                }
                className="h-4 w-4 cursor-pointer accent-slate-100"
              />
              <span className="text-sm text-slate-200">
                Targeted audience for my product
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="campaignType"
                checked={campaignType === "product"}
                onChange={() =>
                  setUserContext((prev) => ({ ...prev, campaignType: "product" }))
                }
                className="h-4 w-4 cursor-pointer accent-slate-100"
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
                setUserContext((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-25 w-full resize-none rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            {error && (
              <p className="text-sm text-red-400">Please enter a description.</p>
            )}
          </div>

          {/* INDUSTRY */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-slate-200">
              Tell us your industry:
            </h2>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Consumer Product Goods", value: "consumer-product-goods" },
                { label: "Education", value: "education" },
                { label: "Hospitality", value: "hospitality" },
              ].map((opt) => {
                const active = industry === opt.value && !otherToggle;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setOtherToggle(false);
                      setUserContext((prev) => ({ ...prev, industry: opt.value }));
                    }}
                    className={[
                      "rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200",
                      active
                        ? "border-slate-100 bg-slate-100 text-slate-900 cursor-default"
                        : "border-slate-800 bg-slate-900 text-slate-100 cursor-pointer hover:border-slate-600 hover:bg-slate-800 hover:text-slate-50",
                    ].join(" ")}                    
                  >
                    {opt.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setOtherToggle(true);
                  setUserContext((prev) => ({ ...prev, industry: "" }));
                }}
                className={[
                  "rounded-md border px-3 py-3 text-sm font-medium cursor-pointer hover:bg-slate-800",
                  otherToggle
                  ? "border-slate-100 bg-slate-100 text-slate-900 cursor-default"
                  : "border-slate-800 bg-slate-900 text-slate-100 cursor-pointer hover:border-slate-600 hover:bg-slate-800 hover:text-slate-50",
                ].join(" ")}
              >
                Other
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

          {/* BUTTONS */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onGeneratePreview}
              disabled={isLoading || !description || !industry || !email}
              className={[
                "w-full rounded-md border px-2 py-2 text-sm font-medium transition-colors",
                isLoading
                  ? "cursor-not-allowed bg-slate-300 text-slate-600"
                  : "cursor-pointer bg-slate-100 text-black hover:bg-slate-200 hover:text-slate-800",
              ].join(" ")}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  Generating Preview…
                </span>
              ) : showPreview ? (
                "Update Preview"
              ) : (
                "Fetch Results"
              )}
            </button>
            {showPreview && (
              <div className="hidden md:block">
                <CompletePdfButton
                  canComplete={canCompletePdf}
                  isSending={pdfState.status === "sending"}
                  onClick={onCompletePdf}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
