import type { Metadata } from "next";
import "./globals.css";
import "../styles/site-index.css";

export const metadata: Metadata = {
  title: "Будівельна компанія LAGOM: Продаж будинків поблизу Львова",
  description:
    "Котеджі комфорт та преміум класу. ✓Безпека території, ✓професійний ландшафт, ✓власна управляюча компанія, ✓ергономічні планування. 093 606 0300",
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
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
