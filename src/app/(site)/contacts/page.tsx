import type { Metadata } from "next";
import "@/styles/site-contacts.css";
import { ContactsLocations } from "@/components/contacts/ContactsLocations";

export const metadata: Metadata = {
  title: "Lagom Development: Контакти",
  description:
    "Запишіться на огляд вашого майбутнього будинку вже сьогодні +38 093 60 60 300! Життя у гармонії - життя у LAGOM!",
};

export default function ContactsPage() {
  return (
    <main>
      <ContactsLocations />
    </main>
  );
}
