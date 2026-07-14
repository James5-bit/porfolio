import Reveal from "./Reveal";

type AboutContent = {
  locationTag: string;
  paragraphs: string[];
  education: string;
  location: string;
  email: string;
  availability: string;
};

// Renders **bold** markdown-style segments as <strong> without a full markdown parser.
function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function About({ about }: { about: AboutContent }) {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <Reveal className="portrait-frame">
          <img src="/images/portrait.png" alt="James Peñero" className="portrait-photo" />
          <div className="tag">{about.locationTag}</div>
        </Reveal>
        <div className="about-body">
          <Reveal className="eyebrow">About</Reveal>
          <Reveal>
            <h2 style={{ fontSize: 34, fontWeight: 800, margin: "14px 0 20px", letterSpacing: "-.02em" }}>
              Who I am
            </h2>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i}>
              <p>{renderBold(p)}</p>
            </Reveal>
          ))}
          <div className="meta-list">
            <Reveal className="meta-item">
              <div className="k">Education</div>
              <div className="v">{about.education}</div>
            </Reveal>
            <Reveal className="meta-item">
              <div className="k">Location</div>
              <div className="v">{about.location}</div>
            </Reveal>
            <Reveal className="meta-item">
              <div className="k">Email</div>
              <div className="v">{about.email}</div>
            </Reveal>
            <Reveal className="meta-item">
              <div className="k">Availability</div>
              <div className="v live">{about.availability}</div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
