import type { Metadata } from "next";
import "./globals.css";
import "../styles/site-index.css";

export const metadata: Metadata = {
  title: "LAGOM İnşaat Şirketi: Lviv Yakınlarında Satılık Villalar",
  description:
    "Konfor ve premium sınıf villalar. ✓Güvenli bölge, ✓profesyonel peyzaj, ✓kendi yönetim şirketi, ✓ergonomik planlama. 093 606 0300",
  icons: {
    icon: [
      { url: "/seo/favicon.webp", sizes: "32x32" },
      { url: "/seo/favicon.webp", sizes: "192x192" },
    ],
    apple: "/seo/favicon.webp",
  },
  openGraph: {
    images: ["/seo/og-logo-black.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
