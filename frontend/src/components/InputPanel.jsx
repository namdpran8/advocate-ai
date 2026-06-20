import React from "react";

/**
 * InputPanel Component
 * Handles user input for the idea text and selected disagree-mode.
 * Sizing: Desktop-first layout, custom radio card components.
 * Constraints: Rounded corners max 8px, clear labels, light borders.
 * 
 * @param {object} props
 * @param {string} props.ideaText - Current value of the input idea
 * @param {Function} props.setIdeaText - State setter for input idea
 * @param {string} props.selectedMode - Mode selected ("Demolish" | "Socratic" | "Steel Ring")
 * @param {Function} props.setSelectedMode - State setter for mode
 * @param {Function} props.onAnalyze - Submit analyze handler
 * @param {boolean} props.isLoading - Loading state toggle
 */
export default function InputPanel({
  ideaText,
  setIdeaText,
  selectedMode,
  setSelectedMode,
  onAnalyze,
  isLoading
}) {
  const charLimit = 1000;

  const modeOptions = [
    {
      id: "Demolish",
      title: "Demolish",
      description: "Find every fatal flaw. No mercy, no hedging."
    },
    {
      id: "Socratic",
      title: "Socratic",
      description: "Challenge through questions. Surface hidden gaps."
    },
    {
      id: "Steel Ring",
      title: "Steel Ring",
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-auto">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Idea text area */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-sans">
            Your Idea
          </label>
          <div className="relative">
            <textarea
              value={ideaText}
              onChange={handleTextChange}
              placeholder="Describe your idea, proposal, or argument in plain language. Be as specific as possible — vague input produces vague critique."
              rows={6}
              disabled={isLoading}
              className="w-full text-sm text-slate-800 p-4 border border-gray-200 rounded-md focus:outline-none focus:border-slate-800 placeholder-gray-400 bg-white resize-y transition-colors duration-150 ease-out leading-relaxed"
              id="txt-idea-input"
            />
            {/* Dynamic Character Count */}
            <div className="text-right text-xs text-gray-400 mt-1 select-none font-mono">
              {ideaText.length} / {charLimit}
            </div>
          </div>
        </div>

        {/* Mode selection (Simple custom radio button cards) */}
        <div className="flex flex-col space-y-3">
          <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-sans">
            Analysis Mode
          </label>
          <div className="space-y-3">
            {modeOptions.map((opt) => {
              const isSelected = selectedMode === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => !isLoading && setSelectedMode(opt.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors duration-150 ease-out ${
                    isSelected
                      ? "border-slate-800 bg-slate-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                  id={`mode-card-${opt.id.toLowerCase().replace(" ", "-")}`}
                >
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="analysis-mode"
                      value={opt.id}
                      checked={isSelected}
                      disabled={isLoading}
                      onChange={() => setSelectedMode(opt.id)}
                      className="mt-1 h-4 w-4 border-gray-300 text-slate-800 focus:ring-slate-800"
                    />
                    <div className="flex flex-col select-none">
                      <span className="text-sm font-semibold text-slate-900 font-sans">
                        {opt.title}
                      </span>
                      <span className="text-xs text-gray-500 leading-normal mt-0.5">
                        {opt.description}
                      </span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Submission and Clear Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || (!ideaText && selectedMode === "Demolish")}
            className={`w-1/3 py-3 px-4 rounded-md font-semibold text-xs uppercase tracking-wider transition-colors duration-150 ease-out border ${
              isLoading || (!ideaText && selectedMode === "Demolish")
                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
            }`}
            id="btn-clear-input"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!ideaText.trim() || isLoading}
            className={`flex-1 py-3 px-4 rounded-md font-semibold text-xs uppercase tracking-wider transition-colors duration-150 ease-out border ${
              ideaText.trim() && !isLoading
                ? "bg-slate-800 hover:bg-slate-900 active:bg-black text-white border-slate-800 cursor-pointer"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
            id="btn-analyze"
          >
            {isLoading ? "Challenging..." : "Analyze"}
          </button>
        </div>
      </form>

      {/* Advisory Note */}
      <p className="text-[11px] text-gray-400 leading-relaxed mt-6 border-t border-gray-100 pt-4 font-sans select-none">
        ADVOCATE will argue against your idea. This is intentional.
        The stronger the pushback, the more robust your thinking becomes.
      </p>
    </div>
  );
}
