export function ProjectInteractive() {
  return (
    <section className="interactive">
      <div className="interactive-map fit-cover" data-source="">
        <iframe src="/genplan" title="Генплан" style={{ width: "100%" }} />
      </div>
    </section>
  );
}
