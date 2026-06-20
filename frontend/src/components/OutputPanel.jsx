import React, { useState } from "react";

/**
 * OutputPanel Component
 * Renders the results of the critique on the right column.
 * Layout: Four clearly defined sections: Quality Score, Hidden Assumptions, Counter Arguments, Final Verdict.
 * Custom Styles: Rounded corners max 8px, clear headers, high-contrast verdict box.
 * 
 * @param {object} props
 * @param {object|null} props.analysisResult - Current evaluation result object
 * @param {boolean} props.isLoading - Whether an analysis is currently running
 */
export default function OutputPanel({ analysisResult, isLoading }) {
  const [copied, setCopied] = useState(false);

  // Empty or placeholder state
  if (!analysisResult && !isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 h-full flex flex-col justify-center items-center min-h-[400px] text-center">
        <div className="max-w-md space-y-3">
          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mx-auto text-gray-400 select-none">
            ?
          </div>
          <h3 className="text-base font-semibold text-slate-800 font-sans" id="placeholder-title">
            No analysis yet
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Enter your idea, choose a mode, and click Analyze.<br />
            ADVOCATE will challenge every assumption.
          </p>
        </div>
      </div>
    );
  }

  // Loading / Deconstructing state
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 h-full flex flex-col justify-center items-center min-h-[400px] text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-t-slate-800 border-gray-200 animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-700 font-semibold uppercase tracking-wider font-sans">
            Deconstructing concept...
          </p>
          <p className="text-xs text-gray-400 font-sans">
            Identifying vulnerabilities and building Socratic objections.
          </p>
        </div>
      </div>
    );
  }

  // Active status variables
  const { topic, score, risk, assumptions, counterArguments, verdict } = analysisResult;

  // Determine Risk color classes
  const getRiskColorClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "text-red-600 font-bold";
      case "medium":
        return "text-amber-600 font-bold";
      case "low":
        return "text-emerald-600 font-bold";
      default:
        return "text-gray-500";
    }
  };

  // Determine Score category rating text
  const getScoreRating = (val) => {
    if (val < 40) return { text: "Severely Compromised", bg: "bg-red-50 text-red-700 border-red-200" };
    if (val < 60) return { text: "Highly Vulnerable", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    if (val < 75) return { text: "Moderately Viable", bg: "bg-blue-50 text-blue-700 border-blue-200" };
    return { text: "Relatively Robust", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  const scoreRating = getScoreRating(score);

  // Copy whole assessment payload to the clipboard gracefully 
  const handleCopyAnalysis = () => {
    if (!analysisResult) return;

    const formattedReport = `ADVOCATE COGNITIVE REVIEW
=======================================
TOPIC LANDSCAPE: ${topic || "General Proposition"}
STRESS SCORE:    ${score}/100
DIALECTIC RISK:  ${risk ? risk.toUpperCase() : "MEDIUM"} RISK
DIAGNOSTIC:      ${scoreRating.text}

CONCEALED ASSUMPTIONS:
${assumptions ? assumptions.map((item, idx) => `  ↳ [${idx + 1}] ${item}`).join("\n") : "  None identified."}

COUNTER REBUTTALS:
${counterArguments ? counterArguments.map((item, idx) => `  - [Line ${idx + 1}] ${item}`).join("\n") : "  None identified."}

SUMMATIVE VERDICT:
"${verdict || ""}"
=======================================`.trim();

    navigator.clipboard.writeText(formattedReport)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy assessment: ", err);
      });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-8 animate-fade-in-up" id="output-panel-root">
      {/* SECTION 1: Quality Score & Topic Badge */}
      <section className="border-b border-gray-100 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">
              Topic Domain
            </span>
            <h2 className="text-lg font-bold text-slate-800 font-sans mt-0.5">
              {topic || "Proposition Review"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">
                Risk Rating
              </span>
              <p className={`text-base capitalize uppercase font-sans text-xs ${getRiskColorClass(risk)}`}>
                {risk} Risk
              </p>
            </div>
            <div className="bg-slate-50 border border-gray-200 rounded-md p-3 text-center min-w-[70px]">
              <span className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase font-sans">
                SCORE
              </span>
              <span className="text-lg font-extrabold text-slate-800 font-sans">
                {score}
              </span>
              <span className="text-gray-400 text-[9px] font-semibold"> / 100</span>
            </div>
          </div>
        </div>

        {/* Diagnostic rating message block */}
        <div className={`mt-4 px-3 py-2 rounded-md text-xs font-semibold border ${scoreRating.bg} font-sans`}>
          Diagnostic: <span className="underline">{scoreRating.text}</span> — Undergoing severe dialectic stress.
        </div>
      </section>

      {/* SECTION 2: Hidden Assumptions list */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase font-sans border-b border-gray-150 pb-2">
          Hidden Assumptions
        </h3>
        <p className="text-xs text-gray-400 italic">
          To succeed, this proposal assumes these unproven conditions are absolutely true:
        </p>
        <ul className="space-y-2.5">
          {assumptions && assumptions.map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-slate-400 text-xs mt-0.5 select-none font-semibold">↳</span>
              <span className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 3: Counter Arguments */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase font-sans border-b border-gray-150 pb-2">
          Counter Arguments
        </h3>
        <ul className="space-y-3">
          {counterArguments && counterArguments.map((arg, index) => {
            // Find colon separator to bold key labels
            const colonIndex = arg.indexOf(":");
            if (colonIndex !== -1) {
              const label = arg.substring(0, colonIndex + 1);
              const body = arg.substring(colonIndex + 1);
              return (
                <li key={index} className="bg-amber-50/15 border border-gray-100 rounded-md p-3 text-slate-700">
                  <span className="text-xs font-bold text-slate-800 font-sans">{label}</span>
                  <span className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">{body}</span>
                </li>
              );
            }
            return (
              <li key={index} className="bg-slate-50/40 border border-gray-100 rounded-md p-3 text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
                {arg}
              </li>
            );
          })}
        </ul>
      </section>

      {/* SECTION 4: Final Verdict */}
      <section className="pt-2 space-y-4 animate-verdict">
        <div className="border hover:bg-slate-50 border-slate-800 rounded-md p-4 bg-slate-50 transition-colors duration-150 ease-out" id="box-final-verdict">
          <h4 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase font-sans mb-1">
            Dialectic Verdict
          </h4>
          <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold italic font-sans">
            "{verdict}"
          </p>
        </div>
        
        {/* Copy Analysis Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCopyAnalysis}
            className={`px-4 py-2 text-xs font-semibold rounded-md border transition-colors duration-150 ease-out cursor-pointer ${
              copied
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-800 text-slate-800 hover:bg-slate-50 active:bg-slate-100"
            }`}
            id="btn-copy-analysis"
          >
            {copied ? "Copied to Clipboard" : "Copy Analysis"}
          </button>
        </div>
      </section>
    </div>
  );
}
