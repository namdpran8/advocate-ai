import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import { analyzeIdea } from "./data/mockData";

/**
 * ============================================================================
 * ADVOCATE App component
 * ============================================================================
 * LAYOUT STRUCTURE:
 * - A simple horizontal top banner showing Logo and PDF/TXT export trigger.
 * - Two-column main workspace:
 *   - Left Column: Active inputs (Idea textual entry, selected mode radios, analysis button).
 *   - Right Column: Immediate dialectical output panels (Quality scorecard, assumptions list, detailed rebuttals, verdict card).
 * - Bottom Row Full-Width: Historical Session Ledger listing past attempts with active recall support.
 * 
 * WHY TWO-COLUMN DESIGN IS USED:
 * - Emulates side-by-side editing workflows resembling professional editor/previewer or terminal-oriented debuggers.
 * - Ensures high visibility side-by-side relative comparison without vertical scrolling stress.
 * 
 * STATE MANAGEMENT:
 * - ideaText (string): Text input bound to the textarea.
 * - selectedMode (string): Track "Demolish" | "Socratic" | "Steel Ring" styles of disagreement.
 * - activeSessionId (number|null): Holds ID of current selection in focus, supporting highlight.
 * - activeAnalysis (object|null): Stores the selected active report in focus for the OutputPanel.
 * - isLoading (boolean): Simulates backend deep deconstruction time frame.
 * - historyList (Array): Accumulates analyzed sessions.
 */
