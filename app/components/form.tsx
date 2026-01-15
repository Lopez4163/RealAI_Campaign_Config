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
}: Props) {
  const { campaignType, description, industry, email } = userContext;
  const [otherToggle, setOtherToggle] = useState(false);

  const label =
    campaignType === "audience"
      ? "Tell us about your product"
      : "Tell us about your audience";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-160">
        <form className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
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
              className="min-h-40 w-full resize-none rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
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
                { label: "CPG", value: "consumer-product-goods" },
                { label: "EDU", value: "education" },
                { label: "HOSPITALITY", value: "hospitality" },
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
                      "rounded-md border px-3 py-2 text-sm font-medium cursor-pointer hover:bg-slate-800",
                      active
                        ? "border-slate-100 bg-slate-100 text-slate-900"
                        : "border-slate-800 bg-slate-900 text-slate-100",
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
                  "rounded-md border px-3 py-2 text-sm font-medium cursor-pointer hover:bg-slate-800",
                  otherToggle
                    ? "border-slate-100 bg-slate-100 text-slate-900"
                    : "border-slate-800 bg-slate-900 text-slate-100",
                ].join(" ")}
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
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-slate-200">
              Enter Your Email:
            </h2>

            <input
              type="text"
              placeholder="Enter Email"
              value={email ?? ""}
              onChange={(e) =>
                setUserContext((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onGeneratePreview}
              disabled={isLoading || !description || !industry || !email}
              className={[
                "w-full rounded-md border px-4 py-2 text-sm font-medium",
                isLoading
                  ? "cursor-not-allowed bg-slate-300 text-slate-600"
                  : "cursor-pointer bg-slate-100 text-black",
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
