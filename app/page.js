"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Dashboard from "./dashboard/page";

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3500);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}
