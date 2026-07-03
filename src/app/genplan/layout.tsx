import type { Metadata } from "next";
import "@/styles/genplan/s3d.css";
import "@/styles/genplan/s3d2.css";
import "@/styles/genplan/clone-glue.css";

export const metadata: Metadata = {
  title: "3d – lagom",
};

export default function GenplanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
