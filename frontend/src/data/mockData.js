/**
 * ADVOCATE Mock Analysis Engine
 * 
 * Provides highly contextualized critiques based on user input.
 * It scans keywords to deliver tailored Socratic, Demolish, or Steel Ring arguments.
 * Falls back to generic but intellectually provocative assessments.
 */

const KEYWORD_CONFIGS = [
  {
    keywords: ["ai", "gpt", "llm", "generator", "intelligent"],
    topic: "AI-Powered Software / Wrapper",
    risk: "High",
    scoreRange: [30, 48],
    assumptions: [
      "Assumes OpenAI/Google APIs will maintain current pricing and access policies.",
      "Assumes users will pay a premium for a wrapper they could build with basic prompting.",
      "Assumes foundational model providers won't release this exact feature as a default update next month.",
      "Assumes standard user data privacy constraints won't block corporate adoption."
    ],
    modes: {
      "Demolish": {
        counterArguments: [
          "Zero Moat: Your core value proposition relies entirely on standard API calls. Any competitor can copy your UI and features in a single weekend.",
          "Platform Risk: You are building on active quicksand. A single minor update from OpenAI rendering your core feature obsolete will instantly vaporize your business model.",
          "Churn Nightmare: AI curiosity is high, but long-term utility is low. Without proprietary data, retention will collapse once the novelty fades."
        ],
        verdict: "High-risk API dependency with absolute zero proprietary moat. This isn't a sustainable product; it is a temporary feature waiting to be native."
      },
      "Socratic": {
        counterArguments: [
          "If foundational models improve by 10x next year, does that make your product twice as valuable, or completely irrelevant?",
          "How will you defend your pricing margin when API access becomes fully commoditized?",
          "What specific proprietary data or user workflows do you capture that cannot be easily replicated by a competitor's prompt?"
        ],
        verdict: "A Socratic inquiry into API dependency. Excellent concept, but extremely vulnerable to structural shifts in foundational AI layers."
      },
      "Steel Ring": {
        counterArguments: [
          "The Strongest Case: By focusing intensely on a highly niche enterprise workflow (such as specific legal/medical compliance formatting), you can integrate deep into custom pipelines where raw LLMs fail. Standard users cannot easily replicate this.",
          "The Fatal Flaw: Even with deep workflow integration, the underlying LLM's hallucination rate remains unpredictable. If a single compliance file is wrong, you bear full legal liability, while your API provider bears zero."
        ],
        verdict: "An attempt to defend the workflow integration, ultimately collapsing under service liability and platform dependencies."
      }
    }
  },
  {
    keywords: ["crypto", "blockchain", "nft", "web3", "decentralized", "token"],
    topic: "Web3 / Decentralized Solution",
    risk: "High",
    scoreRange: [20, 38],
    assumptions: [
      "Assumes average consumers care about decentralization more than speed, cost, and convenience.",
      "Assumes extreme regulatory crackdowns won't restrict asset transfers or user on-ramps.",
      "Assumes block space costs and transaction fees won't render micro-interactions unfeasible."
    ],
    modes: {
      "Demolish": {
        counterArguments: [
          "A Solution in Search of a Problem: Standard SQL databases are 10,000x faster, cheaper, and easier to scale. You are adding massive complexity for minimal consumer utility.",
          "Extreme Friction: Requiring regular users to manage gas fees, private seed phrases, and wallet approvals is a user-experience death sentence.",
          "Speculative Mirage: Active metrics are heavily inflated by mercenary bots and airdrop farmers. Real utility is virtually non-existent."
        ],
        verdict: "Over-engineered distributed database wrapped in speculative hype. It does not solve any human crisis that central storage doesn't solve better."
      },
      "Socratic": {
        counterArguments: [
          "Why is decentralization the absolute optimal architecture for this specific problem, rather than a trusted centralized authority?",
          "If a user loses their private key, who recovers their assets? Does your solution trade security for unrecoverable user errors?",
          "How will you achieve mass-market user adoption when transaction latency is measured in seconds rather than milliseconds?"
        ],
        verdict: "Crucial structural questions regarding performance costs and user convenience vs blockchain ideological purity."
      },
      "Steel Ring": {
        counterArguments: [
          "The Strongest Case: Traditional databases suffer from trust deficits and single-point-of-failure censorship. Web3 architecture provides immutable global state that guarantees persistent ownership.",
          "The Fatal Flaw: Absolute immutability is actually a nightmare in consumer software. If a bug is exploited or a bad actor uploads illegal content, you lose all ability to edit, patch, or moderate the network."
        ],
        verdict: "A robust defense of censorship resistance that ultimately breaks down due to lack of administrative flexibility and moderate safety."
      }
    }
  },
  {
    keywords: ["coffee", "cafe", "restaurant", "shop", "bakery", "food", "retail"],
    topic: "Physical Retail / Cafe Venture",
    risk: "Medium",
    scoreRange: [45, 65],
    assumptions: [
      "Assumes foot traffic in your selected location will remain constant or grow.",
      "Assumes premium pricing can withstand regional cost-of-living adjustments.",
      "Assumes reliable supply chains and consistent raw ingredient costs.",
      "Assumes low employee turnover in a notoriously high-burnout sector."
    ],
    modes: {
      "Demolish": {
        counterArguments: [
          "Vaporizing Margins: High overhead, expensive commercial leases, equipment maintenance, and spoiling inventory will eat up your 10% target margin instantly.",
          "Competitor Saturation: Everyone thinks they can run a shop. You are entering an incredibly crowded market with absolute zero product differentiation.",
          "Operational Slavery: You aren't buying a business; you are buying a 90-hour-a-week physical management job with high financial liability."
        ],
        verdict: "Extremely saturated local retail model with razor-thin margins. High failure rates dictate that passion alone will not cover commercial rent."
      },
      "Socratic": {
        counterArguments: [
          "If a direct chain competitor opens up across the street with 30% lower prices, how does your business survive?",
          "How many cups of artisanal beverage must you sell daily just to break even on commercial rent alone?",
          "What makes your retail concept truly custom and memorable beyond basic aesthetic decor?"
        ],
        verdict: "A deep dive into lease obligations, volume thresholds, and regional competitor positioning."
      },
      "Steel Ring": {
        counterArguments: [
          "The Strongest Case: Community hubs are in high demand post-pandemic. By styling custom micro-roasting, proprietary items, and a unique atmosphere, you draw true loyalists.",
          "The Fatal Flaw: Scalability bottleneck. You cannot scale real community warmth. It relies completely on your presence-once you step away, standard employees rarely maintain that standard."
        ],
        verdict: "Excellent local engagement model that is structurally impossible to scale without diluting the core premium offering."
      }
    }
  },
  {
    keywords: ["app", "saas", "software", "subscription", "platform", "website"],
    topic: "SaaS Platform / Subscription App",
    risk: "Medium",
    scoreRange: [50, 70],
    assumptions: [
      "Assumes target customers feel this specific pain point strongly enough to pay recurring monthly fees.",
      "Assumes Customer Acquisition Cost (CAC) will remain lower than Customer Lifetime Value (LTV).",
      "Assumes users will actively check another dashboard instead of ignoring it after two weeks."
    ],
    modes: {
      "Demolish": {
        counterArguments: [
          "SaaS Fatigue: Users are drowning in subscriptions. Getting someone to add another monthly charge to their card requires a massive, painful problem, not a 'nice-to-have' utility.",
          "CAC Escalation: Digital ad prices are soaring. You will expend more money acquiring a single visitor than they will ever pay you in subscription fees.",
          "Integration Friction: If your app doesn't integrate seamlessly with their current workspace, they will never build the habit of opening it."
        ],
        verdict: "Standard SaaS pattern facing high customer adoption friction and subscription fatigue. Margins look great on paper, but CAC will kill the profit."
      },
      "Socratic": {
        counterArguments: [
          "Is this problem truly recurring, or is it a one-time issue that doesn't justify a monthly subscription?",
          "What existing tool (Excel, Google Sheets, paper notes) does your customer currently use to solve this, and why is that 'good enough' for them?",
          "How will you acquire your first 50 paying customers without spending a single dollar on digital ads?"
        ],
        verdict: "Critical questions targeting market behavior, habits, and unpaid distribution moats."
      },
      "Steel Ring": {
        counterArguments: [
          "The Strongest Case: Traditional software creates fragmented data silos. A specialized SaaS ties these workflows together, automating updates and saving teams dozens of active hours.",
          "The Fatal Flaw: The 'Excel' threat. No matter how sleek your system is, 80% of business operations return to custom spreadsheet hacks. Your biggest competitor isn't another startup; it's a free Google Sheet."
        ],
        verdict: "Highly functional product specification that faces structural behavior resistance from standard office legacy habits."
      }
    }
  }
];

