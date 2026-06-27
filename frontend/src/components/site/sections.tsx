import { motion } from "motion/react";
import {
  LayoutTemplate, Languages, Brain, Server, Layers, ShieldCheck,
  FileText, Presentation, Table2, BookOpen, Code2, FileType,
  Check, X, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: LayoutTemplate, title: "Perfect Layout", desc: "Keep fonts, tables, images, columns and formatting pixel-identical to the source." },
  { icon: Languages, title: "100+ Languages", desc: "Translate into and from over 100 languages with native fluency and tone." },
  { icon: Brain, title: "AI Translation", desc: "Frontier LLMs tuned for documents — context-aware, glossary-aware, terminology-stable." },
  { icon: Server, title: "Offline & Cloud", desc: "Run translations in the cloud or fully on-prem with our offline model bundle." },
  { icon: Layers, title: "Batch Translation", desc: "Drop a folder. Translate hundreds of documents in parallel with one click." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "SOC 2, end-to-end encryption, private inference, zero data retention by default." },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Features" title="Everything you need to ship translations." subtitle="Built for teams that ship documents in every language, every day." />
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative bg-[#0c0c0e] p-8 transition-colors hover:bg-[#101013]"
            >
              <div className="relative mb-5 inline-grid h-11 w-11 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-all group-hover:scale-110 group-hover:bg-gradient-accent">
                <f.icon className="h-5 w-5 text-foreground transition-colors group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-accent" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", title: "Upload document", desc: "Drop a PDF, DOCX, PPTX, XLSX, EPUB, HTML or Markdown file." },
    { n: "02", title: "AI understands layout", desc: "Our vision model maps every element — text, tables, figures, formulas." },
    { n: "03", title: "Translate with advanced AI", desc: "Context-aware translation preserves tone, terminology and structure." },
    { n: "04", title: "Export identical document", desc: "Download the translated file. Identical layout. Ready to ship." },
  ];
  return (
    <section id="how" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="How it works" title="From upload to perfect output in seconds." />
        <div className="relative mt-20 grid gap-10 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-[#0c0c0e]">
                <span className="text-gradient-accent text-sm font-bold">{s.n}</span>
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-accent opacity-20 blur-xl" />
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const compareRows = [
  { feature: "Perfect layout preservation", us: true, them: false },
  { feature: "Tables with merged cells", us: true, them: false },
  { feature: "Images & embedded charts", us: true, them: false },
  { feature: "Math formulas (LaTeX)", us: true, them: false },
  { feature: "Scanned PDFs (OCR)", us: true, them: "partial" as const },
  { feature: "Multi-format (PDF, DOCX, PPTX…)", us: true, them: false },
  { feature: "Batch processing", us: true, them: "partial" as const },
  { feature: "On-prem / offline model", us: true, them: false },
];

export function Comparison() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="Comparison" title="TranslateDocs vs traditional translators." />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass shadow-card mt-14 overflow-hidden rounded-3xl"
        >
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border px-6 py-5 text-sm">
            <div className="text-muted-foreground">Feature</div>
            <div className="text-center font-semibold text-gradient-accent">TranslateDocs</div>
            <div className="text-center font-medium text-muted-foreground">Traditional</div>
          </div>
          {compareRows.map((r, i) => (
            <div key={r.feature} className={`grid grid-cols-[1.4fr_1fr_1fr] px-6 py-4 text-sm ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
              <div className="text-foreground">{r.feature}</div>
              <div className="flex justify-center">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              </div>
              <div className="flex justify-center">
                {r.them === false && (
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-white/5 text-muted-foreground">
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                )}
                {r.them === "partial" && (
                  <div className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">partial</div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const formats = [
  { name: "PDF", icon: FileType, color: "from-red-400/80 to-orange-400/80" },
  { name: "DOCX", icon: FileText, color: "from-blue-400/80 to-indigo-400/80" },
  { name: "PPTX", icon: Presentation, color: "from-orange-400/80 to-amber-400/80" },
  { name: "XLSX", icon: Table2, color: "from-emerald-400/80 to-teal-400/80" },
  { name: "EPUB", icon: BookOpen, color: "from-violet-400/80 to-purple-400/80" },
  { name: "HTML", icon: Code2, color: "from-cyan-400/80 to-blue-400/80" },
  { name: "MD", icon: FileText, color: "from-zinc-300/80 to-zinc-500/80" },
];

export function Formats() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Formats" title="One platform. Every document type." />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {formats.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="group glass shadow-soft flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 transition-all hover:border-white/20"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${f.color} transition-transform group-hover:scale-110`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold">{f.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoSlider() {
  const [pos, setPos] = useState(50);
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Live demo" title="Same layout. Different language." subtitle="Drag the slider to compare the original and translated document." />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong shadow-card mt-12 overflow-hidden rounded-3xl p-2"
        >
          <div
            className="relative h-[460px] select-none overflow-hidden rounded-2xl bg-white"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPos(Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)));
            }}
          >
            <DocumentPreview lang="en" />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <DocumentPreview lang="es" />
            </div>
            <div className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_20px_2px_rgba(255,255,255,0.5)]" style={{ left: `${pos}%` }}>
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-zinc-900/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">Original · EN</div>
            <div className="absolute right-4 top-4 rounded-full bg-gradient-accent px-2.5 py-1 text-[10px] font-medium text-white">Translated · ES</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DocumentPreview({ lang }: { lang: "en" | "es" }) {
  const t = lang === "en"
    ? {
        title: "Quarterly Business Review",
        sub: "Financial highlights and product roadmap — Q3 2026",
        h: "Executive Summary",
        p: "Revenue grew 42% year-over-year, driven by strong enterprise adoption and expansion into the European market. Operating margins improved by 5 points compared to the same period last year.",
        h2: "Key Metrics",
        rows: [["Metric", "Q2", "Q3", "Δ"], ["Revenue", "$8.2M", "$11.6M", "+42%"], ["Customers", "1,240", "1,890", "+52%"], ["NPS", "62", "71", "+9"]],
      }
    : {
        title: "Revisión Trimestral del Negocio",
        sub: "Resultados financieros y hoja de ruta — T3 2026",
        h: "Resumen Ejecutivo",
        p: "Los ingresos crecieron un 42% interanual, impulsados por una fuerte adopción empresarial y la expansión al mercado europeo. Los márgenes operativos mejoraron 5 puntos frente al mismo período del año anterior.",
        h2: "Métricas Clave",
        rows: [["Métrica", "T2", "T3", "Δ"], ["Ingresos", "$8.2M", "$11.6M", "+42%"], ["Clientes", "1,240", "1,890", "+52%"], ["NPS", "62", "71", "+9"]],
      };
  return (
    <div className="absolute inset-0 p-10 text-zinc-900">
      <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">TranslateDocs · Q3</div>
      <h3 className="text-2xl font-bold tracking-tight">{t.title}</h3>
      <div className="mt-1 text-sm text-zinc-500">{t.sub}</div>
      <div className="mt-6 h-px bg-zinc-200" />
      <h4 className="mt-6 text-base font-semibold">{t.h}</h4>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-zinc-700">{t.p}</p>
      <h4 className="mt-6 text-base font-semibold">{t.h2}</h4>
      <table className="mt-3 w-full max-w-md text-[12px]">
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i} className={i === 0 ? "border-b border-zinc-300 font-semibold" : "border-b border-zinc-100"}>
              {r.map((c, j) => <td key={j} className="py-1.5 pr-3">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex gap-3">
        <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-violet-200 to-blue-200" />
        <div className="h-20 flex-1 rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
}

const tiers = [
  {
    name: "Free", price: "$0", period: "forever",
    desc: "For trying it out on a few documents.",
    features: ["10 pages / month", "All formats supported", "Standard AI model", "Community support"],
    cta: "Start free", highlight: false,
  },
  {
    name: "Pro", price: "$24", period: "/ month",
    desc: "For professionals and small teams.",
    features: ["2,000 pages / month", "Advanced AI model", "Glossary & terminology", "Batch translation", "Priority processing", "Email support"],
    cta: "Start Pro trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "For organizations with scale and compliance needs.",
    features: ["Unlimited pages", "On-prem / offline model", "SSO & SCIM", "SOC 2 + DPA", "Dedicated support", "Custom integrations"],
    cta: "Talk to sales", highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Pricing" title="Simple, scalable pricing." subtitle="Start free. Upgrade when you need more." />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative flex flex-col rounded-3xl border p-8 transition ${
                t.highlight
                  ? "border-transparent bg-[#0c0c0e] shadow-glow"
                  : "border-border bg-[#0c0c0e]/60"
              }`}
            >
              {t.highlight && (
                <>
                  <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-accent opacity-[0.18] blur-2xl" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most popular
                  </div>
                </>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-gradient">{t.price}</span>
                {t.period && <span className="text-sm text-muted-foreground">{t.period}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
              <div className="my-6 h-px bg-border" />
              <ul className="flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] ${
                  t.highlight
                    ? "bg-gradient-accent text-white shadow-[0_4px_20px_-4px_oklch(0.62_0.24_295/0.6)]"
                    : "bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                {t.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How accurate are the translations?", a: "We use frontier LLMs fine-tuned on multilingual document corpora. For most language pairs, accuracy exceeds professional human baselines on benchmark tasks like FLORES." },
  { q: "Will my document's layout really stay identical?", a: "Yes. Our vision model maps every element — paragraphs, tables, images, footnotes — and rebuilds the document with native fonts, spacing and pagination preserved." },
  { q: "Is my data secure?", a: "All uploads are encrypted in transit and at rest. We do not retain document content after translation by default. Enterprise plans include zero-retention, on-prem and offline deployment options." },
  { q: "Can I translate scanned PDFs?", a: "Yes. We OCR scanned pages first, then translate, then reflow the layout to match the original document." },
  { q: "Do you have an API?", a: "Yes. The same engine that powers the web app is available via REST and a typed TypeScript SDK." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions." />
        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="overflow-hidden rounded-2xl border border-border bg-[#0c0c0e]/60"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]"
              >
                <span className="text-[15px] font-medium">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-[#0c0c0e] px-8 py-20 text-center sm:px-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[700px] -translate-x-1/2 rounded-full bg-gradient-accent opacity-30 blur-[120px]" />
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
          Start translating today.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Free for your first 10 pages. No credit card required.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/dashboard" className="rounded-full bg-gradient-accent px-6 py-3 text-sm font-medium text-white shadow-[0_4px_20px_-4px_oklch(0.62_0.24_295/0.6)] transition-transform hover:scale-105">
            Start Translating
          </a>
          <a href="#" className="rounded-full border border-border bg-white/[0.03] px-6 py-3 text-sm font-medium transition hover:bg-white/[0.06]">
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
