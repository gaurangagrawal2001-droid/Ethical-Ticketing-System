import {
  Brain,
  ShieldCheck,
  FileText,
  BarChart2,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const guardrails = [
  {
    icon: Calendar,
    title: "Attendance Floor",
    rule: "attendance_rate < 0.40",
    action: "No discount",
    color: "red",
    description:
      "Customers who rarely attend events they buy tickets for don't qualify. This prevents speculators and no-shows from gaming the system.",
  },
  {
    icon: AlertTriangle,
    title: "Scalper Pattern",
    rule: "attendance < 0.60 AND loyalty > 2",
    action: "Flagged, no discount",
    color: "orange",
    description:
      "High purchase history combined with low attendance is a strong signal for ticket reselling. These profiles are blocked regardless of distance.",
  },
  {
    icon: TrendingUp,
    title: "Commercial Cap",
    rule: "raw_output > 0.50",
    action: "Capped at 50%",
    color: "blue",
    description:
      "The model is capped at 50% maximum, regardless of raw output. No prediction can exceed commercial viability thresholds.",
  },
  {
    icon: ShieldCheck,
    title: "Floor Protection",
    rule: "raw_output < 0.0",
    action: "Clipped to 0%",
    color: "green",
    description:
      "Negative raw predictions are set to 0. Customers who don't qualify simply receive no discount rather than a penalty.",
  },
];

const features = [
  {
    key: "distance_miles",
    icon: MapPin,
    label: "Distance (miles)",
    impact: 38,
    description:
      "The strongest signal. Long-distance fans incur real costs and are less likely to be local scalpers.",
  },
  {
    key: "loyalty_index",
    icon: Star,
    label: "Loyalty Index",
    impact: 29,
    description:
      "Prior purchase count rewards committed fans. Used in combination with attendance to detect scalper patterns.",
  },
  {
    key: "attendance_rate",
    icon: Calendar,
    label: "Attendance Rate",
    impact: 21,
    description:
      "The primary ethical gate. Low attendance disqualifies regardless of other factors — it's the fraud filter.",
  },
  {
    key: "scarcity",
    icon: TrendingUp,
    label: "Scarcity",
    impact: 12,
    description:
      "High-scarcity events moderate discounts to avoid market distortion. Less weight to prevent gaming.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <span>FairTicket</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">About</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          How FairTicket Works
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          A transparent look at the machine learning model, the ethical guardrails,
          and the audit trail system powering every discount decision.
        </p>
      </div>

      {/* System overview */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">The ML Model</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              FairTicket uses a{" "}
              <strong className="text-slate-700">Gradient Boosting Regressor</strong>{" "}
              trained on 10,000 synthetic customer profiles. The model is intentionally
              shallow (max depth 3) to prevent overfitting and ensure stability across
              edge cases.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Training data is generated with realistic statistical distributions:
              log-normal for distance (reflecting real travel patterns), Poisson for
              loyalty index, and Beta distribution for attendance rate.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Algorithm", value: "GBR" },
                { label: "Estimators", value: "100" },
                { label: "Max Depth", value: "3" },
                { label: "Train / Test", value: "80/20" },
                { label: "Metric", value: "R² 0.94" },
                { label: "MAE", value: "~2.1%" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className="font-bold text-slate-900 text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Audit Trail</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Every prediction produces a plain-English explanation of what happened
              and why. No black box.
            </p>
            <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 leading-relaxed">
              <p className="text-slate-400 mb-1"># Example output</p>
              <p>raw=0.32 → guardrails</p>
              <p>passed → final=0.32</p>
              <p className="text-yellow-400 mt-2"># Blocked example</p>
              <p>attendance=0.35</p>
              <p className="text-red-400">BLOCKED: floor rule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature importance */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Feature Importance</h2>
            <p className="text-sm text-slate-500">How much each input influences the discount prediction</p>
          </div>
        </div>
        <div className="card divide-y divide-slate-100">
          {features.map(({ icon: Icon, label, impact, description }, i) => (
            <div key={label} className="p-5 flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-900 text-sm">{label}</span>
                  <span className="text-sm font-bold text-primary-600">{impact}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${impact * 2}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
              </div>
              <span className="text-xs text-slate-300 font-mono flex-shrink-0 mt-0.5">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical guardrails */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ethical Guardrails</h2>
            <p className="text-sm text-slate-500">
              Applied at both training time and inference — consistent, auditable, fair
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {guardrails.map(({ icon: Icon, title, rule, action, color, description }) => {
            const colorMap: Record<string, string> = {
              red: "bg-red-50 border-red-100",
              orange: "bg-amber-50 border-amber-100",
              blue: "bg-sky-50 border-sky-100",
              green: "bg-emerald-50 border-emerald-100",
            };
            const iconColorMap: Record<string, string> = {
              red: "bg-red-100 text-red-600",
              orange: "bg-amber-100 text-amber-600",
              blue: "bg-sky-100 text-sky-600",
              green: "bg-emerald-100 text-emerald-600",
            };
            const badgeColorMap: Record<string, string> = {
              red: "bg-red-100 text-red-700",
              orange: "bg-amber-100 text-amber-700",
              blue: "bg-sky-100 text-sky-700",
              green: "bg-emerald-100 text-emerald-700",
            };
            return (
              <div key={title} className={`card border p-5 ${colorMap[color]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                </div>
                <div className="font-mono text-xs bg-white/70 rounded-lg px-3 py-2 mb-3 text-slate-600">
                  IF {rule}
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${badgeColorMap[color]}`}>
                  {color === "red" || color === "orange" ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {action}
                </span>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-5">System Architecture</h2>
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            {[
              { label: "Browser", sub: "React / Next.js", color: "bg-primary-50 border-primary-200 text-primary-700" },
              { label: "Next.js API", sub: "Route proxy", color: "bg-violet-50 border-violet-200 text-violet-700" },
              { label: "FastAPI", sub: "Python / Uvicorn", color: "bg-sky-50 border-sky-200 text-sky-700" },
              { label: "ML Model", sub: "scikit-learn GBR", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-3">
                <div className={`border rounded-xl px-5 py-3 text-center ${node.color}`}>
                  <p className="font-bold">{node.label}</p>
                  <p className="text-xs opacity-70">{node.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 text-center text-xs text-slate-400">
            Browser → Next.js proxy (port 3000) → FastAPI (port 8000) → joblib model → JSON response
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="card p-8 bg-gradient-to-r from-primary-50 to-violet-50 border-primary-100 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to try it?</h2>
        <p className="text-slate-500 text-sm mb-5">
          Run a prediction with your own profile and see the audit trail in action.
        </p>
        <Link href="/predict" className="btn-primary inline-flex items-center gap-2">
          Go to Calculator <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
