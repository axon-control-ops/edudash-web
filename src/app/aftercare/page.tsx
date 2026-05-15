import Link from "next/link";
import { ArrowRight, CheckCircle, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import styles from "./page.module.css";

const SCHOOL_SIGN_UP_URL = "https://app.edudashpro.org.za/sign-up/principal";

const highlights = [
  "Daily check-in and attendance tracking",
  "Guided homework support and reading time",
  "Structured pickup coordination with guardian communication",
];

const timeline = [
  {
    time: "13:30 - 14:15",
    title: "Check-in and snack",
    copy: "Children settle in, attendance is confirmed, and the afternoon starts in a calm routine.",
  },
  {
    time: "14:15 - 15:15",
    title: "Homework support",
    copy: "Supervised homework time gives families a clearer after-school handoff and better follow-through.",
  },
  {
    time: "15:15 - 16:15",
    title: "Enrichment block",
    copy: "Reading, clubs, and movement breaks keep the programme useful rather than just supervisory.",
  },
  {
    time: "16:15 - 17:00",
    title: "Pickup window",
    copy: "Verified handover and guardian communication close the day safely.",
  },
];

export default function AftercarePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <div className={styles.eyebrow}>Aftercare</div>
          <h1 className={styles.title}>A structured, safe aftercare offer for Grades R-7.</h1>
          <p className={styles.lead}>
            EduDash Pro can market aftercare clearly instead of hiding it as a single feature bullet. This
            page makes the offer visible: homework support, secure pickup coordination, and family updates.
          </p>
          <div className={styles.heroActions}>
            <Link href="/registration" className={styles.primaryCta}>
              Go to registration options <ArrowRight size={16} />
            </Link>
            <a href={SCHOOL_SIGN_UP_URL} target="_blank" rel="noopener" className={styles.secondaryCta}>
              Register your school <ArrowRight size={16} />
            </a>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <Clock3 size={18} />
                <span>Programme highlights</span>
              </div>
              <ul className={styles.list}>
                {highlights.map((item) => (
                  <li key={item}>
                    <CheckCircle size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.panelAccent}>
              <div className={styles.statRow}>
                <div>
                  <strong>Clearer pitch</strong>
                  <span>Families can immediately see this is an aftercare-specific path.</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <div>
                  <strong>Separate from school onboarding</strong>
                  <span>Main EduDash Pro registration stays focused on principals and admin teams.</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <div>
                  <strong>Better handover</strong>
                  <span>Attendance, homework support, and pickup messaging are part of the story.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span>What families need to know</span>
            <h2>Aftercare is being marketed explicitly now.</h2>
            <p>
              The message is no longer generic. It focuses on supervised afternoons, safety, and guardian
              communication instead of making parents infer what the programme includes.
            </p>
          </div>

          <div className={styles.cards}>
            <article className={styles.infoCard}>
              <MessageSquareText size={20} />
              <h3>Parent communication</h3>
              <p>Updates about attendance, handover, and programme flow can be clearly positioned here.</p>
            </article>
            <article className={styles.infoCard}>
              <ShieldCheck size={20} />
              <h3>Safety and pickup</h3>
              <p>Secure pickup coordination is a core selling point, not a footnote buried in the app copy.</p>
            </article>
            <article className={styles.infoCard}>
              <Clock3 size={20} />
              <h3>Structured afternoons</h3>
              <p>Homework time, enrichment, and handover make the offer legible to both schools and families.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span>Typical day</span>
            <h2>Simple, predictable programme flow.</h2>
          </div>
          <div className={styles.timeline}>
            {timeline.map((item) => (
              <article key={item.time} className={styles.timelineCard}>
                <div className={styles.time}>{item.time}</div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
