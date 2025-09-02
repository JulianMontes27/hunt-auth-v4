import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040404] text-white relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040404] via-[#0a0a0a] to-[#1a1a1a]" />

      {/* Optional overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />

      {/* Main content */}
      <main className="relative flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-normal tracking-wide text-white leading-none mb-8">
            Hunt Tickets
          </h1>

          {/* Buttons */}
          <div className="flex justify-center">
            <Link
              href="/sign-in"
              className="px-6 py-3 sm:px-8 sm:py-3 bg-[#030303] border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 text-base sm:text-lg font-light"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
