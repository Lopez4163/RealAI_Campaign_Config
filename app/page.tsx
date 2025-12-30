"use client";
import Image from "next/image";
import Link from "next/link";
import Form from "./components/form";
import { useState } from "react";
import type { CampaignType, UserContext } from '@/app/lib/types/campaign';



export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "audience", 
          description: '',
          industry: ''
      });
      const [error, setError] = useState(false)




      async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        setError(false);        
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
        } catch(err) {
            setError(true);
            console.log("FETCH ERROR",err)
        }
      }


  return (
  <div className="min-h-screen bg-[#4B95D6] flex flex-col items-center px-4 pb-10">
    {/* HEADER */}
    <div className="w-full max-w-[640px] text-center mt-6">
      <h1 className="text-[#F4F06A] font-extrabold tracking-wide
                    text-4xl sm:text-5xl md:text-5xl">
        CAMPAIGN CONFIGURATOR
      </h1>

      <div className="mt-3 text-[#F4F06A] font-extrabold tracking-wide
                      text-xl sm:text-2xl md:text-2xl">
        POWERED BY <span className="text-white">REAL.AI</span>
      </div>

      <div className="mt-6 h-[3px] bg-white/45 w-full rounded-full" />
    </div>

    <Form
      userContext={userContext}
      setUserContext={setUserContext}
      handleSubmit={handleSubmit}
      error={error}
    />
  </div>
  );
}
