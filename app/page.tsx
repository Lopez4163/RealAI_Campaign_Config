"use client";
import Form from "./components/form";
import { useState } from "react";
import type { UserContext, PreviewContext } from '@/app/lib/types/campaign';
import { buildOgUrl, FormOutput } from "@/app/lib/org/buildOgUrl";
import { sendTestEmail } from "./lib/sendGrid/sendEmail";
import { api } from '@/app/lib/api/client'
import { motion, AnimatePresence } from "framer-motion";
import PreviewPanel from "@/app/components/previewPanel";



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

      const isDirty =
        previewContext &&
        JSON.stringify(userContext) !== JSON.stringify(previewContext);



     async function commitAndGenerate() {
      setIsLoading(true);
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
        // If user edited after preview, force update first
        if (isDirty) {
          await commitAndGenerate();
        }
      
        // Now you are GUARANTEED:
        // - previewContext exists
        // - formOutput matches the preview
        // Safe to export / email / PDF
        // await generatePdfFromPreview();
      }

      const ogImageUrl =
      formOutput && previewContext
        ? buildOgUrl(formOutput, previewContext)
        : null;
    
      //

      

      
      // // FORM SUBMITION FUNC
      // async function handleSubmit(e?: React.FormEvent) {
      //   e?.preventDefault();
      //   setError(false);        
      //   setIsLoading(true);

      //   if (!userContext.description.trim()) {
      //     setError(true);
      //     return;
      //   }

      //   setShowPreview(true);
      //   setPreviewReady(false);
      //   setIsLoading(true);
        
      //   try {
      //     const data = await api.post<FormOutput>('/generate', { userContext });
      //     setFormOutput(data);
      //     setPreviewContext(userContext)
      //     setTimeout(() => setPreviewReady(true), 180);

      //     console.log("** API RETURN -->", data)

      //     // if (userContext.email) {
      //     //   await api.post('/testEmail', { email: userContext.email });
      //     // }
      //   } catch (err) {
      //     console.error('FETCH ERROR', err);
      //     setError(true);
      //   } finally {
      //     setIsLoading(false);
      //   }
      // }  
      
  
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
                  onGeneratePreview={handlePreviewClick}
                  error={error}
                  showPreview={showPreview}
                  isLoading={isLoading}
                  onCompletePdf={handleCompletePdf}
                />
              </motion.div>
      
              {/* RIGHT — PREVIEW */}
               {showPreview && (
                  <PreviewPanel
                    showPreview={showPreview}
                    isLoading={isLoading}
                    ogImageUrl={ogImageUrl}
                  />
               )}
            </motion.div>
          </div>
        </div>
      );
    }      
