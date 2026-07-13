"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

type ContactContent = {
  email: string;
  availabilityText: string;
  githubUrl: string;
  linkedinUrl: string;
};

export default function Contact({ contact }: { contact: ContactContent }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your form handler / API route (e.g. app/api/contact/route.ts)
    setSent(true);
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Contact</div>
          <h2>Let&apos;s build something</h2>
          <p>Open to internships, junior full-stack roles, and freelance automation projects.</p>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@company.com" required />
              </div>
              <div className="field">
                <label htmlFor="msg">Message</label>
                <textarea id="msg" placeholder="Tell me about the role or project..." required />
              </div>
              <Magnetic type="submit" className="btn btn-primary">
                {sent ? "Message sent ✓" : "Send message →"}
              </Magnetic>
            </form>
          </Reveal>
          <Reveal className="contact-side">
            <div className="side-card">
              <div className="k">Availability</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                <span
                  className="dot-live"
                  style={{ animation: "none", boxShadow: "0 0 0 3px rgba(52,211,153,.18)" }}
                ></span>
                {contact.availabilityText}
              </div>
            </div>
            <div className="side-card">
              <div className="k">Email</div>
              <div>{contact.email}</div>
            </div>
            <div className="side-card">
              <div className="k">Connect</div>
              <div className="social-row">
                <Magnetic href={contact.githubUrl} className="btn-icon">
                  <GitHubIcon />
                </Magnetic>
                <Magnetic href={contact.linkedinUrl} className="btn-icon">
                  <LinkedInIcon />
                </Magnetic>
                <Magnetic href={`mailto:${contact.email}`} className="btn-icon">
                  <MailIcon />
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.2 5.4 18.3.5 12 .5Z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1s2.48 1.1 2.48 2.5ZM.24 8.24h4.5V23H.24V8.24ZM8.6 8.24h4.3v2h.06c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V23h-4.5v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V23H8.6V8.24Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
