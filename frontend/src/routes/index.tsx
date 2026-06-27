import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteNav, SiteFooter } from "@/components/site/nav";
import { HeroVisual } from "@/components/site/hero-visual";
import { FeatureGrid, HowItWorks, Comparison, Formats, DemoSlider, Pricing, FAQ, CTA } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TranslateDocs — Translate Any Document. Keep Every Detail." },
      { name: "description", content: "AI-powered document translation with perfect layout preservation. PDF, DOCX, PPTX, XLSX, EPUB, HTML, Markdown." },
      { property: "og:title", content: "TranslateDocs — Translate Any Document. Keep Every Detail." },
      { property: "og:description", content: "AI-powered document translation with perfect layout preservation." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-accent opacity-25 blur-[140px]" />
        <div className="absolute bottom-[-300px] right-[-100px] h-[500px] w-[700px] rounded-full bg-blue-600/15 blur-[140px]" />
      </div>

      <SiteNav />

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-40 sm:pt-48">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Now with 100+ language pairs
              <span className="text-muted-foreground/50">·</span>
              <Link to="/dashboard" className="font-medium text-foreground/90 hover:text-foreground">Try free →</Link>
            </div>

            <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
              <span className="text-gradient">Translate Any Document.</span>
              <br />
              <span className="text-gradient-accent">Keep Every Detail.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
              AI-powered document translation with perfect layout preservation.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {["PDF", "DOCX", "PPTX", "XLSX", "EPUB", "HTML", "Markdown"].map((f, i) => (
                <span key={f} className="flex items-center gap-3">
                  <span>{f}</span>
                  {i < 6 && <span className="text-muted-foreground/40">·</span>}
                </span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3 text-[15px] font-medium text-white shadow-[0_8px_30px_-8px_oklch(0.62_0.24_295/0.8)] transition-all hover:scale-[1.03]"
              >
                Start Translating
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-5 py-3 text-[15px] font-medium backdrop-blur transition-all hover:bg-white/[0.06]"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                </span>
                Watch Demo
              </a>
            </motion.div>
          </motion.div>

          <div className="mt-20">
            <HeroVisual />
          </div>
        </div>
      </section>

      <FeatureGrid />
      <HowItWorks />
      <Comparison />
      <Formats />
      <DemoSlider />
      <Pricing />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}
