"use client";
import Form from "./components/form";
import { useState } from "react";
import type { UserContext,  CampaignType } from '@/app/lib/types/campaign';
import { buildOgUrl, FormOutput } from "@/app/lib/org/buildOgUrl";
import { sendTestEmail } from "./lib/sendGrid/sendEmail";
import { api } from '@/app/lib/api/client'
import { motion, AnimatePresence } from "framer-motion";


export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: '',
          email: ''
      });

      const [isLoading, setIsLoading] = useState(false)
      const [showPreview, setShowPreview] = useState(false)
      const [previewReady, setPreviewReady] = useState(false);
      const [formOutput, setFormOutput] = useState<FormOutput | null>(null);
      
      const [error, setError] = useState(false)
      
      // FORM SUBMITION FUNC
      async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        setError(false);        
        setIsLoading(true);

        if (!userContext.description.trim()) {
          setError(true);
          return;
        }

        setShowPreview(true);
        setPreviewReady(false);
        setIsLoading(true);
        
        try {
          const data = await api.post<FormOutput>('/generate', { userContext });
          setFormOutput(data);
          setTimeout(() => setPreviewReady(true), 180);

          console.log("** API RETURN -->", data)

          // if (userContext.email) {
          //   await api.post('/testEmail', { email: userContext.email });
          // }
        } catch (err) {
          console.error('FETCH ERROR', err);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      }      

      // IMAGE URL BUILDER
      const ogImageUrl = formOutput
      ? buildOgUrl(formOutput, userContext)
      : null;
      
      //


      // LOADING SCREEN
      // if (isLoading) {
      //   return (
      //     <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      //       <div className="mx-auto w-full max-w-160"> 
      //         <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      //           <div className="text-sm font-medium">Generating…</div>
      //           <div className="mt-1 text-sm text-slate-400">This usually takes a few seconds.</div>
      //         </div>
      //       </div>
      //     </main>
      //   );
      // }
      // // OUTPUT SCREEN
      // if (formOutput && ogImageUrl) {
      //   return (
      //     <div className="relative h-screen w-screen bg-slate-950 overflow-hidden flex items-center justify-center p-6">
            
      //       {/* BACK BUTTON */}
      //       <button
      //         onClick={() => {
      //           setFormOutput(null);
      //           setUserContext({
      //             campaignType: "audience",
      //             description: "",
      //             industry: "",
      //             email: ""
      //           });
      //         }}
      //         className="
      //           absolute left-6 top-6
      //           rounded-md
      //           bg-slate-800/80
      //           px-4 py-2
      //           text-sm font-medium text-slate-100
      //           hover:bg-slate-700
      //           transition
      //           shadow-md
      //         "
      //       >
      //         ← Back
      //       </button>
      
      //       {/* CENTERED PAPER */}
      //       <div className="bg-slate-900/40 p-4 rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      //         <div className="bg-white rounded-lg p-3 ring-1 ring-black/10">
      //           <img
      //             src={ogImageUrl}
      //             alt="Campaign infographic"
      //             className="block max-h-[88vh] max-w-[88vw] w-auto h-auto rounded-md"
      //           />
      //         </div>
      //       </div>
      
      //     </div>
      //   );
      // }
      
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
                  handleSubmit={handleSubmit}
                  error={error}
                  showPreview={showPreview}
                />
              </motion.div>
      
              {/* RIGHT — PREVIEW */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
                  >
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-slate-100">Preview</h2>
                      <p className="text-xs text-slate-400">
                        {isLoading ? "Generating…" : "Updated preview"}
                      </p>
                    </div>
      
                    {/* PREVIEW VIEWER */}
                    <div className="h-[75vh] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center p-4">
                        <AnimatePresence mode="wait">
                          {!previewReady || !ogImageUrl ? (
                            <motion.div
                              key="placeholder"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm text-slate-500"
                            >
                              Generating preview…
                            </motion.div>
                          ) : (
                            <motion.img
                              key={ogImageUrl}
                              src={ogImageUrl}
                              alt="Campaign infographic"
                              initial={{ opacity: 0, scale: 0.985 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.985 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="max-h-full max-w-full object-contain rounded-md shadow"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      );
      
    }      
