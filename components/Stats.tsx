import Reveal from "./Reveal";

export default function Stats({ stats }: { stats: { num: string; label: string }[] }) {
  return (
    <section className="stats">
      <div className="wrap stats-grid">
        {stats.map((s) => (
          <Reveal key={s.label} className="stat-card">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
