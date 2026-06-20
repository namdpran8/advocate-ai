import React from "react";
import logoImg from "../assets/images/advocate_owl_logo_1781994586325.jpg";

/**
 * Header Component
 * Provides the horizontal navbar with logo and export capability.
 * Layout: Horizontally aligned split brand and call to action.
 * Style: Clean light borders, zero heavy shadows, Arial/system-ui style.
 * 
 * @param {object} props
 * @param {boolean} props.hasAnalysis - Whether there's an active analysis to export
 * @param {Function} props.onExport - Function to export the current evaluation
 */
export default function Header({ hasAnalysis, onExport }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-8 flex justify-between items-center">
      {/* Brand logo section */}
      <div className="flex items-center space-x-3 select-none">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-slate-50 flex items-center justify-center" id="header-logo-container">
          <img
            src={logoImg}
            alt="ADVOCATE Critic Owl Logo"
            className="w-full h-full object-cover scale-[1.15]"
            referrerPolicy="no-referrer"
            id="img-header-logo"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-wider text-slate-900 font-sans" id="header-logo-text">
          ADVOCATE
        </h1>
      </div>

      {/* Action panel */}
      <div>
        <button
          onClick={onExport}
          disabled={!hasAnalysis}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors duration-150 ease-out border ${
            hasAnalysis
              ? "bg-white text-slate-900 border-slate-900 cursor-pointer hover:bg-slate-50 active:bg-slate-100"
              : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
          }`}
          title={hasAnalysis ? "Export current analysis as PDF/Text report" : "Run an analysis first to export"}
          id="btn-export-pdf"
        >
          Export PDF
        </button>
      </div>
    </header>
  );
}
