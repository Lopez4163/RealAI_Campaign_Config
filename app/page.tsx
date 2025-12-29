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



  return (
    <div className="">


      <Form userContext={userContext} setUserContext={setUserContext}/>
      {/* <Link href="/formoutput" className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Output test Route</Link> */}

        
    </div>
  );
}
