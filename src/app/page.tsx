import SpendForm from '@/components/SpendForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
          ⚡ FAST AUDIT | DETERMINISTIC ENGINE ACTIVE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          AI Spend <span className="text-teal-400">Auditor</span>
        </h1>
        <p className="mt-3 text-lg text-slate-400 max-w-xl mx-auto">
          Instantly evaluate software licensing inefficiencies, redundant team seats, and optimize your developer infrastructure overhead.
        </p>
      </div>

      {/* Render the Stateful Persisted Form */}
      <section className="relative z-10">
        <SpendForm />
      </section>

      {/* Footer Branding */}
      <footer className="max-w-4xl mx-auto text-center mt-16 pt-8 border-t border-slate-900 text-sm text-slate-600">
        Powered by deterministic fiscal audit logic. Built for the Credex engineering challenge.
      </footer>
    </main>
  );
}