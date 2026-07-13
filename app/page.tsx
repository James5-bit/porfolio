import Atmosphere from "@/components/Atmosphere";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import GithubSection from "@/components/GithubSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/contentStore";
import { getAll } from "@/lib/listStore";
import type { TimelineItem } from "@/lib/data";

// Always re-read the JSON data files on each request so admin edits show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const experience = await getAll<TimelineItem>("experience");
  const certificates = await getAll<TimelineItem>("certificates");

  return (
    <>
      <Atmosphere />
      <Nav />
      <Hero content={content.hero} />
      <Stats stats={content.stats} />
      <About about={content.about} />
      <Skills />
      <Projects />
      <Timeline id="experience" eyebrow="Experience" heading="Where I've applied it" items={experience} />
      <Timeline id="certificates" eyebrow="Certificates" heading="Continuous learning" items={certificates} />
      <GithubSection github={content.github} />
      <Contact contact={content.contact} />
      <Footer />
    </>
  );
}
