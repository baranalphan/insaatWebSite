import type { Metadata } from "next";
import "@/styles/site-lagom.css";
import { lagomData } from "@/components/project/data";
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
  title: "LAGOM: Lviv Yakınlarında Göl Kenarında Villa Kent",
  description:
    "Lviv yakınlarında, Sokilnyky köyünde göl kenarında villa kent. Faizsiz taksit imkanı. ✓Güvenli bölge, ✓profesyonel peyzaj, ✓kendi yönetim şirketi. 093 606 0300",
};

export default function LagomPage() {
  return (
    <main>
      <ProjectIntro data={lagomData} />
      <ProjectPreview data={lagomData} />
      <ProjectDescription data={lagomData} />
      <ProjectVideo data={lagomData} />
      <ProjectOverview data={lagomData} />
      <ProjectGallery data={lagomData} />
      <ProjectInteractive />
      <ProjectInfrastructure />
      <ProjectMedia data={lagomData} />
      <ProjectCharacteristics data={lagomData} />
      <ProjectCtaForm />
    </main>
  );
}
