import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function SiteNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass-strong shadow-soft flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-accent shadow-glow">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 7h7M9 5v2M5 7c0 6 5 8 5 8" strokeLinecap="round" />
              <path d="M11 19l4-9 4 9M12.5 16h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">TranslateDocs</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">Features</a>
          <a href="#how" className="text-sm text-muted-foreground transition hover:text-foreground">How it works</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition hover:text-foreground">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground transition hover:text-foreground">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline">Sign in</Link>
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-accent px-4 py-2 text-sm font-medium text-white shadow-[0_4px_20px_-4px_oklch(0.62_0.24_295/0.6)] transition-all hover:scale-[1.03]"
          >
            <span>Get started</span>
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-accent">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 7h7M9 5v2M5 7c0 6 5 8 5 8M11 19l4-9 4 9M12.5 16h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-medium">TranslateDocs</span>
          <span className="ml-2 text-xs text-muted-foreground">© 2026</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#" className="transition hover:text-foreground">GitHub</a>
          <a href="#" className="transition hover:text-foreground">Discord</a>
          <a href="#" className="transition hover:text-foreground">Contact</a>
          <a href="#" className="transition hover:text-foreground">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
