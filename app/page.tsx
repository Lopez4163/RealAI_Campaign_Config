"use client";
import Image from "next/image";
import Link from "next/link";
import Form from "./components/form";
import { useState } from "react";
import type { CampaignType, UserContext } from '@/app/lib/types/campaign';
import { normalizeOutputToLines } from "./lib/formatter/formatter";

export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: ''
      });

      const [isLoading, setIsLoading] = useState(false)
      const [formOutPut, setFormOutput] = useState<Record<string, string> | null>(null);
      const [error, setError] = useState(false)
      

      async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        setError(false);        
        setIsLoading(true);
        if (!userContext.description.trim()) {
          setError(true);
          return;
        }
        console.log("SUBMITED USER CONTEXT -->", userContext)
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userContext })
          })
          const data = await res.json();
          console.log("API RETURN", data)
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
      if (isLoading) {
        return (
          <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="mx-auto w-full max-w-[640px]">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <div className="text-sm font-medium">Generating…</div>
                <div className="mt-1 text-sm text-slate-400">This usually takes a few seconds.</div>
              </div>
            </div>
          </main>
        );
      }
      
      
      if (formOutPut) {
        return (
          <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="mx-auto w-full max-w-[640px] space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      
                <div className="rounded-md border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Parsed output
                  </div>

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
        
                {/* Raw JSON*/}
                <div className="mt-6 rounded-md border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Raw output
                  </div>
      
                  <pre className="max-h-[300px] overflow-auto rounded-md bg-black/80 p-3 text-xs text-slate-200">
                    {JSON.stringify(formOutPut, null, 2)}
                  </pre>
                </div>
      
                {/* Reset */}
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
          <div className="mx-auto w-full max-w-[640px] space-y-6">
            {/* HEADER */}
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
