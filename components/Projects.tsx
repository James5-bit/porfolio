import { getProjects } from "@/lib/projectsStore";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Featured Work</div>
          <h2>Selected projects</h2>
          <p>
            Case studies from systems I&apos;ve designed and built end-to-end — expand any card for
            architecture, challenges, and results.
          </p>
        </Reveal>
        {projects.length === 0 && (
          <p style={{ color: "var(--ink-dim)" }}>
            No projects yet — add one from the <a href="/admin">admin page</a>.
          </p>
        )}
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} displayIndex={String(i + 1).padStart(2, "0")} />
        ))}
      </div>
    </section>
  );
}
