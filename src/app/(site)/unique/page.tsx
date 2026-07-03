import type { Metadata } from "next";
import "@/styles/site-lagom.css";
import { uniqueData } from "@/components/project/data";
import { ProjectIntro } from "@/components/project/ProjectIntro";
import { ProjectPreview } from "@/components/project/ProjectPreview";
import { ProjectDescription } from "@/components/project/ProjectDescription";
import { ProjectVideo } from "@/components/project/ProjectVideo";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectInteractive } from "@/components/project/ProjectInteractive";
import { ProjectInfrastructure } from "@/components/project/ProjectInfrastructure";
import { ProjectMedia } from "@/components/project/ProjectMedia";
import { ProjectCharacteristics } from "@/components/project/ProjectCharacteristics";
import { ProjectCtaForm } from "@/components/project/ProjectCtaForm";

export const metadata: Metadata = {
  title: "LAGOM'dan UNIQUE Rezidans Kompleksi",
  description:
    "Lviv yakınlarında göl manzaralı rezidanslar. Premium sınıf proje. ✓Güvenli bölge, ✓profesyonel peyzaj, ✓kendi yönetim şirketi. 073 70 60 300",
};

export default function UniquePage() {
  return (
    <main>
      <ProjectIntro data={uniqueData} />
      <ProjectPreview data={uniqueData} />
      <ProjectDescription data={uniqueData} />
      <ProjectVideo data={uniqueData} />
      <ProjectOverview data={uniqueData} />
      <ProjectGallery data={uniqueData} />
      <ProjectInteractive />
      <ProjectInfrastructure />
      <ProjectMedia data={uniqueData} />
      <ProjectCharacteristics data={uniqueData} />
      <ProjectCtaForm />
    </main>
  );
}
