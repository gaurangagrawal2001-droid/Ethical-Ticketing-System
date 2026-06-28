"use client";

import { useState } from "react";
import {
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  CalculatorIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Save,
} from "lucide-react";

type Result = {
  raw_model_output: number;
  final_discount: number;
  audit_trail: string;
};

type FormState = {
  distance_miles: number;
  loyalty_index: number;
  attendance_rate: number;
  scarcity: number;
};

const fields = [
  {
    key: "distance_miles" as keyof FormState,
    label: "Distance from Venue",
    icon: MapPin,
    unit: "miles",
    type: "number",
    min: 0,
    max: 500,
    step: 1,
    description: "How far you travel to attend events at this venue.",
    hint: "Further distances earn higher loyalty consideration.",
  },
  {
    key: "loyalty_index" as keyof FormState,
    label: "Loyalty Index",
    icon: Star,
    unit: "purchases",
    type: "number",
    min: 0,
    max: 50,
    step: 1,
    description: "Total number of previous ticket purchases.",
    hint: "More purchases = higher loyalty score.",
  },
  {
    key: "attendance_rate" as keyof FormState,
    label: "Attendance Rate",
    icon: Calendar,
    unit: "",
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Proportion of purchased tickets you actually used (0–1).",
    hint: "Below 0.40 disqualifies from any discount.",
  },
  {
    key: "scarcity" as keyof FormState,
    label: "Event Scarcity",
    icon: TrendingUp,
    unit: "",
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Current ticket scarcity level for this event (0–1).",
    hint: "Higher scarcity moderates available discounts.",
  },
];

function DiscountGauge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct === 0
      ? "text-red-500"
      : pct < 15
      ? "text-yellow-500"
      : pct < 30
      ? "text-emerald-500"
      : "text-emerald-600";
  const dashArray = 251.2;
  const dashOffset = dashArray - (dashArray * value) / 0.5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={pct === 0 ? "#ef4444" : pct < 15 ? "#eab308" : "#10b981"}
            strokeWidth="10"
            strokeDasharray={`${(251.2 * value) / 0.5} 251.2`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${color}`}>{pct}%</span>
          <span className="text-xs text-slate-400 font-medium">discount</span>
        </div>
      </div>
    </div>
  );
}

function SliderInput({
  field,
  value,
  onChange,
}: {
  field: (typeof fields)[0];
  value: number;
  onChange: (v: number) => void;
}) {
  const Icon = field.icon;
  const pct =
    field.max === 1
      ? value * 100
      : ((value - field.min) / (field.max - field.min)) * 100;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <label className="label mb-0">{field.label}</label>
            <p className="text-xs text-slate-400">{field.description}</p>
          </div>
        </div>
        <div className="text-right">
          <input
            type="number"
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-24 text-right px-2 py-1 text-sm font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {field.unit && (
            <span className="text-xs text-slate-400 ml-1">{field.unit}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600"
      />
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{field.min}{field.unit ? ` ${field.unit}` : ""}</span>
        <span className="text-xs text-slate-400 italic">{field.hint}</span>
        <span>{field.max}{field.unit ? ` ${field.unit}` : ""}</span>
      </div>
    </div>
  );
}

export default function PredictPage() {
  const [form, setForm] = useState<FormState>({
    distance_miles: 25,
    loyalty_index: 5,
    attendance_rate: 0.85,
    scarcity: 0.3,
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const updateField = (key: keyof FormState) => (v: number) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Backend error — is the Python server running?");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputs: { ...form },
      result: { ...result },
    };
    const existing = JSON.parse(localStorage.getItem("fairticket_history") || "[]");
    localStorage.setItem(
      "fairticket_history",
      JSON.stringify([entry, ...existing].slice(0, 50))
    );
    setSaved(true);
  };

  const discountPct = result ? Math.round(result.final_discount * 100) : null;
  const isBlocked = result?.final_discount === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <span>FairTicket</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">Discount Calculator</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Calculate Your Discount
        </h1>
        <p className="text-slate-500">
          Adjust the sliders to match your profile, then hit{" "}
          <strong>Calculate</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: inputs */}
          <div className="lg:col-span-2 space-y-4">
            {fields.map((field) => (
              <SliderInput
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={updateField(field.key)}
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <CalculatorIcon className="w-5 h-5" />
                  Calculate Discount
                </>
              )}
            </button>
          </div>

          {/* Right: result */}
          <div className="space-y-4">
            {/* Result card */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-5">Your Result</h2>

              {!result && !error && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalculatorIcon className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">
                    Fill in your profile and click Calculate
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-5">
                  {/* Gauge */}
                  <div className="flex justify-center">
                    <DiscountGauge value={result.final_discount} />
                  </div>

                  {/* Status badge */}
                  <div className="flex justify-center">
                    {isBlocked ? (
                      <span className="badge-red flex items-center gap-1.5 text-sm px-4 py-1.5">
                        <XCircle className="w-4 h-4" />
                        No discount issued
                      </span>
                    ) : (
                      <span className="badge-green flex items-center gap-1.5 text-sm px-4 py-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Discount approved
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1">Final Discount</p>
                      <p className="text-xl font-black text-slate-900">{discountPct}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1">Raw Model</p>
                      <p className="text-xl font-black text-slate-900">
                        {Math.round(result.raw_model_output * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={saveToHistory}
                    disabled={saved}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      saved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Saved to history
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save to history
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Audit trail */}
            {result && (
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary-500" />
                  Audit Trail
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 font-mono">
                  {result.audit_trail}
                </p>
              </div>
            )}

            {/* Guardrail hint card */}
            <div className="card p-5 border-amber-100 bg-amber-50">
              <h3 className="font-semibold text-amber-800 text-sm mb-2">
                Ethical Guardrails
              </h3>
              <ul className="text-xs text-amber-700 space-y-1.5">
                <li>• Attendance &lt; 40% → No discount</li>
                <li>• Attendance &lt; 60% + Loyalty &gt; 2 → Scalper flag</li>
                <li>• All discounts capped at 50%</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
