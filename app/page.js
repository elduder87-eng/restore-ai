"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Dashboard from "./dashboard/page";

export default function Home() {

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500); // length of intro

    return () => clearTimeout(timer);

  }, []);

  if (showIntro) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}
