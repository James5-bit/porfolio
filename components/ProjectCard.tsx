"use client";
import { useState } from "react";
import type { Project } from "@/lib/data";
import Reveal from "./Reveal";

export default function ProjectCard({
  project,
  displayIndex,
}: {
  project: Project;
  displayIndex: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal className="project-card">
      <div className="project-top">
        <div className="project-visual">
          {project.image ? (
            <img src={project.image} alt={project.title} className="project-thumb" />
          ) : (
            <>
              <span className="glyph">// {project.title.toLowerCase().replace(/\s+/g, ".")}</span>
              <span className="num">{displayIndex}</span>
            </>
          )}
        </div>
        <div className="project-info">
          <div className="cat">{project.category}</div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="chip-row">
            {project.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="project-links">
            {project.links.map((l) => (
              <a href={l.href} key={l.label}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <button className="toggle-case" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide case study" : "View case study"}{" "}
        <span className="chev" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          ⌄
        </span>
      </button>
      <div className={`case-body ${open ? "open" : ""}`}>
        <div className="case-inner">
          <div className="case-block">
            <h4>Overview</h4>
            <p>{project.overview}</p>
          </div>
          <div className="case-block">
            <h4>Architecture</h4>
            <p>{project.architecture}</p>
          </div>
          <div className="case-block">
            <h4>Challenges</h4>
            <ul>
              {project.challenges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="case-block">
            <h4>Results</h4>
            <p>{project.results}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
