import Reveal from "./Reveal";

type Item = { id: string; tag: string; title: string; body: string };

export default function Timeline({
  id,
  eyebrow,
  heading,
  items,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  items: Item[];
}) {
  return (
    <section className="section" id={id}>
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">{eyebrow}</div>
          <h2>{heading}</h2>
        </Reveal>
        <div className="timeline">
          {items.map((it) => (
            <Reveal key={it.id} className="tl-item">
              <div className="tl-tag">{it.tag}</div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
