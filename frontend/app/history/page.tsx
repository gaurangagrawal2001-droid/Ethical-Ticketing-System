"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react";

type Entry = {
  id: number;
  timestamp: string;
  inputs: {
    distance_miles: number;
    loyalty_index: number;
    attendance_rate: number;
    scarcity: number;
  };
  result: {
    raw_model_output: number;
    final_discount: number;
    audit_trail: string;
  };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<"all" | "approved" | "blocked">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("fairticket_history") || "[]");
    setEntries(data);
  }, []);

  const filtered = entries.filter((e) => {
    if (filter === "approved") return e.result.final_discount > 0;
    if (filter === "blocked") return e.result.final_discount === 0;
    return true;
  });

  const clearHistory = () => {
    if (!confirm("Clear all prediction history?")) return;
    localStorage.removeItem("fairticket_history");
    setEntries([]);
  };

  const exportCSV = () => {
    const rows = [
      ["Timestamp", "Distance (mi)", "Loyalty", "Attendance", "Scarcity", "Raw %", "Final %", "Audit"],
      ...entries.map((e) => [
        e.timestamp,
        e.inputs.distance_miles,
        e.inputs.loyalty_index,
        e.inputs.attendance_rate,
        e.inputs.scarcity,
        (e.result.raw_model_output * 100).toFixed(1),
        (e.result.final_discount * 100).toFixed(1),
        `"${e.result.audit_trail.replace(/"/g, '""')}"`,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fairticket_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgDiscount =
    entries.length > 0
      ? entries.reduce((s, e) => s + e.result.final_discount, 0) / entries.length
      : 0;
  const approvedCount = entries.filter((e) => e.result.final_discount > 0).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <span>FairTicket</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">Prediction History</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Prediction History
            </h1>
            <p className="text-slate-500">
              Your saved discount calculations — stored locally in your browser.
            </p>
          </div>
          {entries.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={exportCSV}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-black text-slate-900">{entries.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Predictions</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">{approvedCount}</p>
            <p className="text-xs text-slate-400 mt-1">Discounts Approved</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-black text-primary-600">
              {Math.round(avgDiscount * 100)}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Average Discount</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {entries.length > 0 && (
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-slate-400" />
          {(["all", "approved", "blocked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-sm text-slate-400 ml-auto">{filtered.length} results</span>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7 text-slate-300" />
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">No history yet</h2>
          <p className="text-slate-400 text-sm mb-6">
            Run a prediction and save it to see it here.
          </p>
          <Link href="/predict" className="btn-primary inline-flex items-center gap-2">
            Make a Prediction <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Entries */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const discount = Math.round(entry.result.final_discount * 100);
            const approved = discount > 0;
            const isOpen = expanded === entry.id;

            return (
              <div key={entry.id} className="card overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                >
                  {/* Status icon */}
                  {approved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}

                  {/* Date */}
                  <span className="text-sm text-slate-400 w-32 flex-shrink-0">
                    {formatDate(entry.timestamp)}
                  </span>

                  {/* Inputs summary */}
                  <div className="flex items-center gap-3 flex-1 flex-wrap">
                    <span className="badge-blue">{entry.inputs.distance_miles} mi</span>
                    <span className="badge-blue">Loyalty {entry.inputs.loyalty_index}</span>
                    <span className="badge-blue">
                      Attend. {Math.round(entry.inputs.attendance_rate * 100)}%
                    </span>
                    <span className="badge-blue">
                      Scarcity {Math.round(entry.inputs.scarcity * 100)}%
                    </span>
                  </div>

                  {/* Discount */}
                  <span
                    className={`text-lg font-black flex-shrink-0 ${
                      approved ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {discount}%
                  </span>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Inputs
                        </p>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Distance</dt>
                            <dd className="font-medium">{entry.inputs.distance_miles} mi</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Loyalty Index</dt>
                            <dd className="font-medium">{entry.inputs.loyalty_index}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Attendance Rate</dt>
                            <dd className="font-medium">
                              {(entry.inputs.attendance_rate * 100).toFixed(0)}%
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Scarcity</dt>
                            <dd className="font-medium">
                              {(entry.inputs.scarcity * 100).toFixed(0)}%
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Result
                        </p>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Raw Model</dt>
                            <dd className="font-medium">
                              {(entry.result.raw_model_output * 100).toFixed(1)}%
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Final Discount</dt>
                            <dd className={`font-black ${approved ? "text-emerald-600" : "text-red-500"}`}>
                              {discount}%
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Audit Trail
                      </p>
                      <p className="text-sm text-slate-600 bg-white border border-slate-100 rounded-xl p-3 font-mono leading-relaxed">
                        {entry.result.audit_trail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && entries.length > 0 && (
        <div className="card p-12 text-center text-slate-400">
          No {filter} predictions found.
        </div>
      )}
    </div>
  );
}
