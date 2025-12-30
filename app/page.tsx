"use client";
import Image from "next/image";
import Link from "next/link";
import Form from "./components/form";
import { useState } from "react";
import type { CampaignType, UserContext } from '@/app/lib/types/campaign';



export default function Home() {
      const [userContext, setUserContext] = useState<UserContext>({
          campaignType: "Audience", 
          description: '',
          industry: ''
      });

      async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        console.log("SUBMITED USER CONTEXT -->", userContext)
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userContext })
        })

        const data = await res.json();
        console.log("API RETURN", data)
      }



  return (
    <div className="">


      <Form userContext={userContext} setUserContext={setUserContext} handleSubmit={handleSubmit}/>

        
    </div>
  );
}
