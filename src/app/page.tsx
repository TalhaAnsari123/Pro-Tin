import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="relative h-[100svh] w-full flex items-center justify-center px-4 py-6 sm:py-12 overflow-hidden">
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

      <div className="relative w-full max-w-xl max-h-full flex flex-col">
        <header className="mb-4 sm:mb-6 text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-[10px] tracking-widest uppercase text-white/70 mb-2 sm:mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
            ProTin
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-gradient">
            Protein Price Calculator
          </h1>
          <p className="mt-1.5 text-white/60 text-xs sm:text-sm">
            Find the true cost per gram of protein and per serving.
          </p>
        </header>

        <Calculator />

        <footer className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-white/40 shrink-0">
          All values in $ — calculated locally, nothing leaves your device.
        </footer>
      </div>
    </main>
  );
}
