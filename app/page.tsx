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

      const sendPdf = async (
        previewContext: PreviewContext,
        formOutput: FormOutput
      ) => {
        if (!previewContext.email) return;
      
        const data = await api.post("/emailPdf", {
          email: previewContext.email,
          previewContext,
          formOutput,
        });
        return data;
      };
      
      async function handleCompletePdf() {
        if (isDirty) {
          await commitAndGenerate();
        }
        if (!formOutput || !previewContext?.email) return;
        await sendPdf(previewContext, formOutput);
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
