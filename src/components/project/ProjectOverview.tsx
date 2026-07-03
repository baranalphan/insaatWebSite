import { RevealText } from "@/components/site/effects";
import type { ProjectPageData } from "./data";

export function ProjectOverview({ data }: { data: ProjectPageData }) {
  return (
    <section
      className="overview"
      data-reveal-text-start-trigger=""
      data-pin=""
      data-options='{"start": "0% 0%", "pinSpacing": false}'
    >
      <div className="container">
        <div className="container-index">005</div>
        <div className="container-text" data-speed="1.1">
          <RevealText
            as="h2"
            className="mulish-80"
            text={data.overviewTitle}
            options='{"start": "0% 50%", "end": "100% 50%"}'
          />
        </div>
      </div>
    </section>
  );
}
