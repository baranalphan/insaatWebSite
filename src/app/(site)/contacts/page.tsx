import type { Metadata } from "next";
import "@/styles/site-contacts.css";
import { ContactsLocations } from "@/components/contacts/ContactsLocations";

export const metadata: Metadata = {
  title: "Lagom Development: İletişim",
  description:
    "Gelecekteki evinizi görmek için bugünden randevu alın +38 093 60 60 300! Uyum içinde yaşam - LAGOM'da yaşam!",
};

export default function ContactsPage() {
  return (
    <main>
      <ContactsLocations />
    </main>
  );
}
