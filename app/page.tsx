"use client";
import Form from "./components/form";
import { useState } from "react";
import type { UserContext } from '@/app/lib/types/campaign';
import { buildOgUrl } from "@/app/lib/org/buildOgUrl";

export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: ''
      });

      const [isLoading, setIsLoading] = useState(false)
      const [formOutPut, setFormOutput] = useState<Record<string, string> | null>(null);
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

      // const ogImageUrl = formOutPut
      // ? buildOgUrl(formOutPut, userContext)
      // : null;
    

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
      if (formOutPut) {
        return (
          <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="mx-auto w-full max-w-160 space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      
                <div className="rounded-md border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Parsed output
                  </div>
                  {/* PARSED OUTPUT */}
                  <ul className="space-y-2">
                    {Object.entries(formOutPut).map(([key, value]) => (
                      <li
                        key={key}
                        className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-sm"
                      >
                        <span className="font-medium capitalize text-slate-200">
                          {key.replace(/_/g, " ")}:
                        </span>{" "}
                        <span className="text-slate-300">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
        
                {/* RAW JSON*/}
                <div className="mt-6 rounded-md border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Raw output
                  </div>
                  <pre className="max-h-75 overflow-auto rounded-md bg-black/80 p-3 text-xs text-slate-200">
                    {JSON.stringify(formOutPut, null, 2)}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() => setFormOutput(null)}
                  className="mt-4 inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 cursor-pointer"
                >
                  Back
                </button>
      
              </div>
            </div>
          </main>
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
