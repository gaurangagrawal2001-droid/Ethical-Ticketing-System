import Link from "next/link";
import {
  ShieldCheck,
  Brain,
  FileSearch,
  ArrowRight,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ML-Powered Predictions",
    description:
      "Gradient Boosting model trained on 10,000 synthetic profiles delivers accurate, fair discount recommendations.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "Ethical Guardrails",
    description:
      "Built-in fraud detection flags scalper patterns and attendance fraud before any discount is issued.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: FileSearch,
    title: "Full Audit Trail",
    description:
      "Every prediction includes a human-readable explanation of exactly why a discount was granted or denied.",
    color: "bg-sky-50 text-sky-600",
  },
];

const stats = [
  { label: "Training Samples", value: "10,000", icon: Users },
  { label: "Model Accuracy", value: "R² 0.94", icon: TrendingUp },
  { label: "Max Discount", value: "50%", icon: Ticket },
  { label: "Avg. Latency", value: "< 50ms", icon: Zap },
];

const steps = [
  {
    step: "01",
    title: "Enter Your Profile",
    desc: "Provide travel distance, loyalty history, attendance rate, and ticket scarcity.",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "The model evaluates your profile against thousands of historical patterns.",
  },
  {
    step: "03",
    title: "Guardrail Check",
    desc: "Ethical rules screen for fraud patterns and attendance thresholds.",
  },
  {
    step: "04",
    title: "Transparent Result",
    desc: "Receive your discount with a plain-English explanation of every decision.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDZoLTZ2Nmg2di02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="badge-blue mb-6 inline-flex bg-white/10 text-white border-white/20">
              Powered by Gradient Boosting ML
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Ticket Pricing That&apos;s{" "}
              <span className="text-yellow-300">Actually Fair</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl leading-relaxed">
              FairTicket uses machine learning and built-in ethical guardrails to
              calculate personalized discounts — rewarding loyal fans while
              blocking scalpers and fraud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/predict"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Calculate My Discount
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Built Different
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Most pricing systems optimize for revenue. Ours optimizes for fairness —
            with full transparency at every step.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card p-8 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              From input to decision in under 50ms — with a full explanation attached.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-100 z-0" style={{ width: "calc(100% - 4rem)", left: "calc(50% + 2rem)" }} />
                )}
                <div className="card p-6 text-center relative z-10">
                  <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-black">
                    {step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to check your discount?</h2>
          <p className="text-primary-100 mb-8 max-w-md mx-auto">
            Enter your profile details and get a fair, transparent price in seconds.
          </p>
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-600">FairTicket</span>
          </div>
          <p>Ethical ML pricing — transparent, auditable, fair.</p>
        </div>
      </footer>
    </div>
  );
}
