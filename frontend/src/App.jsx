import React, { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "motion/react";
import { jsPDF } from "jspdf";
import { Volume2, VolumeX } from "lucide-react";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import { analyzeIdea } from "./data/mockData";
import { getMuteState, setMuteState, playCompletionSound, playCounterSound } from "./utils/audio";

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

  // Sound effects mute state
  const [isMuted, setIsMuted] = useState(getMuteState());

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setMuteState(nextMuted);
    if (!nextMuted) {
      // Small feedback click to indicate sound is enabled
      setTimeout(() => {
        playCounterSound();
      }, 50);
    }
  };

  // Ref for auto-scrolling to the active output or typing indicator
  const outputRef = useRef(null);

  // Auto-scroll to output element when loading starts or when results are loaded
  useEffect(() => {
    if (isLoading || activeAnalysis) {
      const timer = setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 120); // brief delay to let DOM and animations initialize
      return () => clearTimeout(timer);
    }
  }, [isLoading, activeAnalysis]);

  // Framer Motion values for the background follower light
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // Smooth springs for tracking the cursor gracefully
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.4 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

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
          playCompletionSound();
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
    <div className="relative min-h-screen bg-[#080807] flex flex-col lg:flex-row font-sans text-stone-100 select-none overflow-hidden">
      {/* Background radial glow following cursor */}
      <motion.div
        className="pointer-events-none fixed w-[350px] h-[350px] rounded-full bg-white/[0.04] blur-[90px] -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          left: springX,
          top: springY,
        }}
      />

      {/* Left Sidebar */}
      <aside className="relative z-10 w-full lg:w-[350px] xl:w-[380px] lg:h-screen lg:sticky lg:top-0 bg-[#0c0c0b]/85 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-stone-800/80 p-5 flex flex-col justify-between overflow-y-auto shrink-0">
        <InputPanel
          ideaText={ideaText}
          setIdeaText={setIdeaText}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          historyList={historyList}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
        />
      </aside>

      {/* Right Main Content Area */}
      <main className="relative z-10 flex-grow min-h-screen flex flex-col justify-between bg-[#080807]/75 backdrop-blur-md">
        <div className="max-w-4xl w-full mx-auto p-6 md:p-10 lg:p-12 space-y-8 flex-grow">
          
          {/* Spacer */}
          <div className="h-2"></div>

          {/* Brand Display Header */}
          <div className="select-none border-b border-stone-900 pb-5">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-100 font-display" id="main-display-title">
              ADVOCATE
            </h1>
            <p className="mt-1.5 text-stone-400 font-medium text-xs md:text-sm max-w-2xl leading-relaxed">
              A dialectical critique engine that exposes hidden assumptions — <span className="text-[#df4d3f]/90 font-semibold italic">not a validator.</span>
            </p>
          </div>

          {/* Output Panel Container */}
          <div ref={outputRef} className="pt-2">
            <OutputPanel
              analysisResult={activeAnalysis}
              isLoading={isLoading}
              onExportPDF={handleExportPDF}
            />
          </div>

        </div>

        {/* Corporate footer */}
        <footer className="py-6 border-t border-stone-900 bg-[#080807]/50 text-center select-none text-[9px] text-stone-600 font-sans tracking-widest uppercase">
          ADVOCATE • DIALECTICAL ASSESSMENT ENGINE • © 2026
        </footer>
      </main>

      {/* Minimalist Sound Control Toggle in absolute bottom-right corner of screen */}
      <motion.button
        onClick={handleToggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-200 cursor-pointer ${
          isMuted
            ? "bg-[#0c0c0b]/90 border-stone-800 text-stone-500 hover:text-stone-400 hover:border-stone-700 shadow-md"
            : "bg-[#df4d3f]/10 border-[#df4d3f]/30 text-[#df4d3f] hover:bg-[#df4d3f]/20 shadow-[0_0_15px_rgba(223,77,63,0.1)]"
        }`}
        id="btn-sound-toggle"
        title={isMuted ? "Unmute audio feedback" : "Mute audio feedback"}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span>Muted</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound On</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