const GENERIC_OBJECTIONS = {
  "Demolish": {
    scoreRange: [35, 55],
    risk: "Medium",
    assumptions: [
      "Assumes universal user consensus on the value of the core problem.",
      "Assumes zero friction during early system onboarding or purchase.",
      "Assumes competitors won't instantly match your core value proposition upon seeing success."
    ],
    counterArguments: [
      "Execution Dependency: The idea is highly theoretical. The real challenge is 99% operational distribution, not the concept. You have no clear unfair distribution advantage.",
      "High Substitution: Customers can easily accomplish this with free alternative habits, or simply ignore the problem entirely since it yields minimal immediate pain.",
      "Scale Overhead: The unit economics of managing high-touch client support or operations will quickly outgrow your lean initial revenue streams."
    ],
    verdict: "A solid conceptual vision that severely underestimates customer acquisition friction and operational delivery costs."
  },
  "Socratic": {
    scoreRange: [52, 72],
    risk: "Medium",
    assumptions: [
      "Assumes current market behaviors are permanent rather than a temporary trend.",
      "Assumes clear visibility into user motivation without direct feedback loops.",
      "Assumes the target audience is highly motivated to change their existing comfortable routine."
    ],
    counterArguments: [
      "What is the single most inconvenient step for a user trying to adopt this, and how can they bypass it entirely?",
      "If you were forced to launch this tomorrow with only $500 and a phone, how would you test your thesis?",
      "Who gains the most financial or personal utility from your idea, and are they the ones holding the budget?"
    ],
    verdict: "Intellectually solid, but requires rapid real-world validation of user behavioral friction before committing substantial capital."
  },
  "Steel Ring": {
    scoreRange: [58, 76],
    risk: "Medium",
    assumptions: [
      "Assumes the value saved (time, energy, cost) is higher than the cognitive overhead of learning a new system.",
      "Assumes your core team possesses the unique operational discipline to execute the specialized segments."
    ],
    counterArguments: [
      "The Strongest Case: By focusing on high-intent operators who have already spent substantial money trying to patchwork this solutions themselves, you tap into pre-validated demand with high pricing power.",
      "The Fatal Flaw: The niche may be so narrow that the overall addressable market size is too small to build a massive business, forcing you to expand into low-intent segments and dilute your product quality."
    ],
    verdict: "Excellent defense of highly focused niche targeting, though scaling beyond the early adopter demographic introduces substantial product dilution risks."
  }
};

