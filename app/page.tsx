"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Form from "./components/form";
import PreviewPanel from "@/app/components/previewPanel";

import type { UserContext, PreviewContext } from "@/app/lib/types/campaign";
import { buildOgUrl, FormOutput } from "@/app/lib/org/buildOgUrl";
import { api } from "@/app/lib/api/client";
import { PdfState } from "./lib/types/pdf";

type MobileTab = "form" | "preview";

export default function Home() {
  const [userContext, setUserContext] = useState<UserContext>({
    campaignType: "audience",
    description: "",
    industry: "",
    email: "",
    name:"",
    companyName:""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formOutput, setFormOutput] = useState<FormOutput | null>(null);
  const [previewContext, setPreviewContext] = useState<PreviewContext | null>(null);
  const [error, setError] = useState(false);

  const [pdfState, setPdfState] = useState<PdfState>({ status: "idle" });
  const [isPreviewImageReady, setIsPreviewImageReady] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");

  const isDirty =
    previewContext &&
    JSON.stringify(userContext) !== JSON.stringify(previewContext);

  const previewReady =
    showPreview && !!previewContext && !!formOutput && isPreviewImageReady;

  const canCompletePdf =
    previewReady && !isDirty && pdfState.status !== "sending";

  const isPreviewBusy =
    isLoading || (showPreview && !isPreviewImageReady);

  async function commitAndGenerate() {
    setIsLoading(true);
    setIsPreviewImageReady(false);

    try {
      const data = await api.post<FormOutput>("/generate", { userContext });
      setFormOutput(data);
      setPreviewContext(userContext);
      setShowPreview(true);
      setMobileTab("preview");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCompletePdf() {
    try {
      if (!canCompletePdf || !formOutput || !previewContext?.email) return;

      setPdfState({ status: "sending" });

      await api.post("/emailPdf", {
        email: previewContext.email,
        previewContext,
        formOutput,
      });

      setPdfState({ status: "success", email: previewContext.email });
    } catch (err) {
      console.error(err);
      setPdfState({
        status: "error",
        message: "We couldn’t send your PDF. Please try again.",
      });
    }
  }

  const ogImageUrl =
    formOutput && previewContext
      ? buildOgUrl(formOutput, previewContext)
      : null;

  function MobileToggle({
    tab,
    setTab,
  }: {
    tab: MobileTab;
    setTab: (t: MobileTab) => void;
  }) {
    return (
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-800">
            <button
              onClick={() => setTab("form")}
              className={`py-2 text-sm font-semibold ${
                tab === "form"
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300"
              }`}
            >
              Form
            </button>

            <button
              onClick={() => setTab("preview")}
              className={`py-2 text-sm font-semibold ${
                tab === "preview"
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold">Campaign Configurator</h1>
          <p className="text-sm text-slate-400">Powered by REAL.AI</p>
        </div>

        {/* MOBILE TOGGLE */}
        {showPreview && (
          <MobileToggle tab={mobileTab} setTab={setMobileTab} />
        )}

        {/* MOBILE CONTENT */}
        <div className="md:hidden">
          <div className={!showPreview || mobileTab === "form" ? "block" : "hidden"}>
            <Form
              userContext={userContext}
              setUserContext={setUserContext}
              onGeneratePreview={commitAndGenerate}
              error={error}
              showPreview={showPreview}
              isLoading={isPreviewBusy}
              onCompletePdf={handleCompletePdf}
              pdfState={pdfState}
              canCompletePdf={canCompletePdf}
            />
          </div>

          {showPreview && (
            <div className={mobileTab === "preview" ? "block" : "hidden"}>
              <PreviewPanel
                showPreview={showPreview}
                isLoading={isLoading}
                ogImageUrl={ogImageUrl}
                onPreviewReady={setIsPreviewImageReady}
                canCompletePdf={canCompletePdf}
                pdfState={pdfState}
                onCompletePdf={handleCompletePdf}
              />
            </div>
          )}
        </div>

        {/* DESKTOP CONTENT */}
        <div className="hidden md:block">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className={
              showPreview
                ? "grid gap-6 lg:grid-cols-[0.9fr_1.3fr]"
                : "flex justify-center"
            }
          >
            <motion.div className={showPreview ? "lg:sticky lg:top-10" : "w-full max-w-160"}>
              <Form
                userContext={userContext}
                setUserContext={setUserContext}
                onGeneratePreview={commitAndGenerate}
                error={error}
                showPreview={showPreview}
                isLoading={isPreviewBusy}
                onCompletePdf={handleCompletePdf}
                pdfState={pdfState}
                canCompletePdf={canCompletePdf}
              />
            </motion.div>

            {showPreview && (
              <PreviewPanel
                showPreview={showPreview}
                isLoading={isLoading}
                ogImageUrl={ogImageUrl}
                onPreviewReady={setIsPreviewImageReady}
                canCompletePdf={canCompletePdf}
                pdfState={pdfState}
                onCompletePdf={handleCompletePdf}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* PDF STATUS MODAL */}
      {(pdfState.status === "success" || pdfState.status === "error") && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-black">
              {pdfState.status === "success" ? "PDF Sent" : "Send Failed"}
            </h2>

            <p className="mt-2 text-sm text-slate-700">
              {pdfState.status === "success"
                ? `We emailed your PDF to ${pdfState.email}.`
                : pdfState.message}
            </p>

            {pdfState.status === "success" && (
              <p className="mt-2 text-xs text-slate-500">
                It may take up to a minute to arrive. Check spam if needed.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              {pdfState.status === "error" && (
                <button
                  onClick={() => {
                    setPdfState({ status: "idle" });
                    handleCompletePdf();
                  }}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                  Try Again
                </button>
              )}

              <button
                onClick={() => setPdfState({ status: "idle" })}
                className="rounded-md border px-4 py-2 text-sm font-medium text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
