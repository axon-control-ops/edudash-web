"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import {
  Users, Sparkles, CreditCard,
  Shield, GraduationCap, Heart, CheckCircle, ArrowRight,
  BarChart3, BookOpen, Calendar, Globe, MessageSquare,
  Star, TrendingUp, Zap, ChevronDown, ChevronUp, Mic,
  FileText, ClipboardList, BellRing, Lock,
} from "lucide-react";
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

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.edudashpro.app";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const [earlyAccessSubmitting, setEarlyAccessSubmitting] = useState(false);
  const [earlyAccessSubmitted, setEarlyAccessSubmitted] = useState(false);
  const [earlyAccessError, setEarlyAccessError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<"principal" | "teacher" | "parent">("principal");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const navLinks = useMemo(
    () => [
      { id: "platform", label: "Platform" },
      { id: "roles", label: "For Schools" },
      { id: "ai", label: "Dash AI" },
      { id: "pricing", label: "Pricing" },
      { id: "faq", label: "FAQ" },
    ],
    []
  );

  // Intersection observer for stats section animation
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!elements.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add(styles.revealVisible));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setMobileMenuOpen(false); }
  };

  const handleEarlyAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!earlyAccessEmail || !earlyAccessEmail.includes("@")) {
      setEarlyAccessError("Please enter a valid email address");
      return;
    }
    setEarlyAccessSubmitting(true);
    setEarlyAccessError("");
    try {
      const supabase = createClient();
      await supabase.from("early_access_signups").insert({
        email: earlyAccessEmail, source: "homepage_v2", platform: "google_play",
      }).then(() => {});
      await fetch("/api/early-access-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: earlyAccessEmail }),
      }).catch(() => {});
      setEarlyAccessSubmitted(true);
    } catch {
      setEarlyAccessSubmitted(true);
    } finally {
      setEarlyAccessSubmitting(false);
    }
  };

  const roleContent = {
    principal: {
      headline: "Run your school from one command center",
      bullets: [
        "Real-time financial dashboard with fee collection and reminders",
        "Teacher management, seat allocation, and performance tracking",
        "AI year planner and CAPS-aligned curriculum tools",
        "WhatsApp business integration for parent communication",
        "Full audit trail and compliance reporting",
      ],
      cta: "Register your school",
      href: "https://app.edudashpro.org.za/sign-up/principal",
      color: "#7c3aed",
    },
    teacher: {
      headline: "Plan, teach, and report in half the time",
      bullets: [
        "AI lesson generator with CAPS-aligned learning outcomes",
        "Attendance tracking, homework assignment, and grading",
        "Dash AI voice tutor supports your learners between classes",
        "Video calls and parent messaging built in",
        "Exam and quiz creation with automatic marking",
      ],
      cta: "Start free trial",
      href: "https://app.edudashpro.org.za/sign-up/teacher",
      color: "#0891b2",
    },
    parent: {
      headline: "Stay connected to your child's education",
      bullets: [
        "Daily activity feed, progress reports, and attendance alerts",
        "Direct messaging with teachers and school admin",
        "School fee payments via PayFast — tracked and receipted",
        "Dash AI homework helper for after-school support",
        "Weekly learning summaries in plain language",
      ],
      cta: "Download the app",
      href: PLAY_STORE_URL,
      color: "#059669",
    },
  };

  const platformFeatures = [
    { icon: BarChart3, title: "School Analytics", desc: "Live dashboards for fees, attendance, and learner outcomes — no spreadsheets.", tag: "Admin" },
    { icon: Sparkles, title: "AI Lesson Studio", desc: "Generate full CAPS-aligned lesson plans, activities, and worksheets in minutes.", tag: "AI" },
    { icon: BookOpen, title: "Exam & Quiz Engine", desc: "Auto-generate, distribute, and mark assessments. Grade R through Matric.", tag: "Learning" },
    { icon: MessageSquare, title: "Messaging & Calls", desc: "Threaded parent-teacher messaging, voice notes, and video lessons in one place.", tag: "Comms" },
    { icon: CreditCard, title: "Fee Management", desc: "PayFast-integrated invoicing, proof-of-payment review, and automatic reminders.", tag: "Billing" },
    { icon: Calendar, title: "Daily Programme", desc: "Preschool routine planner with activity builder, menus, and display screens.", tag: "Preschool" },
    { icon: Globe, title: "11 SA Languages", desc: "Interface and Dash AI available in English, Afrikaans, isiZulu, isiXhosa, and more.", tag: "Localisation" },
    { icon: BellRing, title: "Smart Notifications", desc: "Push alerts for payments, messages, homework, and critical school events.", tag: "Engagement" },
    { icon: Mic, title: "Voice AI Tutor", desc: "Dash AI speaks with learners — phonics coaching, homework help, and encouragement.", tag: "AI" },
    { icon: FileText, title: "POPIA Compliance", desc: "Data stored in South Africa. Built-in consent flows and data deletion tools.", tag: "Compliance" },
    { icon: ClipboardList, title: "Aftercare Suite", desc: "Aftercare registrations, daily sign-in, and guardian comms fully automated.", tag: "Programs" },
    { icon: Lock, title: "Role-Based Access", desc: "Principal, teacher, parent, learner, and super-admin roles with scoped permissions.", tag: "Security" },
  ];

  const aiFeatures = [
    { title: "Lesson Plan Generator", desc: "Describe your learning goals, get a full 5-day plan with resources, activities, and assessment criteria.", icon: BookOpen },
    { title: "Exam Creator", desc: "Upload a topic or PDF. Dash AI generates structured exam papers with marking memos — any grade.", icon: FileText },
    { title: "Voice Tutor", desc: "Learners talk to Dash. Phonics coaching, homework explanations, and encouragement in their home language.", icon: Mic },
    { title: "Progress Insights", desc: "Weekly AI-generated summaries of class performance, engagement patterns, and recommended interventions.", icon: TrendingUp },
    { title: "Parent-Friendly Reports", desc: "Convert teacher assessments into plain-language parent summaries — in English, Afrikaans, or Zulu.", icon: Users },
    { title: "Homework Helper", desc: "Parents and learners ask questions after hours. Dash AI answers, explains, and scaffolds — never just solves.", icon: Sparkles },
  ];

  const stats = [
    { value: "2.4×", label: "faster lesson planning", sub: "vs manual methods" },
    { value: "94%", label: "attendance tracking rate", sub: "in active schools" },
    { value: "R399", label: "per month from", sub: "full school tier" },
    { value: "11", label: "SA official languages", sub: "supported in Dash AI" },
  ];

  const faqs = [
    { q: "Do I need the mobile app or the website?", a: "Schools and teachers use the web platform for administration. Parents and learners get the best experience on the mobile app (Android now, iOS coming soon). Both sync in real time." },
    { q: "Is EduDash Pro aligned with the CAPS curriculum?", a: "Yes. Lesson plans, exams, and activities are structured around CAPS learning outcomes for Grade R through Grade 12. Private and homeschool curricula are supported too." },
    { q: "How does billing work?", a: "Schools choose a monthly tier starting at R399. Parents pay separately for the parent app if their school hasn't included it. PayFast handles all South African payments securely." },
    { q: "Can parents use the platform without the school being registered?", a: "Parents can join as standalone users and use Dash AI, exam prep, and homework help independently. School features activate when a school admin links your account." },
    { q: "Is our school data stored in South Africa?", a: "Yes. EduDash Pro uses Supabase with a South African region. We are POPIA-compliant with consent flows, data deletion tools, and a full audit trail." },
    { q: "Can we trial before committing?", a: "Every new school gets a 14-day full-feature trial. No credit card required to start." },
  ];

  const competitors = [
    { feature: "CAPS-aligned AI lessons", us: true, gc: false, wa: false },
    { feature: "SA language support", us: true, gc: false, wa: false },
    { feature: "PayFast billing integration", us: true, gc: false, wa: false },
    { feature: "Voice AI tutor", us: true, gc: false, wa: false },
    { feature: "School fee management", us: true, gc: false, wa: false },
    { feature: "Preschool daily programme", us: true, gc: false, wa: false },
    { feature: "Parent-teacher messaging", us: true, gc: true, wa: true },
    { feature: "Assignment submission", us: true, gc: true, wa: false },
  ];

  return (
    <div className={`${styles.page} ${spaceGrotesk.variable} ${fraunces.variable}`}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundNoise} />

      {/* ── NAV ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Image src="/icon-192.png" alt="EduDash Pro" width={34} height={34} className={styles.brandLogo} />
            <span className={styles.brandText}>EduDash Pro</span>
          </div>
          <nav className={styles.navDesktop}>
            {navLinks.map((link) => (
              <button key={link.id} className={styles.navLink} onClick={() => scrollToSection(link.id)}>
                {link.label}
              </button>
            ))}
            <a href="https://app.edudashpro.org.za/sign-in" className={styles.primaryGhost}>Sign In</a>
            <Link href="/apply" className={styles.primarySolid}>Book Demo</Link>
          </nav>
          <button className={styles.navToggle} onClick={() => setMobileMenuOpen((p) => !p)} aria-label="Toggle menu">
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className={styles.navMobile}>
            {navLinks.map((link) => (
              <button key={link.id} className={styles.navLinkMobile} onClick={() => scrollToSection(link.id)}>
                {link.label}
              </button>
            ))}
            <div className={styles.navMobileCtas}>
              <a href="https://app.edudashpro.org.za/sign-in" className={styles.primaryGhost}>Sign In</a>
              <Link href="/apply" className={styles.primarySolid}>Book Demo</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              South Africa&apos;s AI-Powered School OS
            </div>
            <h1 className={styles.heroTitle}>
              One platform for every part of
              <span className={styles.heroTitleAccent}> your school.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              EduDash Pro unifies teaching, parent engagement, billing, AI tutoring, and school
              administration into one intelligent workspace — built for South African schools from day one.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/apply" className={styles.primarySolidLarge}>
                Book a live demo <ArrowRight size={16} />
              </Link>
              <Link href={PLAY_STORE_URL} target="_blank" rel="noopener" className={styles.appStoreCta}>
                <Image src="/icon-192.png" alt="" width={20} height={20} className={styles.appStoreCtaIcon} />
                Get the Android app
              </Link>
            </div>
            <div className={styles.heroPlatformNote}>
              <span>🖥️ Web platform for schools</span>
              <span className={styles.dividerDot}>·</span>
              <span>📱 Mobile app for parents &amp; learners</span>
              <span className={styles.dividerDot}>·</span>
              <span>🤖 Dash AI everywhere</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className={`${styles.heroVisual} ${styles.reveal}`} data-reveal>
            <div className={styles.dashboardPreview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDots}><span /><span /><span /></div>
                <span className={styles.previewTitle}>EduDash Pro — Principal Dashboard</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewSidebar}>
                  {["Dashboard","Students","Teachers","Attendance","Lessons","Finances","Messages","Dash AI"].map((item, i) => (
                    <div key={item} className={styles.previewNavItem} style={{ opacity: i === 0 ? 1 : 0.55 }}>{item}</div>
                  ))}
                </div>
                <div className={styles.previewContent}>
                  <div className={styles.previewStatRow}>
                    {[{v:"312",l:"Learners"},{v:"94%",l:"Attendance"},{v:"R48.2k",l:"Fees due"},{v:"7",l:"AI reports"}].map(s => (
                      <div key={s.l} className={styles.previewStat}><span>{s.v}</span><small>{s.l}</small></div>
                    ))}
                  </div>
                  <div className={styles.previewChartArea}>
                    <div className={styles.previewChartLabel}>Monthly fee collection</div>
                    <div className={styles.previewBars}>
                      {[0.55,0.7,0.48,0.9,0.82,0.65,0.95].map((h,i) => (
                        <div key={i} style={{ height: `${h*100}%`, animationDelay: `${i*0.1}s` }} className={styles.previewBar} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.previewActivityRow}>
                    {[
                      { dot:"#7c3aed", text:"Dash AI — 4 lesson suggestions ready" },
                      { dot:"#22d3ee", text:"Fee reminder sent — 38 families" },
                      { dot:"#22c55e", text:"Grade 5 exam marked — avg 68%" },
                    ].map(a => (
                      <div key={a.text} className={styles.previewActivity}>
                        <div className={styles.previewActivityDot} style={{ background: a.dot }} />
                        <span>{a.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.videoCaption}>Principal dashboard — live attendance, fees, AI insights, and communication in one view.</p>
          </div>
        </section>

        {/* ── STATS ── */}
        <div ref={statsRef} className={`${styles.statsStrip} ${statsVisible ? styles.statsVisible : ""}`}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── PLATFORM FEATURES ── */}
        <section id="platform" className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`} data-reveal>
            <span>Core platform</span>
            <h2>Everything your school needs in one intelligent workspace.</h2>
            <p>Replace disconnected tools — WhatsApp groups, Excel sheets, paper registers — with a unified, high-signal system for staff and families.</p>
          </div>
          <div className={styles.featureGrid}>
            {platformFeatures.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className={`${styles.featureCard} ${styles.reveal}`} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
                  <div className={styles.featureCardTop}>
                    <div className={styles.featureIcon}><Icon size={20} strokeWidth={1.8} /></div>
                    <div className={styles.featureTag}>{card.tag}</div>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── ROLE TABS ── */}
        <section id="roles" className={styles.sectionAlt}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`} data-reveal>
            <span>Built for every role</span>
            <h2>One platform, tailored for your job.</h2>
            <p>Principals, teachers, and parents each get a focused experience without fragmenting the school&apos;s data.</p>
          </div>
          <div className={styles.roleTabs}>
            {(["principal","teacher","parent"] as const).map((role) => (
              <button
                key={role}
                className={`${styles.roleTab} ${activeRole === role ? styles.roleTabActive : ""}`}
                onClick={() => setActiveRole(role)}
              >
                {role === "principal" && <Shield size={16} />}
                {role === "teacher" && <GraduationCap size={16} />}
                {role === "parent" && <Heart size={16} />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.rolePanel}>
            <div className={styles.rolePanelContent}>
              <h3 style={{ color: roleContent[activeRole].color }}>{roleContent[activeRole].headline}</h3>
              <ul className={styles.roleBullets}>
                {roleContent[activeRole].bullets.map((b) => (
                  <li key={b}><CheckCircle size={16} color={roleContent[activeRole].color} />{b}</li>
                ))}
              </ul>
              <Link href={roleContent[activeRole].href} className={styles.roleCta} style={{ background: roleContent[activeRole].color }}>
                {roleContent[activeRole].cta} <ArrowRight size={14} />
              </Link>
            </div>
            <div className={styles.rolePanelVisual}>
              {activeRole === "principal" && (
                <div className={styles.roleMockup}>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Total learners</span><strong>312</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Teachers active</span><strong>18</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Fees collected (MTD)</span><strong>R124,800</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Outstanding fees</span><strong style={{color:"#f59e0b"}}>R48,200</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>AI lessons this week</span><strong style={{color:"#7c3aed"}}>47 generated</strong></div>
                </div>
              )}
              {activeRole === "teacher" && (
                <div className={styles.roleMockup}>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>My class</span><strong>Grade 4A — 32 learners</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Today&apos;s attendance</span><strong style={{color:"#22c55e"}}>30 / 32 present</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Homework pending</span><strong>Maths — due Friday</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>AI lesson ready</span><strong style={{color:"#22d3ee"}}>Fractions — 5 activities</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Parent messages</span><strong>3 unread</strong></div>
                </div>
              )}
              {activeRole === "parent" && (
                <div className={styles.roleMockup}>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Lebo today</span><strong style={{color:"#22c55e"}}>✓ Present at school</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Homework due</span><strong>English reading — today</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Last test result</span><strong>Maths — 78%</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>School fee balance</span><strong style={{color:"#f59e0b"}}>R850 outstanding</strong></div>
                  <div className={styles.roleMockupRow}><span className={styles.roleMockupLabel}>Teacher message</span><strong>Ms Dlamini — 2 hrs ago</strong></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── DASH AI ── */}
        <section id="ai" className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`} data-reveal>
            <span>Dash AI</span>
            <h2>AI that works with educators, not around them.</h2>
            <p>Dash AI is embedded across every part of the platform — lesson planning, tutoring, exams, and insights. You always keep final control.</p>
          </div>
          <div className={styles.aiGrid}>
            {aiFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`${styles.aiCard} ${styles.reveal}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className={styles.aiCardIcon}><Icon size={22} strokeWidth={1.6} /></div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`${styles.aiCta} ${styles.reveal}`} data-reveal>
            <div className={styles.aiCtaText}>
              <Zap size={20} color="#22d3ee" />
              <span>Dash AI is available on all paid plans. Try it free for 14 days — no card required.</span>
            </div>
            <a href="https://app.edudashpro.org.za/sign-in" className={styles.primarySolid}>Explore Dash AI</a>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section className={styles.sectionAlt}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`} data-reveal>
            <span>Why EduDash Pro</span>
            <h2>Built for South African schools from the ground up.</h2>
            <p>Not adapted from a US or European system — designed with CAPS, ZAR, and SA infrastructure in mind.</p>
          </div>
          <div className={`${styles.comparisonTable} ${styles.reveal}`} data-reveal>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className={styles.usCol}><span className={styles.usColBadge}>EduDash Pro</span></th>
                  <th>Google Classroom</th>
                  <th>WhatsApp Groups</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td className={styles.usCol}>{row.us ? <CheckCircle size={16} color="#22c55e" /> : "—"}</td>
                    <td>{row.gc ? <CheckCircle size={16} color="#6b7280" /> : <span className={styles.compNo}>✗</span>}</td>
                    <td>{row.wa ? <CheckCircle size={16} color="#6b7280" /> : <span className={styles.compNo}>✗</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── APP DOWNLOAD ── */}
        <section className={styles.section}>
          <div className={styles.appDownloadSection}>
            <div className={`${styles.appDownloadContent} ${styles.reveal}`} data-reveal>
              <span className={styles.sectionLabel}>Mobile app</span>
              <h2>Parents and learners thrive on the app.</h2>
              <p>The EduDash Pro mobile app gives parents real-time visibility and learners access to Dash AI homework help, phonics coaching, and exam prep — anywhere, anytime.</p>
              <div className={styles.appDownloadBadges}>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className={styles.storeButton}>
                  <Image src="/icon-192.png" alt="" width={24} height={24} />
                  <div>
                    <div className={styles.storeSub}>Get it on</div>
                    <div className={styles.storeName}>Google Play</div>
                  </div>
                </a>
                <div className={styles.storeButtonSoon}>
                  <div>
                    <div className={styles.storeSub}>Coming soon</div>
                    <div className={styles.storeName}>App Store</div>
                  </div>
                </div>
              </div>
              <p className={styles.appNote}>Web app for schools available at <a href="https://app.edudashpro.org.za/sign-in" className={styles.inlineLink}>app.edudashpro.org.za</a></p>
            </div>
            <div className={`${styles.appMockupWrap} ${styles.reveal}`} data-reveal>
              <div className={styles.phoneMockup}>
                <div className={styles.phoneMockupInner}>
                  <div className={styles.phoneMockupHeader}>
                    <span className={styles.phoneMockupTitle}>Dash AI</span>
                  </div>
                  <div className={styles.phoneMockupChat}>
                    <div className={styles.phoneChatBubble + " " + styles.phoneChatUser}>What is photosynthesis?</div>
                    <div className={styles.phoneChatBubble + " " + styles.phoneChatDash}>
                      Great question! 🌱 Photosynthesis is how plants make their own food using sunlight, water, and CO₂. Think of it like the plant&apos;s kitchen...
                    </div>
                    <div className={styles.phoneChatBubble + " " + styles.phoneChatUser}>Can you make a diagram?</div>
                    <div className={styles.phoneChatBubble + " " + styles.phoneChatDash}>Sure! Here&apos;s how it works step by step... 📊</div>
                  </div>
                  <div className={styles.phoneMockupInput}>Ask Dash anything...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING TEASER ── */}
        <section id="pricing" className={styles.sectionAlt}>
          <div className={styles.sectionSplit}>
            <div className={`${styles.reveal}`} data-reveal>
              <span className={styles.sectionLabel}>Pricing</span>
              <h2>Flexible tiers for every school size.</h2>
              <p>Start with a 14-day free trial. No credit card. Upgrade when you are ready — plans from R99/month for parents to R1,499/month for large schools.</p>
              <div className={styles.pricingHighlights}>
                {[
                  { tier: "Parent", price: "R99", sub: "/month · Homework help + exam prep" },
                  { tier: "School Starter", price: "R399", sub: "/month · Up to 50 learners" },
                  { tier: "School Growth", price: "R699", sub: "/month · Up to 200 learners" },
                  { tier: "School Pro", price: "R1,499", sub: "/month · Unlimited + full AI" },
                ].map((p) => (
                  <div key={p.tier} className={styles.pricingTierRow}>
                    <strong>{p.tier}</strong>
                    <span className={styles.pricingAmount}>{p.price}</span>
                    <span className={styles.pricingSub}>{p.sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.sectionPanel} ${styles.reveal}`} data-reveal>
              <div className={styles.sectionPanelHeader}>14-day free trial</div>
              <h3>Start with zero commitment.</h3>
              <p>Every new school gets full-feature access for 14 days. No card, no obligation. Our team will walk you through setup in under 30 minutes.</p>
              <div className={styles.sectionButtons}>
                <Link href="/pricing" className={styles.primarySolid}>View full pricing</Link>
                <Link href="/apply" className={styles.primaryGhost}>Request proposal</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── EARLY ACCESS ── */}
        <section className={styles.section}>
          <div className={`${styles.earlyAccessCard} ${styles.reveal}`} data-reveal>
            <div>
              <h3>Join the early access list</h3>
              <p>We are onboarding new schools and parent testers now. Get onboarding support and locked-in early pricing.</p>
            </div>
            <form className={styles.earlyAccessForm} onSubmit={handleEarlyAccessSubmit}>
              <input
                type="email"
                placeholder="name@school.edu.za"
                value={earlyAccessEmail}
                onChange={(e) => setEarlyAccessEmail(e.target.value)}
              />
              <button type="submit" disabled={earlyAccessSubmitting}>
                {earlyAccessSubmitting ? "..." : earlyAccessSubmitted ? "✓ Joined" : "Join"}
              </button>
            </form>
            {earlyAccessError && <p className={styles.formError}>{earlyAccessError}</p>}
            {earlyAccessSubmitted && !earlyAccessError && (
              <p className={styles.formSuccess}>Thanks! We will email you with next steps within 24 hours.</p>
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`} data-reveal>
            <span>FAQ</span>
            <h2>Common questions answered.</h2>
          </div>
          <div className={styles.faqAccordion}>
            {faqs.map((item, index) => (
              <div key={item.q} className={`${styles.faqItem} ${styles.reveal}`} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{item.q}</span>
                  {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <div className={`${styles.trustStrip} ${styles.reveal}`} data-reveal>
          {["POPIA Compliant","PayFast Certified","CAPS Aligned","SA Data Storage","14-day Free Trial","Zero Setup Fee"].map((t) => (
            <div key={t} className={styles.trustBadge}><Star size={12} />{t}</div>
          ))}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <div className={styles.brand} style={{ marginBottom: "0.75rem" }}>
              <Image src="/icon-192.png" alt="EduDash Pro" width={28} height={28} className={styles.brandLogo} />
              <span className={styles.brandText}>EduDash Pro</span>
            </div>
            <p className={styles.footerTagline}>Next-gen school operations for Africa and beyond.</p>
            <p className={styles.footerContact}><a href="mailto:hello@edudashpro.org.za">hello@edudashpro.org.za</a></p>
          </div>
          <div className={styles.footerLinksGroup}>
            <strong>Platform</strong>
            <a href="https://app.edudashpro.org.za/sign-in">Sign In</a>
            <Link href="/pricing">Pricing</Link>
            <Link href="/apply">Book Demo</Link>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener">Android App</a>
          </div>
          <div className={styles.footerLinksGroup}>
            <strong>Company</strong>
            <Link href="/jobs">Careers</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/popia">POPIA</Link>
            <Link href="/data-deletion">Data Deletion</Link>
          </div>
          <div className={styles.footerLinksGroup}>
            <strong>Support</strong>
            <a href="mailto:support@edudashpro.org.za">Help desk</a>
            <a href="mailto:partners@edudashpro.org.za">Partners</a>
            <a href="mailto:feedback@edudashpro.org.za">Feedback</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 EduDash Pro · Registered in South Africa</span>
          <span>Built for South African schools 🇿🇦</span>
        </div>
      </footer>
    </div>
  );
}
