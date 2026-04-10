"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return <div className="p-8 text-center text-sm text-slate-500">Loading dashboard...</div>;
}
