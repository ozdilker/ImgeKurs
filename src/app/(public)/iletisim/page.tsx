import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactForm settings={settings} />;
}
