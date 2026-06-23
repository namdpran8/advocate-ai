import React from "react";
import { motion } from "motion/react";
import logoImg from "../assets/images/advocate_owl_logo_1781994586325.jpg";

/**
 * InputPanel Component (Custom Sidebar)
 * Handles user input for the idea text and selected disagree-mode.
 * Sizing: Sidebar layout, custom radio card components and active session history recall.
 * 
 * @param {object} props
 * @param {string} props.ideaText - Current value of the input idea
 * @param {Function} props.setIdeaText - State setter for input idea
 * @param {string} props.selectedMode - Mode selected ("Demolish" | "Socratic" | "Steel Ring")
 * @param {Function} props.setSelectedMode - State setter for mode
 * @param {Function} props.onAnalyze - Submit analyze handler
 * @param {boolean} props.isLoading - Loading state toggle
 * @param {Array} props.historyList - Previous session logs
 * @param {number|null} props.activeSessionId - Currently selected session ID
 * @param {Function} props.onSelectSession - Callback when clicking a past session
 */
export default function InputPanel({
  ideaText,
  setIdeaText,
  selectedMode,
  setSelectedMode,
  onAnalyze,
  isLoading,
  historyList = [],
  activeSessionId = null,
  onSelectSession
}) {
  const charLimit = 1000;

  const modeOptions = [
    {
      id: "Demolish",
      title: "Demolish Mode",
      description: "Find every fatal flaw. No mercy, no hedging."
    },
    {
      id: "Socratic",
      title: "Socratic Mode",
      description: "Challenge through questions. Surface hidden gaps."
    },
    {
      id: "Steel Ring",
      title: "Steel Ring Mode",
      description: "Argue the strongest version of your idea — then attack it."
    }
  ];

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setIdeaText(val);
    }
  };

  const handleClear = () => {
    setIdeaText("");
    setSelectedMode("Demolish");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (ideaText.trim() && !isLoading) {
      onAnalyze();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* 1️⃣ Sidebar Branding Header */}
        <div 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-3 select-none border-b border-stone-850 pb-4 cursor-pointer group"
        >
          <motion.div 
            className="w-9 h-9 rounded-xl overflow-hidden border border-stone-800 bg-[#161615] flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <img
              src={logoImg}
              alt="ADVOCATE Owl Logo"
              className="w-full h-full object-cover scale-[1.12]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div>
            <h2 className="text-base font-bold tracking-wider text-stone-100 font-display uppercase leading-tight group-hover:text-white transition-colors">
              ADVOCATE
            </h2>
          </div>
        </div>

        {/* 2️⃣ Form Section */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Idea text area */}
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase flex items-center space-x-1.5">
              <span className="text-[#df4d3f]">✦</span>
              <span>Your Proposal</span>
            </label>
            <div className="relative">
              <textarea
                value={ideaText}
                onChange={handleTextChange}
                placeholder="Describe your proposal, idea, or strategic decision. Be as specific as possible — vague inputs produce generic feedback."
                rows={5}
                disabled={isLoading}
                className="w-full text-xs text-stone-200 p-3.5 border border-stone-800 rounded-md focus:outline-none focus:border-stone-600 placeholder-stone-600 bg-[#111110] resize-none transition-colors duration-150 ease-out leading-relaxed"
                id="txt-idea-input"
              />
              {/* Dynamic Character Count */}
              <div className="text-right text-[10px] text-stone-600 mt-1 select-none font-mono">
                {ideaText.length} / {charLimit}
              </div>
            </div>
          </div>

          {/* Mode selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase flex items-center space-x-1.5">
              <span className="text-[#df4d3f]">✦</span>
              <span>Disagreement Style</span>
            </label>
            <div className="space-y-2">
              {modeOptions.map((opt) => {
                const isSelected = selectedMode === opt.id;
                return (
                  <motion.div
                    key={opt.id}
                    onClick={() => !isLoading && setSelectedMode(opt.id)}
                    className={`border rounded-md p-3 cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "border-[#df4d3f]/60 bg-[#171716] text-stone-100 shadow-[0_0_12px_rgba(223,77,63,0.1)]"
                        : "border-stone-800 bg-[#111110] text-stone-400 hover:border-stone-700/80 hover:bg-[#151514]"
                    }`}
                    whileHover={!isLoading ? { 
                      y: -2, 
                      scale: 1.015
                    } : {}}
                    whileTap={!isLoading ? { scale: 0.99 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    id={`mode-card-${opt.id.toLowerCase().replace(" ", "-")}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex items-center justify-center">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors duration-150 ${
                          isSelected ? "border-[#df4d3f] bg-[#df4d3f]" : "border-stone-700 bg-stone-900"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-stone-100" />}
                        </div>
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className={`text-[11px] font-bold font-sans tracking-wide ${isSelected ? "text-stone-100" : "text-stone-300"}`}>
                          {opt.title}
                        </span>
                        <span className="text-[10px] text-stone-500 leading-normal mt-0.5">
                          {opt.description}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Form Submission and Clear Buttons */}
          <div className="flex space-x-2 pt-2">
            <motion.button
              type="button"
              onClick={handleClear}
              disabled={isLoading || (!ideaText && selectedMode === "Demolish")}
              className={`py-2.5 px-3 rounded-md font-semibold text-[10px] uppercase tracking-wider transition-colors duration-150 ease-out border w-1/4 ${
                isLoading || (!ideaText && selectedMode === "Demolish")
                  ? "bg-stone-900/50 text-stone-600 border-stone-900 cursor-not-allowed"
                  : "bg-[#111110] text-stone-400 border-stone-800 hover:text-stone-200 cursor-pointer"
              }`}
              whileHover={!(isLoading || (!ideaText && selectedMode === "Demolish")) ? { scale: 1.03, y: -1 } : {}}
              whileTap={!(isLoading || (!ideaText && selectedMode === "Demolish")) ? { scale: 0.97 } : {}}
              id="btn-clear-input"
            >
              Clear
            </motion.button>
            <motion.button
              type="submit"
              disabled={!ideaText.trim() || isLoading}
              className={`flex-1 py-2.5 px-4 rounded-md font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 ease-out border ${
                ideaText.trim() && !isLoading
                  ? "bg-[#df4d3f] hover:bg-[#e05649] active:bg-[#c93f32] text-white border-[#df4d3f] cursor-pointer"
                  : "bg-stone-900 text-stone-600 border-stone-900 cursor-not-allowed"
              }`}
              whileHover={ideaText.trim() && !isLoading ? { 
                scale: 1.02, 
                y: -1, 
                boxShadow: "0 4px 15px rgba(223, 77, 63, 0.3)" 
              } : {}}
              whileTap={ideaText.trim() && !isLoading ? { scale: 0.98 } : {}}
              id="btn-analyze"
            >
              {isLoading ? "Challenging..." : "Analyze Proposal"}
            </motion.button>
          </div>
        </form>


      </div>

      {/* Advisory Note */}
      <p className="text-[9px] text-stone-500 leading-relaxed pt-3 border-t border-stone-850 font-sans select-none">
        ADVOCATE will actively identify blindspots, rebut arguments, and challenge assumptions. Work within total reason.
      </p>
    </div>
  );
}
