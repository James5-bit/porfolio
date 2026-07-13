"use client";
import { useMemo } from "react";
import Reveal from "./Reveal";

type GithubContent = {
  contributions: string;
  repos: string;
  stars: string;
  languages: { name: string; pct: number; color: string }[];
};

export default function GithubSection({ github }: { github: GithubContent }) {
  // Deterministic pseudo-random contribution intensities (stable across server/client render)
  const cells = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 364 }, () => rand());
  }, []);

  const shade = (r: number) => {
    if (r > 0.9) return "rgba(124,92,255,.85)";
    if (r > 0.75) return "rgba(124,92,255,.5)";
    if (r > 0.55) return "rgba(124,92,255,.25)";
    return "var(--border)";
  };

  return (
    <section className="section" id="github">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">GitHub</div>
          <h2>Open-source activity</h2>
        </Reveal>
        <Reveal className="gh-panel">
          <div className="gh-top">
            <div className="gh-stats">
              <div className="gh-stat">
                <b>{github.contributions}</b>
                <span>Contributions this year</span>
              </div>
              <div className="gh-stat">
                <b>{github.repos}</b>
                <span>Repositories</span>
              </div>
              <div className="gh-stat">
                <b>{github.stars}</b>
                <span>Stars earned</span>
              </div>
            </div>
          </div>
          <div className="contrib-scroll">
            <div className="contrib-grid">
              {cells.map((r, i) => (
                <div key={i} className="contrib-cell" style={{ background: shade(r) }} />
              ))}
            </div>
          </div>
          <div className="lang-bar">
            {github.languages.map((l) => (
              <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
            ))}
          </div>
          <div className="lang-legend">
            {github.languages.map((l) => (
              <span key={l.name}>
                <span className="dot" style={{ background: l.color }}></span>
                {l.name} {l.pct}%
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
