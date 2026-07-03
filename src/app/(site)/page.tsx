import "@/styles/site-home.css";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeProjects } from "@/components/home/HomeProjects";
import { HomeLocations } from "@/components/home/HomeLocations";
import { HomeOverview } from "@/components/home/HomeOverview";
import { HomeAccordion } from "@/components/home/HomeAccordion";
import { HomeCtaForm } from "@/components/home/HomeCtaForm";

export default function Home() {
  return (
    <main>
      <HomeIntro />
      <HomeBenefits />
      <HomeProjects />
      <HomeLocations />
      <HomeOverview />
      <HomeAccordion />
      <HomeCtaForm />
    </main>
  );
}
