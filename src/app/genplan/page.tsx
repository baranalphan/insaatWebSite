"use client";

import { Suspense } from "react";
import { GenplanApp } from "@/components/genplan/GenplanApp";

export default function GenplanPage() {
  return (
    <Suspense fallback={null}>
      <GenplanApp />
    </Suspense>
  );
}
