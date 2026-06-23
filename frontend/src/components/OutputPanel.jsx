import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import logoImg from "../assets/images/advocate_owl_logo_1781994586325.jpg";
import { playCounterSound } from "../utils/audio";

/**
 * OutputPanel Component
 * Renders the results of the critique in the main display pane.
 * Layout: Four clearly defined sections: Quality Score, Hidden Assumptions, Counter Arguments, Final Verdict.
 * Custom Styles: Premium high-contrast layout, elegant warm white card, smooth transitions.
 * 
 * @param {object} props
 * @param {object|null} props.analysisResult - Current evaluation result object
 * @param {boolean} props.isLoading - Whether an analysis is currently running
 * @param {Function} props.onExportPDF - Callback to export current evaluation as PDF
 */
export default function OutputPanel({ analysisResult, isLoading, onExportPDF }) {
  const [copied, setCopied] = useState(false);

  const assumptions = analysisResult?.assumptions;
  const counterArguments = analysisResult?.counterArguments;
  const pointsCount = (assumptions?.length || 0) + (counterArguments?.length || 0);

  // Play a subtle minimalist tick sound when the analyzed points count is loaded or increases
  useEffect(() => {
    if (pointsCount > 0) {
      const timer = setTimeout(() => {
        playCounterSound();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [pointsCount]);

  // Empty or placeholder state matching PostCraft
  if (!analysisResult && !isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white border border-gray-250 rounded-lg p-12 flex flex-col justify-center items-center min-h-[440px] text-center shadow-sm select-none" 
        id="output-placeholder"
      >
        <div className="max-w-md space-y-6">
          {/* Document and check illustration */}
          <motion.div 
            className="w-20 h-20 rounded-full bg-stone-50 border border-dashed border-stone-200 flex items-center justify-center mx-auto relative cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 rounded-lg border border-stone-200 flex items-center justify-center bg-white shadow-sm">
              <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {/* Success check badge overlapping */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-stone-800 font-sans tracking-tight">
               Your next dialectical critique starts here
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Provide your proposal in the sidebar and choose a disagreement style, then hit Analyze to challenge it with raw Socratic critique.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Loading / Deconstructing state
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-250 rounded-lg p-12 flex flex-col justify-center items-center min-h-[440px] text-center shadow-sm" 
        id="output-loading-pane"
      >
        <div className="space-y-6">
          {/* Elegant Animated Logo Container */}
          <div className="relative flex justify-center items-center pb-2">
            {/* Pulsing/Expanding decorative ring backgrounds */}
            <motion.div
              className="absolute w-28 h-28 rounded-full bg-[#df4d3f]/10 border border-[#df4d3f]/20 blur-xs"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-22 h-22 rounded-full bg-[#df4d3f]/5 border border-[#df4d3f]/10"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.8, 0.4, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* The Actual Logo with floating & heartbeat-like pulsing */}
            <motion.div
              className="relative w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 bg-[#161615] flex items-center justify-center shadow-lg p-0.5"
              animate={{
                y: [0, -6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={logoImg}
                alt="ADVOCATE Owl Logo"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Subtle typing indicator dot container */}
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#df4d3f] animate-pulse-dot-1"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#df4d3f] animate-pulse-dot-2"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#df4d3f] animate-pulse-dot-3"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-850 uppercase tracking-widest font-sans animate-pulse">
              Advocate is thinking...
            </p>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed italic">
              Formulating dialectic stress tests, seeking unstated assumptions, and constructing systemic rebuttals.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Active status variables
  const { topic, score, risk, verdict } = analysisResult;

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
        return "text-stone-500";
    }
  };

  // Determine Score category rating text
  const getScoreRating = (val) => {
    if (val < 40) return { text: "Severely Compromised", bg: "bg-red-50 text-red-800 border-red-200/50" };
    if (val < 60) return { text: "Highly Vulnerable", bg: "bg-amber-50 text-amber-800 border-amber-200/50" };
    if (val < 75) return { text: "Moderately Viable", bg: "bg-blue-50 text-blue-800 border-blue-200/50" };
    return { text: "Relatively Robust", bg: "bg-emerald-50 text-emerald-800 border-emerald-200/50" };
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
POINTS ARGUED:   ${pointsCount}

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
  };  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1] // Luxury modern cubic bezier ease-out
      }}
      className="bg-white border border-gray-250 rounded-lg p-6 md:p-8 space-y-8 shadow-sm text-stone-800" 
      id="output-panel-root"
    >
      
      {/* SECTION 1: Quality Score & Topic Badge */}
      <section className="border-b border-stone-100 pb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase font-sans">
              Topic Domain
            </span>
            <h2 className="text-base md:text-lg font-bold text-stone-900 font-display mt-0.5 leading-tight">
              {topic || "Proposition Review"}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 shrink-0">
            <div className="text-right">
              <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase font-sans">
                Risk Rating
              </span>
              <p className={`text-xs capitalize font-bold font-sans mt-0.5 ${getRiskColorClass(risk)}`}>
                {risk} Risk
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-stone-50 border border-stone-200/80 rounded-md p-2.5 text-center min-w-[75px] select-none transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <span className="block text-[8px] font-bold tracking-widest text-stone-400 uppercase font-sans">
                POINTS ARGUED
              </span>
              <span className="text-base font-extrabold text-[#df4d3f] font-sans leading-none">
                {pointsCount}
              </span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-stone-50 border border-stone-200/80 rounded-md p-2.5 text-center min-w-[75px] select-none transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <span className="block text-[8px] font-bold tracking-widest text-stone-400 uppercase font-sans">
                STRESS SCORE
              </span>
              <span className="text-base font-extrabold text-stone-900 font-sans leading-none">
                {score}
              </span>
              <span className="text-stone-400 text-[9px] font-semibold"> / 100</span>
            </motion.div>
          </div>
        </div>

        {/* Diagnostic rating message block */}
        <div className={`mt-4 px-3 py-2 rounded-md text-xs font-semibold border ${scoreRating.bg} font-sans`}>
          Diagnostic Rating: <span className="underline">{scoreRating.text}</span> — Undergoing dialectic stress testing.
        </div>
      </section>

      {/* SECTION 2: Hidden Assumptions list */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-sans border-b border-stone-100 pb-2">
          ✦ Hidden Assumptions
        </h3>
        <p className="text-[11px] text-stone-500 leading-relaxed italic">
          To hold true, this proposal inherently assumes these unproven conditions remain absolute facts:
        </p>
        <ul className="space-y-2.5">
          {assumptions && assumptions.map((item, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ x: 6, backgroundColor: "rgba(245,245,244,0.5)" }}
              className="flex items-start space-x-3 p-1.5 rounded transition-colors duration-150 cursor-default"
            >
              <span className="text-stone-400 text-xs mt-0.5 select-none font-bold">↳</span>
              <span className="text-xs md:text-sm text-stone-700 leading-relaxed font-sans">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* SECTION 3: Counter Arguments */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-sans border-b border-stone-100 pb-2">
          ✦ Systemic Counter Arguments
        </h3>
        <ul className="space-y-3">
          {counterArguments && counterArguments.map((arg, index) => {
            // Find colon separator to bold key labels
            const colonIndex = arg.indexOf(":");
            const isLabel = colonIndex !== -1;
            const label = isLabel ? arg.substring(0, colonIndex + 1) : "";
            const body = isLabel ? arg.substring(colonIndex + 1) : arg;
            
            return (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.2, type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ y: -2, scale: 1.006, borderColor: "rgba(223,77,63,0.25)", boxShadow: "0 6px 16px rgba(0,0,0,0.02)" }}
                className="bg-stone-50/70 border border-stone-200/50 rounded-md p-3.5 text-stone-700 transition-all duration-200 cursor-default"
              >
                {isLabel ? (
                  <>
                    <span className="text-xs font-bold text-stone-900 font-sans block mb-1">{label}</span>
                    <span className="text-xs md:text-sm text-stone-600 leading-relaxed font-sans">{body}</span>
                  </>
                ) : (
                  <span className="text-xs md:text-sm text-stone-600 leading-relaxed font-sans">{body}</span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* SECTION 4: Final Verdict */}
      <section className="pt-2 space-y-5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.005 }}
          className="border border-stone-800 rounded-md p-4 bg-stone-50 shadow-sm cursor-default" 
          id="box-final-verdict"
        >
          <h4 className="text-[9px] font-bold tracking-widest text-stone-500 uppercase font-sans mb-1.5">
            Dialectic Verdict
          </h4>
          <p className="text-xs md:text-sm text-stone-900 leading-relaxed font-bold italic font-sans">
            "{verdict}"
          </p>
        </motion.div>
        
        {/* Actions Button Row */}
        <div className="flex justify-end space-x-2.5 pt-2 border-t border-stone-100">
          <motion.button
            onClick={onExportPDF}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 transition-colors duration-150 ease-out cursor-pointer flex items-center space-x-2 shadow-xs"
            id="btn-export-pdf"
          >
            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export PDF</span>
          </motion.button>

          <motion.button
            onClick={handleCopyAnalysis}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-colors duration-150 ease-out cursor-pointer flex items-center space-x-2 shadow-xs ${
              copied
                ? "bg-stone-900 border-stone-900 text-white"
                : "bg-white border-stone-850 text-stone-850 hover:bg-stone-50"
            }`}
            id="btn-copy-analysis"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
            <span>{copied ? "Copied" : "Copy Analysis"}</span>
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
}