/**
 * Dynamo analyzer function that generates a mock critique.
 * @param {string} ideaText - User input text 
 * @param {string} mode - Selected mode ("Demolish", "Socratic", "Steel Ring")
 * @returns {object} Formatted analysis results
 */
export function analyzeIdea(ideaText, mode) {
  if (!ideaText || ideaText.trim().length === 0) {
    return null;
  }

  const cleanedText = ideaText.toLowerCase();
  
  // Find matching keyword config
  let match = KEYWORD_CONFIGS.find(cfg => 
    cfg.keywords.some(keyword => cleanedText.includes(keyword))
  );

  let result = {};
  if (match) {
    const configMode = match.modes[mode] || match.modes["Demolish"];
    const range = match.scoreRange;
    const score = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    
    result = {
      topic: match.topic,
      score: score,
      risk: match.risk,
      assumptions: [...match.assumptions],
      counterArguments: [...configMode.counterArguments],
      verdict: configMode.verdict
    };
  } else {
    // Dynamic parsing to make generic reviews feel somewhat custom
    const generic = GENERIC_OBJECTIONS[mode] || GENERIC_OBJECTIONS["Demolish"];
    const range = generic.scoreRange;
    const score = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    
    // Extract a basic noun phrase from user content to make assumptions fit
    const words = ideaText.trim().split(/\s+/);
    const keyNoun = words.slice(0, 3).join(" ") + "...";

    const customAssumptions = [
      `Assumes that stakeholders involved in '${keyNoun}' are actively seeking alternative systems.`,
      ...generic.assumptions
    ];

    result = {
      topic: "Novel Proposition",
      score: score,
      risk: generic.risk,
      assumptions: customAssumptions,
      counterArguments: [...generic.counterArguments],
      verdict: generic.verdict
    };
  }

  return result;
}

/**
 * Historical demo records for the SessionTable.
 */
export const INITIAL_HISTORY = [
  {
    id: 1,
    idea: "Peer-to-peer textbook lending marketplace with dynamic rental pricing.",
    mode: "Demolish",
    risk: "High",
    score: 34,
    date: "2026-06-18"
  },
  {
    id: 2,
    idea: "Specialty cat-themed coffee shop in a tech-hub neighborhood.",
    mode: "Socratic",
    risk: "Medium",
    score: 61,
    date: "2026-06-19"
  },
  {
    id: 3,
    idea: "Automated billing software for freelance content creators and designers.",
    mode: "Steel Ring",
    risk: "Low",
    score: 75,
    date: "2026-06-20"
  }
];
