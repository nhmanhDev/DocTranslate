import { motion } from "motion/react";
import { FileText, Upload, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroVisual() {
  const steps = [
    { icon: Upload, label: "Upload PDF", color: "from-violet-400 to-fuchsia-400" },
    { icon: Sparkles, label: "AI Parsing", color: "from-indigo-400 to-violet-400" },
    { icon: FileText, label: "Translation", color: "from-blue-400 to-indigo-400" },
    { icon: CheckCircle2, label: "Perfect Output", color: "from-emerald-400 to-teal-400" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* glow */}
      <div className="absolute inset-x-10 top-10 -z-10 h-64 rounded-full bg-gradient-accent opacity-30 blur-[120px]" />

      {/* main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="glass-strong shadow-card relative overflow-hidden rounded-3xl p-2"
      >
        <div className="rounded-[20px] bg-[#0d0d10] p-6 sm:p-10">
          {/* window chrome */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
            </div>
            <div className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-muted-foreground">
              translatedocs.app/translate
            </div>
            <div className="h-3 w-12" />
          </div>

          {/* drop zone */}
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="group relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.015] p-8 transition hover:border-white/20">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-accent shadow-glow"
              >
                <Upload className="h-7 w-7 text-white" />
              </motion.div>
              <p className="text-lg font-medium">Drop your document here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse — up to 200MB</p>
              <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {["PDF", "DOCX", "PPTX", "XLSX", "EPUB"].map((f) => (
                  <span key={f} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* pipeline */}
            <div className="flex flex-col justify-between gap-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <div className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${s.color}`}>
                    <s.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.6 + i * 0.3, duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-accent"
                      />
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 opacity-80" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating doc cards */}
      <FloatingDoc className="absolute -left-4 top-20 hidden rotate-[-8deg] sm:block" delay={0.2} title="Report.pdf" lang="EN → ES" />
      <FloatingDoc className="absolute -right-4 top-40 hidden rotate-[6deg] sm:block" delay={0.5} title="Slides.pptx" lang="EN → JP" />
      <FloatingDoc className="absolute -right-8 -bottom-6 hidden rotate-[-4deg] md:block" delay={0.8} title="Book.epub" lang="EN → FR" />
    </div>
  );
}

function FloatingDoc({ className, delay, title, lang }: { className?: string; delay: number; title: string; lang: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      <div className="glass-strong shadow-soft animate-float-slow flex items-center gap-3 rounded-xl px-3.5 py-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-accent">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium">{title}</div>
          <div className="text-[10px] text-muted-foreground">{lang}</div>
        </div>
      </div>
    </motion.div>
  );
}
