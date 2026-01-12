"use client";
import Form from "./components/form";
import { useState } from "react";
import type { UserContext, PreviewContext } from '@/app/lib/types/campaign';
import { buildOgUrl, FormOutput } from "@/app/lib/org/buildOgUrl";
import { sendTestEmail } from "./lib/sendGrid/sendEmail";
import { handleCreatePdf } from "./lib/pdf/createPdf";
import { api } from '@/app/lib/api/client'
import { motion, AnimatePresence } from "framer-motion";
import PreviewPanel from "@/app/components/previewPanel";
import { PdfState } from "./lib/types/pdf";



export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: '',
          email: ''
      });

      const [isLoading, setIsLoading] = useState(false)
      const [showPreview, setShowPreview] = useState(false)
      const [formOutput, setFormOutput] = useState<FormOutput | null>(null);
      const [previewContext, setPreviewContext] = useState<PreviewContext | null>(null);
      const [error, setError] = useState(false)
      const [pdfState, setPdfState] = useState<PdfState>({ status: "idle" });
      const [isPreviewImageReady, setIsPreviewImageReady] = useState(false);



      const isDirty =
        previewContext &&
        JSON.stringify(userContext) !== JSON.stringify(previewContext);

        const previewReady = showPreview && !!previewContext && !!formOutput && isPreviewImageReady;
        const canCompletePdf = previewReady && !isDirty && pdfState.status !== "sending";
        const isPreviewBusy = isLoading || (showPreview && !isPreviewImageReady);



        async function commitAndGenerate() {
          setIsLoading(true);
          setIsPreviewImageReady(false); // ✅ reset whenever we generate a new preview
          try {
            const data = await api.post<FormOutput>("/generate", { userContext });
            setFormOutput(data);
            setPreviewContext(userContext);
            setShowPreview(true);
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }
        

      const handlePreviewClick = async () => {
        await commitAndGenerate();
      };

      
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
            message: "We couldn’t send your PDF. Please try again or download it instead.",
          });
        }
      }
      

      const ogImageUrl =
      formOutput && previewContext
        ? buildOgUrl(formOutput, previewContext)
        : null;
      
      
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {/* HEADER */}
            <div className="space-y-1 text-center">
              <h1 className="text-lg font-semibold text-slate-100">
                Campaign Configurator
              </h1>
              <p className="text-sm text-slate-400">Powered by REAL.AI</p>
            </div>
      
            {/* MAIN LAYOUT */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
              className={
                showPreview
                  ? "grid gap-6 lg:grid-cols-[0.9fr_1.3fr] items-start"
                  : "flex justify-center"
              }
            >
              {/* LEFT — FORM */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
                className={showPreview ? "lg:sticky lg:top-10" : "w-full max-w-160"}
              >
                <Form
                  userContext={userContext}
                  setUserContext={setUserContext}
                  onGeneratePreview={handlePreviewClick}
                  error={error}
                  showPreview={showPreview}
                  isLoading={isPreviewBusy}   // ✅ change this line
                  onCompletePdf={handleCompletePdf}
                  pdfState={pdfState}
                  canCompletePdf={canCompletePdf}
                />
              </motion.div>
    
              {/* RIGHT — PREVIEW */}
               {showPreview && (
                  <PreviewPanel
                    showPreview={showPreview}
                    isLoading={isLoading}
                    ogImageUrl={ogImageUrl}
                    onPreviewReady={setIsPreviewImageReady}

                  />
               )}
            </motion.div>
            {(pdfState.status === "success" || pdfState.status === "error") && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-lg">
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
                      It may take up to a minute to arrive. Check spam or junk if you don’t see it.
                    </p>
                  )}

                  <div className="mt-6 flex justify-end gap-2">
                    {pdfState.status === "error" && (
                      <button
                        type="button"
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
                      type="button"
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
        </div>
      );
      }      
