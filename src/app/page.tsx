import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="fixed inset-0 flex items-stretch sm:items-center justify-center px-4 py-4 sm:py-8 overflow-hidden">
      <div className="relative w-full max-w-xl h-full sm:max-h-[920px] flex flex-col min-h-0">
        <header className="mb-4 sm:mb-6 text-center shrink-0">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gradient leading-tight">
            Protein Price Calculator
          </h1>
        </header>

        <Calculator />
      </div>
    </main>
  );
}
