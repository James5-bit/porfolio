"use client";
import { useRef } from "react";
import Magnetic from "./Magnetic";

type HeroContent = {
  statusText: string;
  headlinePrefix: string;
  headlineHighlight: string;
  lead: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
};

const nodes = [
  { cls: "n1 d1", color: "#7C5CFF", label: "REST API" },
  { cls: "n2 d2", color: "#A78BFA", label: "AI Model" },
  { cls: "n3 d3", color: "#34D399", label: "PostgreSQL" },
  { cls: "n4 d4", color: "#7C5CFF", label: "Automation" },
  { cls: "n5 d5", color: "#A78BFA", label: "Cloud Deploy" },
  { cls: "n6 d6", color: "#34D399", label: "Next.js UI" },
];

const paths = [
  "M90,70 C180,90 220,150 280,240",
  "M470,60 C400,110 330,150 280,240",
  "M40,240 C120,240 200,240 280,240",
  "M120,400 C180,340 230,300 280,240",
  "M480,410 C400,360 330,300 280,240",
  "M520,240 C440,240 350,240 280,240",
];
const dots = ["#A78BFA", "#7C5CFF", "#34D399", "#A78BFA", "#7C5CFF", "#34D399"];
const durations = [3.4, 4.1, 3.8, 4.6, 3.9, 4.3];

export default function Hero({ content }: { content: HeroContent }) {
  const visualRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    const visual = visualRef.current;
    if (!el || !visual) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    visual.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const handleLeave = () => {
    if (visualRef.current) visualRef.current.style.transform = "rotateY(0) rotateX(0)";
  };

  return (
    <header className="hero" ref={heroRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="wrap hero-grid">
        <div>
          <div className="status-pill reveal is-visible">
            <span className="dot-live"></span> {content.statusText}
          </div>
          <h1 className="reveal is-visible">
            {content.headlinePrefix} <span className="grad">{content.headlineHighlight}</span>
          </h1>
          <p className="lead reveal is-visible">{content.lead}</p>
          <div className="hero-ctas reveal is-visible">
            <Magnetic href="#projects" className="btn btn-primary">
              View Projects →
            </Magnetic>
            <Magnetic href={content.resumeUrl} className="btn btn-ghost">
              ↓ Download Resume
            </Magnetic>
            <Magnetic href={content.githubUrl} className="btn-icon">
              <GitHubIcon />
            </Magnetic>
            <Magnetic href={content.linkedinUrl} className="btn-icon">
              <LinkedInIcon />
            </Magnetic>
          </div>
          <div className="scroll-cue">
            <div className="mouse"></div> SCROLL TO EXPLORE
          </div>
        </div>

        <div className="hero-visual reveal is-visible" ref={visualRef}>
          <div className="graph-card">
            <svg viewBox="0 0 560 480" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7C5CFF" stopOpacity=".55" />
                  <stop offset="1" stopColor="#A78BFA" stopOpacity=".15" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#lineGrad)" strokeWidth="1.4">
                {paths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
              {paths.map((d, i) => (
                <circle key={i} r="3.4" fill={dots[i]}>
                  <animateMotion dur={`${durations[i]}s`} repeatCount="indefinite" path={d} />
                </circle>
              ))}
              <circle cx="280" cy="240" r="34" fill="rgba(124,92,255,0.15)" stroke="#7C5CFF" strokeWidth="1.4" />
              <circle cx="280" cy="240" r="34" fill="none" stroke="#7C5CFF" strokeWidth="1" opacity=".5">
                <animate attributeName="r" values="34;52;34" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".5;0;.5" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
            {nodes.map((n) => (
              <div key={n.label} className={`node-label float-y ${n.cls}`}>
                <span className="ico" style={{ background: n.color }}></span>
                {n.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.2 5.4 18.3.5 12 .5Z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1s2.48 1.1 2.48 2.5ZM.24 8.24h4.5V23H.24V8.24ZM8.6 8.24h4.3v2h.06c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V23h-4.5v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V23H8.6V8.24Z" />
    </svg>
  );
}
