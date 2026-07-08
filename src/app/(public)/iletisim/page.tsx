import { ContactForm } from "@/components/forms/ContactForm";
import { getPageContent, getSiteSettings } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
};

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("iletisim"),
  ]);
  return <ContactForm settings={settings} page={page} />;
}
