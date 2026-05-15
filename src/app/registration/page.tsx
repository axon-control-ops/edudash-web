import Link from "next/link";
import { ArrowRight, Building2, CheckCircle, Clock3 } from "lucide-react";
import styles from "./page.module.css";

const SCHOOL_SIGN_UP_URL = "https://app.edudashpro.org.za/sign-up/principal";

export default function RegistrationPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <div className={styles.eyebrow}>Registration</div>
          <h1 className={styles.title}>Choose the right registration path.</h1>
          <p className={styles.lead}>
            School onboarding and aftercare interest are now clearly separated. If you are creating the
            main EduDash Pro school account, use the school registration route. If you are looking for the
            aftercare programme, start on the aftercare page first.
          </p>

          <div className={styles.grid}>
            <article className={styles.card}>
              <div className={styles.iconWrap}>
                <Building2 size={22} />
              </div>
              <h2>Main school registration</h2>
              <p>
                This path is for principals, owners, and school administrators setting up the main EduDash
                Pro school workspace.
              </p>
              <ul className={styles.list}>
                <li><CheckCircle size={16} /> School account setup</li>
                <li><CheckCircle size={16} /> Staff, learner, and billing workflows</li>
                <li><CheckCircle size={16} /> Dash AI, attendance, and communication tools</li>
              </ul>
              <a href={SCHOOL_SIGN_UP_URL} target="_blank" rel="noopener" className={styles.primaryCta}>
                Open school signup <ArrowRight size={16} />
              </a>
              <p className={styles.linkNote}>{SCHOOL_SIGN_UP_URL}</p>
            </article>

            <article className={styles.cardAlt}>
              <div className={styles.iconWrapAlt}>
                <Clock3 size={22} />
              </div>
              <h2>Aftercare programme</h2>
              <p>
                This path is for families or schools specifically enquiring about the structured aftercare
                offer, supervised homework time, and secure pickup flow.
              </p>
              <ul className={styles.list}>
                <li><CheckCircle size={16} /> Dedicated aftercare programme details</li>
                <li><CheckCircle size={16} /> Family-facing messaging and expectations</li>
                <li><CheckCircle size={16} /> Separate route from the main school onboarding flow</li>
              </ul>
              <Link href="/aftercare" className={styles.secondaryCta}>
                View aftercare page <ArrowRight size={16} />
              </Link>
            </article>
          </div>

          <div className={styles.notice}>
            <strong>Important:</strong> this repo is the marketing site. It now makes the two flows explicit,
            but it does not own the app database logic behind the app-side signup flow.
          </div>
        </div>
      </section>
    </main>
  );
}
