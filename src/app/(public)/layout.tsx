import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCourses, getSiteSettings } from "@/lib/firebase/firestore";
import { coursesToMenuItems } from "@/lib/courses";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    getCourses(),
  ]);
  const courseMenuItems = coursesToMenuItems(courses);

  return (
    <>
      <Header settings={settings} courseMenuItems={courseMenuItems} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
