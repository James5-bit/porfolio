import { getAll } from "@/lib/listStore";
import type { Skill } from "@/lib/data";
import Reveal from "./Reveal";

export default async function Skills() {
  const skills = await getAll<Skill>("skills");

  return (
    <section className="section" id="skills">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Skills</div>
          <h2>What I work with</h2>
          <p>
            A full-stack toolkit built for shipping real products — from interface to
            infrastructure to automation.
          </p>
        </Reveal>
        <div className="skills-grid">
          {skills.map((s) => (
            <Reveal key={s.id} className="skill-card">
              <div className="icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <div className="chip-row">
                {s.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
