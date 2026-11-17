"use client";

import { useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Fraunces } from "next/font/google";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!message.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your feedback before sending.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setStatusMessage("Thanks for the feedback — we read every message.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage("We could not send that. Please email feedback@edudashpro.org.za instead.");
    }
  };

  return (
    <div className={`${styles.page} ${spaceGrotesk.variable} ${fraunces.variable}`}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>Feedback</div>
              <h1 className={styles.heroTitle}>Tell us what&apos;s working — and what isn&apos;t.</h1>
              <p className={styles.heroLead}>
                Bug reports, feature requests, or just a thought on how EduDash Pro could be better.
                A real person on our team reads every submission.
              </p>
              <ul className={styles.heroList}>
                <li>Bug reports and glitches</li>
                <li>Feature requests</li>
                <li>General thoughts on the platform</li>
              </ul>
            </div>
            <form className={styles.formCard} onSubmit={handleSubmit}>
              <label className={styles.formLabel} htmlFor="feedback-name">
                Name (optional)
              </label>
              <input
                id="feedback-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={styles.formInput}
              />
              <label className={styles.formLabel} htmlFor="feedback-email">
                Email
              </label>
              <input
                id="feedback-email"
                type="email"
                placeholder="you@school.org"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.formInput}
              />
              <label className={styles.formLabel} htmlFor="feedback-message">
                Your feedback
              </label>
              <textarea
                id="feedback-message"
                placeholder="What would you like us to know?"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={styles.formTextarea}
              />
              <button type="submit" className={styles.formButton} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send feedback"}
              </button>
              {statusMessage && (
                <p className={status === "success" ? styles.formSuccess : styles.formError}>
                  {statusMessage}
                </p>
              )}
              <p className={styles.formHint}>
                Prefer email? Reach us at <strong>feedback@edudashpro.org.za</strong>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
