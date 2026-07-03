import { PopupProvider } from "@/components/site/Popups";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SmoothScroll } from "@/components/site/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PopupProvider>
      <SiteHeader />
      <SmoothScroll>
        {children}
        <SiteFooter />
      </SmoothScroll>
    </PopupProvider>
  );
}
