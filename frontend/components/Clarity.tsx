"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { initClarity } from "@/lib/clarity";

export default function ClarityProvider() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") || initialized.current) {
      return;
    }

    initClarity();
    initialized.current = true;
  }, [pathname]);

  return null;
}
