export type CourseLesson = {
  id: string;
  titleHi: string;
  titleEn: string;
  durationMin: number;
  summary: string;
  /** Private/unlisted YouTube video ID only — never expose watch URL in member UI */
  youtubeId?: string | null;
};

export type CourseCurriculum = {
  slug: string;
  introHi: string;
  introEn: string;
  lessons: CourseLesson[];
};

const curricula: Record<string, CourseCurriculum> = {
  "class-8-12-curriculum": {
    slug: "class-8-12-curriculum",
    introHi: "कक्षा 8 से 12 तक का डिजिटल पाठ्यक्रम — विषयवार नोट्स और अभ्यास।",
    introEn: "Digital school curriculum for Classes 8–12 with notes and practice.",
    lessons: [
      {
        id: "c812-1",
        titleHi: "कोर्स परिचय एवं अध्ययन योजना",
        titleEn: "Orientation & study plan",
        durationMin: 12,
        summary: "How to use the LMS, weekly targets, and syllabus overview.",
      },
      {
        id: "c812-2",
        titleHi: "गणित — मूल अवधारणाएँ",
        titleEn: "Mathematics foundations",
        durationMin: 25,
        summary: "Number systems, algebra basics, and practice worksheets.",
      },
      {
        id: "c812-3",
        titleHi: "विज्ञान — अवधारणा से प्रयोग",
        titleEn: "Science concepts to practice",
        durationMin: 22,
        summary: "Physics, chemistry and biology core ideas with examples.",
      },
      {
        id: "c812-4",
        titleHi: "सामाजिक विज्ञान एवं भाषा कौशल",
        titleEn: "Social science & language skills",
        durationMin: 18,
        summary: "History, geography, and Hindi/English reading practice.",
      },
    ],
  },
  "competitive-exam-prep": {
    slug: "competitive-exam-prep",
    introHi: "प्रतियोगी परीक्षाओं के लिए रणनीति, मॉक टेस्ट और रीविजन मॉड्यूल।",
    introEn: "Strategy, mocks, and revision modules for major competitive exams.",
    lessons: [
      {
        id: "cep-1",
        titleHi: "परीक्षा पैटर्न एवं समय प्रबंधन",
        titleEn: "Exam pattern & time management",
        durationMin: 15,
        summary: "Understand paper structure and build a realistic attempt plan.",
      },
      {
        id: "cep-2",
        titleHi: "रीजनिंग एवं मात्रात्मक योग्यता",
        titleEn: "Reasoning & quantitative aptitude",
        durationMin: 28,
        summary: "High-frequency topics with solved examples.",
      },
      {
        id: "cep-3",
        titleHi: "सामान्य ज्ञान एवं करंट अफेयर्स",
        titleEn: "GK & current affairs",
        durationMin: 20,
        summary: "Monthly capsules and revision checklists.",
      },
      {
        id: "cep-4",
        titleHi: "मॉक टेस्ट समीक्षा",
        titleEn: "Mock test review",
        durationMin: 30,
        summary: "Score analysis, weak areas, and improvement plan.",
      },
    ],
  },
  "trading-education": {
    slug: "trading-education",
    introHi: "शेयर बाज़ार और फ़ॉरेक्स की मूल बातें — जोखिम प्रबंधन सहित।",
    introEn: "Stock & Forex foundations with risk management for BP members.",
    lessons: [
      {
        id: "te-1",
        titleHi: "बाज़ार की संरचना एवं शब्दावली",
        titleEn: "Market structure & terminology",
        durationMin: 16,
        summary: "Exchanges, instruments, brokers, and order types.",
      },
      {
        id: "te-2",
        titleHi: "चार्ट पढ़ना — कैंडलस्टिक्स",
        titleEn: "Reading charts — candlesticks",
        durationMin: 24,
        summary: "Price action basics and common candle patterns.",
      },
      {
        id: "te-3",
        titleHi: "जोखिम प्रबंधन एवं पोजीशन साइज़िंग",
        titleEn: "Risk management & position sizing",
        durationMin: 20,
        summary: "Stop-loss rules, R:R ratio, and capital protection.",
      },
      {
        id: "te-4",
        titleHi: "ट्रेडिंग जर्नल एवं अनुशासन",
        titleEn: "Trading journal & discipline",
        durationMin: 14,
        summary: "Build a repeatable process for learning and review.",
      },
    ],
  },
  "technical-analysis": {
    slug: "technical-analysis",
    introHi: "टेक्निकल इंडिकेटर्स और फंडामेंटल विश्लेषण की व्यावहारिक गाइड।",
    introEn: "Practical guide to technical indicators and fundamental analysis.",
    lessons: [
      {
        id: "ta-1",
        titleHi: "ट्रेंड, सपोर्ट और रेसिस्टेंस",
        titleEn: "Trend, support & resistance",
        durationMin: 18,
        summary: "Identify market structure on daily and intraday charts.",
      },
      {
        id: "ta-2",
        titleHi: "मूविंग एवरेज, RSI, MACD",
        titleEn: "Moving averages, RSI, MACD",
        durationMin: 26,
        summary: "Use indicators with confirmation — not in isolation.",
      },
      {
        id: "ta-3",
        titleHi: "फंडामेंटल स्क्रीनर्स",
        titleEn: "Fundamental screeners",
        durationMin: 22,
        summary: "Earnings, ratios, and news flow for equity selection.",
      },
      {
        id: "ta-4",
        titleHi: "ट्रेडिंगव्यू पर प्रैक्टिस वर्कफ़्लो",
        titleEn: "TradingView practice workflow",
        durationMin: 20,
        summary: "Set up watchlists, alerts, and annotated chart reviews.",
      },
    ],
  },
};

export function getCourseCurriculum(slug: string): CourseCurriculum | null {
  return curricula[slug] ?? null;
}

export function progressPercentForCompleted(
  slug: string,
  completedLessonIds: string[],
): number {
  const curriculum = getCourseCurriculum(slug);
  if (!curriculum || curriculum.lessons.length === 0) return 0;
  const unique = new Set(completedLessonIds);
  const done = curriculum.lessons.filter((l) => unique.has(l.id)).length;
  return Math.min(100, Math.round((done / curriculum.lessons.length) * 100));
}
