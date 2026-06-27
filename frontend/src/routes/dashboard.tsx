import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Languages, History, BookMarked, Code2, Settings,
  Upload, FileText, Search, Bell, MoreHorizontal, Check, Clock, ArrowLeftRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TranslateDocs" },
      { name: "description", content: "Translate documents with perfect layout preservation." },
    ],
  }),
  component: Dashboard,
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Languages, label: "Translate" },
  { icon: History, label: "History" },
  { icon: BookMarked, label: "Glossary" },
  { icon: Code2, label: "API" },
  { icon: Settings, label: "Settings" },
];

const recents = [
  { name: "Q3-Financial-Report.pdf", lang: "EN → ES", time: "2m ago", status: "done", size: "2.4 MB" },
  { name: "Product-Spec.docx", lang: "EN → JA", time: "1h ago", status: "done", size: "840 KB" },
  { name: "Pitch-Deck.pptx", lang: "EN → DE", time: "3h ago", status: "done", size: "12.6 MB" },
  { name: "User-Manual.pdf", lang: "EN → FR", time: "Yesterday", status: "done", size: "5.1 MB" },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar/60 backdrop-blur md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-accent shadow-glow">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 7h7M9 5v2M5 7c0 6 5 8 5 8M11 19l4-9 4 9M12.5 16h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold">TranslateDocs</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((n) => (
            <button
              key={n.label}
              className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                n.active
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              <span>{n.label}</span>
              {n.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-accent" />}
            </button>
          ))}
        </nav>
        <div className="m-3 rounded-2xl border border-border bg-[#0c0c0e] p-4">
          <div className="text-xs font-medium">Pro plan</div>
          <div className="mt-1 text-[11px] text-muted-foreground">1,240 / 2,000 pages</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[62%] rounded-full bg-gradient-accent" />
          </div>
          <button className="mt-3 w-full rounded-md bg-white/5 py-1.5 text-xs font-medium transition hover:bg-white/10">
            Upgrade
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground transition hover:text-foreground">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-sm sm:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                placeholder="Search documents…"
                className="w-56 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white/[0.03] transition hover:bg-white/[0.06]">
              <Bell className="h-4 w-4" />
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-accent text-xs font-semibold text-white">
              JM
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-8 p-6 lg:p-10">
          {/* Header */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, Jamie</h1>
              <p className="mt-1 text-sm text-muted-foreground">Drop a document to translate, or pick up where you left off.</p>
            </div>
            <div className="flex shrink-0 gap-2 text-xs">
              <Stat label="Translated" value="38" delta="+12" />
              <Stat label="Pages" value="1,240" delta="+182" />
            </div>
          </div>

          {/* Upload */}
          <UploadCard />

          {/* Recent + Preview */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <RecentDocs />
            <PreviewPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="hidden rounded-xl border border-border bg-[#0c0c0e] px-4 py-2 sm:block">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold">{value}</span>
        <span className="text-[10px] text-emerald-400">{delta}</span>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { toast } from "sonner";

function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [langIn, setLangIn] = useState("en");
  const [langOut, setLangOut] = useState("vi");
  const [mode, setMode] = useState("both");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "parsing" | "translating" | "done" | "error">("idle");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [outputFiles, setOutputFiles] = useState<{ mono?: string; dual?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStage("idle");
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a document first.");
      return;
    }

    setStage("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lang_in", langIn);
    formData.append("lang_out", langOut);
    formData.append("mode", mode);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to start translation");
      }

      const data = await response.json();
      const newTaskId = data.task_id;
      setTaskId(newTaskId);
      setStage("parsing");
      setProgress(20);
      toast.success("Document uploaded. Parsing layout...");

      // Start status polling
      startPolling(newTaskId);
    } catch (err: any) {
      console.error("Upload error", err);
      setStage("error");
      setErrorMessage(err.message || "Failed to upload file");
      toast.error(err.message || "Failed to upload file");
    }
  };

  const startPolling = (tid: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks/${tid}`);
        if (!res.ok) throw new Error("Failed to fetch task status");

        const data = await res.json();
        
        if (data.status === "processing") {
          setStage(data.stage);
          setProgress(data.progress);
        } else if (data.status === "done") {
          setStage("done");
          setProgress(100);
          setOutputFiles(data.output_files || {});
          toast.success("Translation finished!");
          clearInterval(interval);
        } else if (data.status === "error") {
          setStage("error");
          setErrorMessage(data.error || "An error occurred during translation");
          toast.error(data.error || "Translation failed");
          clearInterval(interval);
        }
      } catch (err: any) {
        console.error("Polling error", err);
        setStage("error");
        setErrorMessage("Connection to translator lost.");
        clearInterval(interval);
      }
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setTaskId(null);
    setProgress(0);
    setStage("idle");
    setOutputFiles({});
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass shadow-card relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="absolute -top-20 left-1/2 -z-10 h-40 w-[600px] -translate-x-1/2 rounded-full bg-gradient-accent opacity-20 blur-[100px]" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left Side: Upload zone or configuration */}
        {stage === "idle" && !file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.015] p-8 transition hover:border-white/20 hover:bg-white/[0.03]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.pptx,.epub,.html,.htm"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-accent shadow-glow"
            >
              <Upload className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-base font-medium">Drop your document here</p>
            <p className="mt-1 text-xs text-muted-foreground text-center">or click to browse — PDF, DOCX, PPTX, EPUB, HTML</p>
          </div>
        ) : (
          /* File info & options when file selected but not translating */
          <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-white/5 bg-white/[0.01] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04]">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{file?.name}</div>
                  <div className="text-[11px] text-muted-foreground">{file ? formatSize(file.size) : ""}</div>
                </div>
              </div>
              {stage === "idle" && (
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground">
                  Remove
                </button>
              )}
            </div>

            {/* Translation settings selectors */}
            {stage === "idle" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Source</label>
                  <select 
                    value={langIn}
                    onChange={(e) => setLangIn(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0c0c0e]/80 px-2 py-1.5 text-xs text-foreground outline-none"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="es">Spanish</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="fr">French</option>
                    <option value="vi">Vietnamese</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Target</label>
                  <select 
                    value={langOut}
                    onChange={(e) => setLangOut(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0c0c0e]/80 px-2 py-1.5 text-xs text-foreground outline-none"
                  >
                    <option value="vi">Vietnamese</option>
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Layout Mode</label>
                  <select 
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0c0c0e]/80 px-2 py-1.5 text-xs text-foreground outline-none"
                  >
                    <option value="both">Both (Mono & Dual)</option>
                    <option value="mono">Monolingual Only</option>
                    <option value="dual">Bilingual Only</option>
                  </select>
                </div>
              </div>
            )}

            {stage === "idle" && (
              <button 
                onClick={handleUpload}
                className="w-full rounded-full bg-gradient-accent py-2.5 text-xs font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                Translate Document
              </button>
            )}

            {/* Error Message display */}
            {stage === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs">
                <div className="font-semibold text-red-400">Translation Failed</div>
                <div className="mt-1 text-muted-foreground">{errorMessage}</div>
                <button onClick={handleReset} className="mt-3 rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10">
                  Try Again
                </button>
              </div>
            )}

            {/* Success Actions */}
            {stage === "done" && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-emerald-400">Translation Complete!</div>
                <div className="grid grid-cols-2 gap-2">
                  {outputFiles.mono && (
                    <a 
                      href={`/api/download/${taskId}/mono`}
                      download
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-xs font-medium hover:bg-white/10"
                    >
                      Download Mono
                    </a>
                  )}
                  {outputFiles.dual && (
                    <a 
                      href={`/api/download/${taskId}/dual`}
                      download
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-accent py-2 text-xs font-medium text-white hover:opacity-90"
                    >
                      Download Dual
                    </a>
                  )}
                </div>
                <button onClick={handleReset} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground">
                  Translate another file
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Translation pipeline progress indicator */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{file ? file.name : "No file selected"}</div>
                <div className="text-[11px] text-muted-foreground">
                  {file ? `${formatSize(file.size)} · ${langIn.toUpperCase()} → ${langOut.toUpperCase()}` : "Please upload a document to begin"}
                </div>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <PipelineRow label="Upload" done={stage !== "idle" && stage !== "uploading"} active={stage === "uploading"} />
              <PipelineRow label="AI parsing" active={stage === "parsing"} done={stage === "translating" || stage === "exporting" || stage === "done"} />
              <PipelineRow label="Translation" active={stage === "translating"} done={stage === "exporting" || stage === "done"} />
              <PipelineRow label="Export & Build" active={stage === "exporting"} done={stage === "done"} />
            </div>
          </div>
          
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {stage === "idle" && !file ? "Ready" : stage === "idle" ? "Pending start" : stage === "done" ? "Completed" : stage === "error" ? "Failed" : `Processing… ${Math.round(progress)}%`}
              </span>
              <span className="text-muted-foreground">
                {stage === "done" ? "100%" : `${Math.round(progress)}%`}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
                className="h-full rounded-full bg-gradient-accent"
              />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}


function PipelineRow({ label, active, done }: { label: string; active?: boolean; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div
        className={`grid h-5 w-5 place-items-center rounded-full transition ${
          done ? "bg-emerald-500/15 text-emerald-400" : active ? "bg-white/10 text-foreground" : "bg-white/5 text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : active ? <motion.div className="h-1.5 w-1.5 rounded-full bg-gradient-accent" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} /> : <Clock className="h-3 w-3" />}
      </div>
      <span className={done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function RecentDocs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-3xl border border-border bg-[#0c0c0e]/60"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="text-sm font-semibold">Recent documents</div>
        <button className="text-xs text-muted-foreground transition hover:text-foreground">View all</button>
      </div>
      <ul className="divide-y divide-border">
        {recents.map((d) => (
          <li key={d.name} className="group flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.02]">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04]">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{d.name}</div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{d.lang}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{d.size}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{d.time}</span>
              </div>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 sm:flex">
              <Check className="h-3 w-3" strokeWidth={3} />
              Done
            </div>
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-white/5">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PreviewPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-border bg-[#0c0c0e]/60"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          Preview
        </div>
        <div className="flex gap-1 rounded-full bg-white/5 p-0.5 text-[10px]">
          <button className="rounded-full bg-white/10 px-2.5 py-1 font-medium">Original</button>
          <button className="rounded-full px-2.5 py-1 text-muted-foreground">Translated</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <MiniDoc lang="EN" />
        <MiniDoc lang="ES" accent />
      </div>
    </motion.div>
  );
}

function MiniDoc({ lang, accent }: { lang: string; accent?: boolean }) {
  return (
    <div className="relative bg-[#0c0c0e] p-5">
      <div className={`mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${accent ? "bg-gradient-accent text-white" : "bg-white/5 text-muted-foreground"}`}>
        {lang}
      </div>
      <div className="space-y-2">
        <div className="h-3 w-3/4 rounded bg-white/10" />
        <div className="h-2 w-1/2 rounded bg-white/5" />
        <div className="mt-4 space-y-1.5">
          <div className="h-2 rounded bg-white/5" />
          <div className="h-2 rounded bg-white/5" />
          <div className="h-2 w-5/6 rounded bg-white/5" />
        </div>
        <div className="mt-4 h-16 rounded-lg bg-white/[0.03]">
          <div className="h-full w-full animate-shimmer rounded-lg" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-2 rounded bg-white/5" />
          <div className="h-2 w-4/5 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}
