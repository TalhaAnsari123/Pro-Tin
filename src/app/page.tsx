import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="fixed inset-0 flex items-stretch sm:items-center justify-center px-4 py-3 sm:py-8 overflow-hidden">
      {/* Floating ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-fuchsia-500/30 blur-3xl animate-blob-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 h-[480px] w-[480px] rounded-full bg-cyan-400/25 blur-3xl animate-blob-medium"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/3 h-[460px] w-[460px] rounded-full bg-indigo-500/30 blur-3xl animate-blob-fast"
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative w-full max-w-xl h-full sm:max-h-[860px] flex flex-col min-h-0">
        <header className="mb-3 sm:mb-5 text-center shrink-0">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-[10px] tracking-widest uppercase text-white/70 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
            ProTin
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-gradient leading-tight">
            Protein Price Calculator
          </h1>
        </header>

        <Calculator />
      </div>
    </main>
  );
}
