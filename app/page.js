"use client";

import { useEffect, useState } from "react";
import Dashboard from "./dashboard/page";

export default function Home() {

  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const timer = setTimeout(()=>{

      setLoading(false);

    },3500);

    return ()=>clearTimeout(timer);

  },[]);


  if(loading){

    return(

      <div className="intro-screen">

        <div className="intro-particles"></div>

        <div className="intro-light"></div>

        <div className="seed-drop">🌱</div>

        <div className="intro-title">Restore</div>

        <div className="intro-subtitle">
          Where Understanding Grows
        </div>

      </div>

    );

  }

  return <Dashboard/>

}
