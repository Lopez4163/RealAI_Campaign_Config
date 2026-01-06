"use client";
import Form from "./components/form";
import { useState } from "react";
import type { UserContext,  CampaignType } from '@/app/lib/types/campaign';
import { buildOgUrl, FormOutput } from "@/app/lib/org/buildOgUrl";

export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: ''
      });

      const [isLoading, setIsLoading] = useState(false)
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
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userContext })
          })
          const data = await res.json();
          console.log("** API RETURN -->", data)
          if(!res.ok) {
            setError(true)
            console.log("BACKEND ERROR", data.error)
            return;
          }
          setFormOutput(data)
        } catch(err) {
            setError(true);
            console.log("FETCH ERROR",err)
        } finally {
          setIsLoading(false)
        }
      }

      const ogImageUrl = formOutput
      ? buildOgUrl(formOutput, userContext)
      : null;
    
      // LOADING SCREEN
      if (isLoading) {
        return (
          <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="mx-auto w-full max-w-160"> 
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <div className="text-sm font-medium">Generating…</div>
                <div className="mt-1 text-sm text-slate-400">This usually takes a few seconds.</div>
              </div>
            </div>
          </main>
        );
      }
      
      // OUTPUT SCREEN
      if (formOutput && ogImageUrl) {
        return (
          <div className="relative h-screen w-screen bg-slate-950 overflow-hidden flex items-center justify-center p-6">
            
            {/* BACK BUTTON */}
            <button
              onClick={() => {
                setFormOutput(null);
                setUserContext({
                  campaignType: "audience",
                  description: "",
                  industry: "",
                });
              }}
              className="
                absolute left-6 top-6
                rounded-md
                bg-slate-800/80
                px-4 py-2
                text-sm font-medium text-slate-100
                hover:bg-slate-700
                transition
                shadow-md
              "
            >
              ← Back
            </button>
      
            {/* CENTERED PAPER */}
            <div className="bg-slate-900/40 p-4 rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <div className="bg-white rounded-lg p-3 ring-1 ring-black/10">
                <img
                  src={ogImageUrl}
                  alt="Campaign infographic"
                  className="block max-h-[88vh] max-w-[88vw] w-auto h-auto rounded-md"
                />
              </div>
            </div>
      
          </div>
        );
      }
      
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
          <div className="mx-auto w-full max-w-160 space-y-6">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-slate-100">Campaign Configurator</h1>
              <p className="text-sm text-slate-400">Powered by REAL.AI</p>
            </div>
      
              <Form
                userContext={userContext}
                setUserContext={setUserContext}
                handleSubmit={handleSubmit}
                error={error}
              />
          </div>
        </div>
      );      
    }      