export default function App() {
  // Input fields state
  const [ideaText, setIdeaText] = useState("");
  const [selectedMode, setSelectedMode] = useState("Demolish");
  
  // Active report states
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  // Loading overlay state
  const [isLoading, setIsLoading] = useState(false);

  // Expanded seed database containing prefilled outputs for preseeded historical rows
  const [historyList, setHistoryList] = useState([
    {
      id: 3,
      idea: "Automated billing software for freelance content creators and designers.",
      mode: "Steel Ring",
      risk: "Low",
      score: 75,
      date: "2026-06-20",
      topic: "Freelance SaaS billing tool",
      assumptions: [
        "Assumes freelancers want another billing workspace instead of standard free spreadsheets.",
        "Assumes clients will pay recurring transaction invoices using a newly-introduced platform style."
      ],
      counterArguments: [
        "The Strongest Case: Standard bills ignore freelancer hourly tracking. Combining tracking, automatic ledger triggers, and automated tax withholding speeds payment times by up to 40%.",
        "The Fatal Flaw: Razor-thin freelance margins. Freelanced work fluctuates heavily; if their volume falls, subscription expense becomes the first overhead they instantly cancel."
      ],
      verdict: "High workflow automation that is heavily dependent on unpredictable, volatile freelance budgets."
    },
    {
      id: 2,
      idea: "Specialty cat-themed coffee shop in a tech-hub neighborhood.",
      mode: "Socratic",
      risk: "Medium",
      score: 61,
      date: "2026-06-19",
      topic: "Physical Retail / Cat Cafe",
      assumptions: [
        "Assumes city health regulators permit cats and hot food prep within local facilities.",
        "Assumes high patron volume sustains high commercial retail overhead leases."
      ],
      counterArguments: [
        "What specific animal control rules impact raw food preparation inside your zone?",
        "If patron traffic shifts heavily remote and leaves local spaces, how do you sustain fixed rental debt?",
        "Are patrons coming for coffee, or is cats-as-novelty the only recurring differentiator you hold?"
      ],
      verdict: "Engaging physical concept, currently highly sensitive to municipal health codes and lease costs."
    },
    {
      id: 1,
      idea: "Peer-to-peer textbook lending marketplace with dynamic rental pricing.",
      mode: "Demolish",
      risk: "High",
      score: 34,
      date: "18 June 2026",
      topic: "Student Textbook Exchange",
      assumptions: [
        "Assumes students will manually package and ship standard books to each other daily.",
        "Assumes publishers won't block physical redistribution copies via native digital tokens."
      ],
      counterArguments: [
        "Decaying Asset: Publishers release new textbook editions every 18 months, rendering previous rental inventories completely worthless.",
        "High Courier Cost: Courier transit overhead consumes most of the student's rent margins.",
        "E-Book Paradigm: Libraries and professors are rapidly switching entirely to cloud e-licenses, rendering physical copies obsolete."
      ],
      verdict: "Vulnerable to rapidly consolidating digital textbook licenses and high courier operations overhead."
    }
  ]);

  /**
   * Action: Analyze current input text.
   * Simulates active dialectic processing, generates results, and writes to history.
   */
  const handleAnalyze = () => {
    if (!ideaText.trim() || isLoading) return;

    setIsLoading(true);
    setActiveAnalysis(null);
    setActiveSessionId(null);

    // Simulate standard AI review latency
    setTimeout(() => {
      try {
        const result = analyzeIdea(ideaText, selectedMode);
        
        if (result) {
          const newId = Date.now();
          const today = new Date().toISOString().split("T")[0];
          
          const newRecord = {
            id: newId,
            idea: ideaText.trim(),
            mode: selectedMode,
            risk: result.risk,
            score: result.score,
            date: today,
            topic: result.topic,
            assumptions: result.assumptions,
            counterArguments: result.counterArguments,
            verdict: result.verdict
          };

          // Store new evaluation both globally and at the front of table listings
          setActiveAnalysis(newRecord);
          setActiveSessionId(newId);
          setHistoryList((prev) => [newRecord, ...prev]);
        }
      } catch (error) {
        console.error("Dialectic stress error on execution:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  /**
   * Restore historical results back to viewport focus
   * 
   * @param {object} session - Session selection
   */
  const handleSelectSession = (session) => {
    setIdeaText(session.idea);
    setSelectedMode(session.mode);
    setActiveAnalysis(session);
    setActiveSessionId(session.id);
  };

  /**
   * PDF Assessment exporter using jsPDF
   * Outputs a beautifully structured, minimalist executive review document.
   */
  const handleExportPDF = () => {
    if (!activeAnalysis) return;

    const { topic, score, risk, idea, mode, assumptions, counterArguments, verdict, date } = activeAnalysis;
    const formattedDate = date || new Date().toISOString().split("T")[0];
    const safeTopicName = (topic || "report").toLowerCase().replace(/[^a-z0-9]/gi, "_");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Dark grey primary typography, slate-500 secondary, safe borders
    const primaryColor = [15, 23, 42]; // slate-900
    const mutedColor = [100, 116, 139]; // slate-500
    const lightLine = [226, 232, 240]; // slate-200
    const lightFill = [248, 250, 252]; // slate-50

    // Coordinates and page borders
    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    // Helper: Dynamic page overflow safety
    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // --- BRAND HEADER ---
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("ADVOCATE", margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text("/ Dialectical Assessment Report", margin + 50, y - 1);

    y += 4;
    doc.setDrawColor(lightLine[0], lightLine[1], lightLine[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    
    y += 10;

    // --- SUB HEADER INTRO ---
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("DIALECTICAL DIAGNOSTIC SURVEY", margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(`DATE OF ISSUE: ${formattedDate}`, margin + contentWidth - 55, y);

    y += 6;

    // Stat Dashboard container block
    doc.setFillColor(lightFill[0], lightFill[1], lightFill[2]);
    doc.rect(margin, y, contentWidth, 20, "F");
    doc.rect(margin, y, contentWidth, 20, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text("TOPIC DOMAIN", margin + 6, y + 7);
    doc.text("METHODOLOGY MODE", margin + 55, y + 7);
    doc.text("DIALECTIC RISK", margin + 105, y + 7);
    doc.text("STRESS SCORE", margin + 145, y + 7);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    const truncateTopic = (topic || "General Idea").toUpperCase();
    doc.text(truncateTopic.length > 22 ? truncateTopic.substring(0, 21) + "..." : truncateTopic, margin + 6, y + 14);
    doc.text(`${mode.toUpperCase()} MODE`, margin + 55, y + 14);
    
    // Risk Level Highlight
    let rColor = [100, 116, 139]; 
    if (risk.toLowerCase() === "high") rColor = [220, 38, 38]; 
    else if (risk.toLowerCase() === "medium") rColor = [217, 119, 6]; 
    else if (risk.toLowerCase() === "low") rColor = [5, 150, 105]; 
    
    doc.setTextColor(rColor[0], rColor[1], rColor[2]);
    doc.text(`${risk.toUpperCase()}`, margin + 105, y + 14);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${score} / 100`, margin + 145, y + 14);

    y += 28;

    // --- SECTION 1: PROPOSAL ---
    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("1. THE ORIGINAL PROPOSAL", margin, y);
    
    y += 5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    const splitProposal = doc.splitTextToSize(`"${idea}"`, contentWidth);
    doc.text(splitProposal, margin, y);
    y += (splitProposal.length * 5) + 10;

    // --- SECTION 2: HIDDEN ASSUMPTIONS ---
    checkPageBreak(30);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("2. CONCEALED ARCHITECTURAL ASSUMPTIONS", margin, y);
    
    y += 5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text("To succeed, this proposal is highly reliant on the following unproven assumptions remaining absolute truths:", margin, y);
    y += 6;

    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    assumptions.forEach((assumption) => {
      const splitBullet = doc.splitTextToSize(`↳  ${assumption}`, contentWidth - 4);
      checkPageBreak(splitBullet.length * 5 + 4);
      doc.text(splitBullet, margin, y);
      y += (splitBullet.length * 5) + 3;
    });

    y += 8;

    // --- SECTION 3: COUNTER ARGUMENTS ---
    checkPageBreak(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("3. SYSTEMIC COUNTER ARGUMENTS", margin, y);
    y += 6;

    counterArguments.forEach((argument) => {
      const colonIndex = argument.indexOf(":");
      let label = "";
      let bodyText = argument;

      if (colonIndex !== -1) {
        label = argument.substring(0, colonIndex + 1);
        bodyText = argument.substring(colonIndex + 1).trim();
      }

      const splitLabel = label ? doc.splitTextToSize(label, contentWidth - 8) : [];
      const splitBody = doc.splitTextToSize(label ? bodyText : argument, contentWidth - 8);
      const linesCount = splitLabel.length + splitBody.length;
      
      const cardHeight = (linesCount * 5) + 6;
      checkPageBreak(cardHeight + 6);

      // Simple light colored rect container
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, cardHeight, "FD");

      let textY = y + 4.5;
      if (label) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(splitLabel, margin + 4, textY);
        textY += (splitLabel.length * 5);
      }
      
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(splitBody, margin + 4, textY);
      
      y += cardHeight + 5;
    });

    y += 5;

    // --- SECTION 4: DIALECTIC VERDICT ---
    checkPageBreak(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("4. DIALECTIC VERDICT", margin, y);
    y += 5;

    const splitVerdict = doc.splitTextToSize(`"${verdict}"`, contentWidth - 8);
    const boxHeight = (splitVerdict.length * 5) + 10;
    
    checkPageBreak(boxHeight + 10);

    // Render clean high-contrast card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(15, 23, 42); // slate-900 border
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, boxHeight, "FD");

    doc.setFont("Helvetica", "bolditalic");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(splitVerdict, margin + 4, y + 7);

    // Document footer note
    y = pageHeight - 15;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text("ADVOCATE REPORT GENERATION SERVICE • STRUCTURAL VALIDITY UNIT • SYSTEM CONFIDENTIAL", margin, y);

    doc.save(`ADVOCATE-Assessment-${safeTopicName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-800">
      {/* 1️⃣ Top Horizonal Header */}
      <Header 
        hasAnalysis={!!activeAnalysis && !isLoading} 
        onExport={handleExportPDF} 
      />

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* 2️⃣ Workstation Main View: 2-Column Side-by-Side Flex */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Area (Span 5 on Large Screens) */}
          <div className="lg:col-span-5 h-full">
            <InputPanel
              ideaText={ideaText}
              setIdeaText={setIdeaText}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column Area (Span 7 on Large Screens) */}
          <div className="lg:col-span-7 h-full">
            <OutputPanel
              analysisResult={activeAnalysis}
              isLoading={isLoading}
            />
          </div>

        </div>

      </main>

      {/* Corporate aesthetic system-level footer */}
      <footer className="py-6 border-t border-gray-200 bg-white text-center select-none text-[10px] text-gray-400 font-sans tracking-wide">
        ADVOCATE DIALECTICAL OFFICE SYSTEM © 2026 • WORK WITHIN TOTAL REASON
      </footer>
    </div>
  );
}
