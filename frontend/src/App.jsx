import { useState, useRef, useEffect } from "react";
import diseaseData from "./diseaseData.js";

const API_URL = "http://127.0.0.1:5000/predict";

const LANG_KEYS = {
  en: ["en", "english", "English"],
  hi: ["hi", "hindi", "Hindi"],
  pa: ["pa", "punjabi", "Punjabi", "panjabi", "Panjabi"],
};

const SPEECH_LANG = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

const UI = {
  en: {
    navHome: "Home",
    navFeatures: "Features",
    navDetect: "Detect",
    navAbout: "About",
    heroBadge: "Smart Agriculture Platform",
    heroTitle: "AgroAI Disease Detection",
    heroSubtitle:
      "Upload a crop leaf image, get instant AI diagnosis, confidence scores, and actionable treatment guidance in your language.",
    heroCta: "Start Detection",
    statCrops: "Crops Supported",
    statLang: "Languages",
    statAi: "AI Powered",
    featuresTitle: "Why AgroAI",
    featuresSubtitle: "Built for farmers, agronomists, and agricultural startups.",
    f1Title: "Instant Diagnosis",
    f1Desc: "Deep learning models analyze leaf images in seconds.",
    f2Title: "Treatment Plans",
    f2Desc: "Clear treatment and prevention steps for every detected disease.",
    f3Title: "Multilingual",
    f3Desc: "English, Hindi, and Punjabi for wider reach across India.",
    f4Title: "Voice Assistant",
    f4Desc: "Listen to results hands-free in the field.",
    detectTitle: "Disease Detection",
    detectSubtitle: "Upload a clear photo of the affected leaf for best accuracy.",
    uploadLabel: "Upload leaf image",
    uploadHint: "JPG, PNG or JPEG — max 10MB",
    chooseFile: "Choose Image",
    analyze: "Analyze Disease",
    analyzing: "Analyzing…",
    preview: "Image Preview",
    noPreview: "No image selected",
    results: "Detection Results",
    disease: "Predicted Disease",
    confidence: "Confidence Score",
    treatment: "Treatment",
    prevention: "Prevention",
    noResult: "Upload an image and run analysis to see results.",
    voice: "Listen",
    voiceStop: "Stop",
    aboutTitle: "About AgroAI",
    aboutText:
      "AgroAI combines computer vision with agronomic knowledge to help detect plant diseases early, reduce crop loss, and support data-driven farming decisions.",
    footer: "© 2026 AgroAI Disease Detection. Empowering sustainable agriculture.",
    errorNoFile: "Please select an image first.",
    errorPredict: "Prediction failed. Ensure the Flask server is running.",
    healthy: "Healthy Plant",
  },
  hi: {
    navHome: "होम",
    navFeatures: "विशेषताएँ",
    navDetect: "पहचान",
    navAbout: "परिचय",
    heroBadge: "स्मार्ट कृषि प्लेटफ़ॉर्म",
    heroTitle: "AgroAI रोग पहचान",
    heroSubtitle:
      "फसल की पत्ती की तस्वीर अपलोड करें, तुरंत AI निदान, विश्वास स्कोर और अपनी भाषा में उपचार जानकारी पाएं।",
    heroCta: "पहचान शुरू करें",
    statCrops: "फसलें",
    statLang: "भाषाएँ",
    statAi: "AI सक्षम",
    featuresTitle: "AgroAI क्यों",
    featuresSubtitle: "किसानों, कृषि विशेषज्ञों और स्टार्टअप के लिए बनाया गया।",
    f1Title: "तुरंत निदान",
    f1Desc: "गहरी सीखना मॉडल सेकंडों में पत्ती का विश्लेषण करते हैं।",
    f2Title: "उपचार योजना",
    f2Desc: "हर रोग के लिए स्पष्ट उपचार और रोकथाम कदम।",
    f3Title: "बहुभाषी",
    f3Desc: "अंग्रेज़ी, हिंदी और पंजाबी समर्थन।",
    f4Title: "वॉयस सहायक",
    f4Desc: "खेत में हाथों के बिना परिणाम सुनें।",
    detectTitle: "रोग पहचान",
    detectSubtitle: "सबसे अच्छी सटीकता के लिए प्रभावित पत्ती की स्पष्ट फोटो अपलोड करें।",
    uploadLabel: "पत्ती की छवि अपलोड करें",
    uploadHint: "JPG, PNG या JPEG — अधिकतम 10MB",
    chooseFile: "छवि चुनें",
    analyze: "रोग का विश्लेषण",
    analyzing: "विश्लेषण हो रहा है…",
    preview: "छवि पूर्वावलोकन",
    noPreview: "कोई छवि नहीं चुनी गई",
    results: "पहचान परिणाम",
    disease: "अनुमानित रोग",
    confidence: "विश्वास स्कोर",
    treatment: "उपचार",
    prevention: "रोकथाम",
    noResult: "परिणाम देखने के लिए छवि अपलोड करें और विश्लेषण चलाएं।",
    voice: "सुनें",
    voiceStop: "रोकें",
    aboutTitle: "AgroAI के बारे में",
    aboutText:
      "AgroAI कंप्यूटर विज़न और कृषि ज्ञान को जोड़कर पौधों के रोगों की जल्दी पहचान, फसल नुकसान कम करने और डेटा आधारित खेती में मदद करता है।",
    footer: "© 2026 AgroAI रोग पहचान। सतत कृषि के लिए।",
    errorNoFile: "कृपया पहले एक छवि चुनें।",
    errorPredict: "पूर्वानुमान विफल। Flask सर्वर चालू है या नहीं जाँचें।",
    healthy: "स्वस्थ पौधा",
  },
  pa: {
    navHome: "ਘਰ",
    navFeatures: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    navDetect: "ਪਛਾਣ",
    navAbout: "ਬਾਰੇ",
    heroBadge: "ਸਮਾਰਟ ਖੇਤੀ ਪਲੇਟਫ਼ਾਰਮ",
    heroTitle: "AgroAI ਰੋਗ ਪਛਾਣ",
    heroSubtitle:
      "ਫਸਲ ਦੇ ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ, ਤੁਰੰਤ AI ਨਿਦਾਨ, ਭਰੋਸੇ ਦਾ ਸਕੋਰ ਅਤੇ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਇਲਾਜ ਦੀ ਜਾਣਕਾਰੀ ਪਾਓ।",
    heroCta: "ਪਛਾਣ ਸ਼ੁਰੂ ਕਰੋ",
    statCrops: "ਫਸਲਾਂ",
    statLang: "ਭਾਸ਼ਾਵਾਂ",
    statAi: "AI ਸਮਰੱਥ",
    featuresTitle: "AgroAI ਕਿਉਂ",
    featuresSubtitle: "ਕਿਸਾਨਾਂ, ਖੇਤੀ ਮਾਹਿਰਾਂ ਅਤੇ ਸਟਾਰਟਅੱਪ ਲਈ ਬਣਾਇਆ ਗਿਆ।",
    f1Title: "ਤੁਰੰਤ ਨਿਦਾਨ",
    f1Desc: "ਡੀਪ ਲਰਨਿੰਗ ਮਾਡਲ ਸਕਿੰਟਾਂ ਵਿੱਚ ਪੱਤੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦੇ ਹਨ।",
    f2Title: "ਇਲਾਜ ਯੋਜਨਾ",
    f2Desc: "ਹਰ ਰੋਗ ਲਈ ਸਪੱਸ਼ਟ ਇਲਾਜ ਅਤੇ ਰੋਕਥਾਮ ਕਦਮ।",
    f3Title: "ਬਹੁਭਾਸ਼ੀ",
    f3Desc: "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ ਅਤੇ ਪੰਜਾਬੀ ਸਹਾਇਤਾ।",
    f4Title: "ਵੌਇਸ ਸਹਾਇਕ",
    f4Desc: "ਖੇਤ ਵਿੱਚ ਹੱਥਾਂ ਤੋਂ ਬਿਨਾਂ ਨਤੀਜੇ ਸੁਣੋ।",
    detectTitle: "ਰੋਗ ਪਛਾਣ",
    detectSubtitle: "ਸਭ ਤੋਂ ਵਧੀਆ ਸਟੀਕਤਾ ਲਈ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਦੀ ਸਾਫ਼ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",
    uploadLabel: "ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
    uploadHint: "JPG, PNG ਜਾਂ JPEG — ਵੱਧ ਤੋਂ ਵੱਧ 10MB",
    chooseFile: "ਤਸਵੀਰ ਚੁਣੋ",
    analyze: "ਰੋਗ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
    analyzing: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ…",
    preview: "ਤਸਵੀਰ ਝਲਕ",
    noPreview: "ਕੋਈ ਤਸਵੀਰ ਨਹੀਂ ਚੁਣੀ",
    results: "ਪਛਾਣ ਨਤੀਜੇ",
    disease: "ਅਨੁਮਾਨਿਤ ਰੋਗ",
    confidence: "ਭਰੋਸੇ ਦਾ ਸਕੋਰ",
    treatment: "ਇਲਾਜ",
    prevention: "ਰੋਕਥਾਮ",
    noResult: "ਨਤੀਜੇ ਦੇਖਣ ਲਈ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਚਲਾਓ।",
    voice: "ਸੁਣੋ",
    voiceStop: "ਰੋਕੋ",
    aboutTitle: "AgroAI ਬਾਰੇ",
    aboutText:
      "AgroAI ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਅਤੇ ਖੇਤੀ ਗਿਆਨ ਨੂੰ ਜੋੜ ਕੇ ਪੌਦਿਆਂ ਦੇ ਰੋਗਾਂ ਦੀ ਛੇਤੀ ਪਛਾਣ, ਫਸਲ ਨੁਕਸਾਨ ਘਟਾਉਣ ਅਤੇ ਡਾਟਾ ਆਧਾਰਿਤ ਖੇਤੀ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    footer: "© 2026 AgroAI ਰੋਗ ਪਛਾਣ। ਟਿਕਾਊ ਖੇਤੀ ਲਈ।",
    errorNoFile: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਤਸਵੀਰ ਚੁਣੋ।",
    errorPredict: "ਭਵਿੱਖਬਾਣੀ ਅਸਫਲ। Flask ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ ਜਾਂ ਨਹੀਂ ਜਾਂਚ ਕਰੋ।",
    healthy: "ਸਿਹਤਮੰਦ ਪੌਦਾ",
  },
};

function pickLangBlock(entry, lang) {
  if (!entry || typeof entry !== "object") return null;
  for (const key of LANG_KEYS[lang] || []) {
    if (entry[key]) return entry[key];
  }
  return entry.en || entry.english || entry.hi || entry.hindi || null;
}

function getDiseaseInfo(prediction, lang) {
  if (!prediction || !diseaseData) return null;

  const raw = diseaseData[prediction];
  if (!raw) {
    const normalized = prediction.replace(/\s+/g, "_");
    const alt = diseaseData[normalized] || diseaseData[prediction.trim()];
    if (!alt) return null;
    return resolveDiseaseEntry(alt, lang);
  }
  return resolveDiseaseEntry(raw, lang);
}

function resolveDiseaseEntry(raw, lang) {
  const localized = pickLangBlock(raw, lang);
  const source = localized || raw;

  return {
    name:
      source.name ||
      source.disease ||
      source.title ||
      source.diseaseName ||
      predictionLabel(raw, lang),
    treatment:
      source.treatment ||
      source.cure ||
      source.remedy ||
      source.treatmentSteps ||
      "—",
    prevention:
      source.prevention ||
      source.prevent ||
      source.preventionSteps ||
      "—",
  };
}

function predictionLabel(raw, lang) {
  if (typeof raw === "string") return raw;
  const block = pickLangBlock(raw, lang);
  if (block?.name) return block.name;
  return raw.label || raw.name || "Unknown";
}

function formatConfidence(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  const num = Number(value);
  const pct = num <= 1 ? num * 100 : num;
  return `${pct.toFixed(1)}%`;
}

function confidenceWidth(value) {
  if (value == null || Number.isNaN(Number(value))) return "0%";
  const num = Number(value);
  const pct = num <= 1 ? num * 100 : num;
  return `${Math.min(100, Math.max(0, pct))}%`;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {

const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef(null);
  const t = UI[language];

  const diseaseInfo = prediction ? getDiseaseInfo(prediction, language) : null;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      window.speechSynthesis.cancel();
    };
  }, [preview]);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [language, prediction]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSelectedFile(file);
    setPrediction(null);
    setConfidence(null);

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError(t.errorNoFile);
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);
    setConfidence(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("image", selectedFile);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const predicted =
        data.prediction ?? data.disease ?? data.class ?? data.label ?? data.result;
      const conf =
        data.confidence ?? data.confidence_score ?? data.probability ?? data.score;

      const formattedPrediction = predicted
  .replace(/___/g, " ")
  .replace(/_/g, " ")
  .replace(/\b\w/g, (char) => char.toUpperCase());


setPrediction(formattedPrediction);
setConfidence(conf);
    } catch {
      setError(t.errorPredict);
    } finally {
      setLoading(false);
    }
  };

  const buildVoiceText = () => {
    if (!prediction) return "";
    const info = getDiseaseInfo(prediction, language);
    const name = info?.name || prediction;
    const conf = formatConfidence(confidence);
    return `${t.disease}: ${name}. ${t.confidence}: ${conf}. ${t.treatment}: ${info?.treatment || "—"}. ${t.prevention}: ${info?.prevention || "—"}`;
  };

  const handleVoice = () => {
    if (!prediction) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = buildVoiceText();
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG[language] || "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const displayName =
  diseaseInfo?.name || prediction;

  return (
    <div className="agro-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        :root {
          --green-50: #f0fdf4;
          --green-100: #dcfce7;
          --green-200: #bbf7d0;
          --green-500: #22c55e;
          --green-600: #16a34a;
          --green-700: #15803d;
          --green-800: #166534;
          --green-900: #14532d;
          --slate-50: #f8fafc;
          --slate-100: #f1f5f9;
          --slate-200: #e2e8f0;
          --slate-500: #64748b;
          --slate-700: #334155;
          --slate-900: #0f172a;
          --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
          --shadow-md: 0 8px 24px rgba(22, 101, 52, 0.08);
          --shadow-lg: 0 20px 50px rgba(22, 101, 52, 0.12);
          --radius: 16px;
          --radius-lg: 24px;
          --glass: rgba(255, 255, 255, 0.72);
          --glass-border: rgba(255, 255, 255, 0.9);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .agro-app {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          color: var(--slate-900);
          background: linear-gradient(180deg, var(--green-50) 0%, #fff 28%, var(--slate-50) 100%);
          min-height: 100vh;
          line-height: 1.6;
        }

        .container {
          width: min(1120px, 92%);
          margin: 0 auto;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(14px);
          background: var(--glass);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: var(--shadow-sm);
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 0;
          flex-wrap: wrap;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--green-800);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--green-500), var(--green-700));
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 1.2rem;
          box-shadow: var(--shadow-md);
        }

        .nav-links {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .nav-links button {
          background: transparent;
          border: none;
          padding: 0.5rem 0.85rem;
          border-radius: 999px;
          color: var(--slate-700);
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .nav-links button:hover {
          background: var(--green-100);
          color: var(--green-800);
        }

        .lang-switch {
          display: flex;
          gap: 0.25rem;
          background: #fff;
          border: 1px solid var(--green-200);
          border-radius: 999px;
          padding: 0.2rem;
        }

        .lang-switch button {
          border: none;
          background: transparent;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--slate-500);
          transition: all 0.2s;
        }

        .lang-switch button.active {
          background: var(--green-600);
          color: #fff;
        }

        .hero { padding: 4.5rem 0 3.5rem; }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: var(--green-100);
          color: var(--green-800);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .hero h1 {
          font-size: clamp(2rem, 5vw, 3.1rem);
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--green-900);
          margin-bottom: 1rem;
        }

        .hero p {
          color: var(--slate-500);
          font-size: 1.05rem;
          max-width: 34rem;
          margin-bottom: 1.75rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--green-600), var(--green-700));
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.7rem 1.1rem;
          border-radius: 12px;
          border: 1px solid var(--green-200);
          background: #fff;
          color: var(--green-800);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: var(--green-50);
          border-color: var(--green-500);
        }

        .hero-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(12px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat {
          text-align: center;
          padding: 1rem 0.5rem;
          border-radius: var(--radius);
          background: #fff;
          border: 1px solid var(--green-100);
          transition: transform 0.2s;
        }

        .stat:hover { transform: translateY(-3px); }

        .stat strong {
          display: block;
          font-size: 1.5rem;
          color: var(--green-700);
        }

        .stat span {
          font-size: 0.75rem;
          color: var(--slate-500);
          font-weight: 500;
        }

        section { padding: 3.5rem 0; }

        .section-head {
          text-align: center;
          max-width: 36rem;
          margin: 0 auto 2.5rem;
        }

        .section-head h2 {
          font-size: clamp(1.6rem, 3vw, 2rem);
          color: var(--green-900);
          margin-bottom: 0.5rem;
        }

        .section-head p { color: var(--slate-500); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .feature-card {
          background: #fff;
          border: 1px solid var(--slate-200);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--green-200);
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--green-100);
          display: grid;
          place-items: center;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: var(--green-900);
        }

        .feature-card p {
          font-size: 0.88rem;
          color: var(--slate-500);
        }

        .detect-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .card {
          background: #fff;
          border: 1px solid var(--slate-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .card h3 {
          font-size: 1.1rem;
          color: var(--green-900);
          margin-bottom: 0.35rem;
        }

        .card .muted {
          font-size: 0.88rem;
          color: var(--slate-500);
          margin-bottom: 1.25rem;
        }

        .upload-zone {
          border: 2px dashed var(--green-200);
          border-radius: var(--radius);
          padding: 2rem 1.25rem;
          text-align: center;
          background: var(--green-50);
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .upload-zone:hover {
          border-color: var(--green-500);
          background: var(--green-100);
        }

        .upload-zone input { display: none; }

        .preview-box {
          margin-top: 1rem;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--slate-100);
          min-height: 200px;
          display: grid;
          place-items: center;
          border: 1px solid var(--slate-200);
        }

        .preview-box img {
          width: 100%;
          max-height: 280px;
          object-fit: contain;
          display: block;
        }

        .preview-placeholder {
          color: var(--slate-500);
          font-size: 0.9rem;
          padding: 2rem;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .error-msg {
          margin-top: 0.75rem;
          color: #b91c1c;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .loader {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .result-disease {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--green-800);
          margin: 0.5rem 0 1rem;
          word-break: break-word;
        }

        .confidence-bar-wrap { margin-bottom: 1.25rem; }

        .confidence-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--slate-700);
          margin-bottom: 0.4rem;
        }

        .confidence-bar {
          height: 10px;
          background: var(--slate-200);
          border-radius: 999px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--green-500), var(--green-700));
          border-radius: 999px;
          transition: width 0.5s ease;
        }

        .info-block {
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: var(--radius);
          background: var(--green-50);
          border: 1px solid var(--green-100);
        }

        .info-block h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--green-700);
          margin-bottom: 0.35rem;
        }

        .info-block p {
          font-size: 0.92rem;
          color: var(--slate-700);
        }
          .info-list {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.info-list li {
  margin-bottom: 0.45rem;
  color: var(--slate-700);
  line-height: 1.5;
}
          .info-list {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.info-list li {
  margin-bottom: 0.45rem;
  color: var(--slate-700);
  line-height: 1.5;
}

        .empty-result {
          text-align: center;
          padding: 2.5rem 1rem;
          color: var(--slate-500);
          font-size: 0.95rem;
        }

        .about-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(10px);
        }

        .about-card p { color: var(--slate-500); margin-top: 0.75rem; }

        .footer {
          border-top: 1px solid var(--slate-200);
          padding: 1.75rem 0 2rem;
          text-align: center;
          color: var(--slate-500);
          font-size: 0.88rem;
        }

        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .detect-panel { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero-stats { grid-template-columns: 1fr; }
          .nav-links { display: none; }
        }
      `}</style>

      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">🌿</div>
            AgroAI
          </div>

          <nav className="nav-links" aria-label="Main">
            <button type="button" onClick={() => scrollToId("home")}>{t.navHome}</button>
            <button type="button" onClick={() => scrollToId("features")}>{t.navFeatures}</button>
            <button type="button" onClick={() => scrollToId("detect")}>{t.navDetect}</button>
            <button type="button" onClick={() => scrollToId("about")}>{t.navAbout}</button>
          </nav>

          <div className="lang-switch" role="group" aria-label="Language">
            {["en", "hi", "pa"].map((code) => (
              <button
                key={code}
                type="button"
                className={language === code ? "active" : ""}
                onClick={() => setLanguage(code)}
              >
                {code === "en" ? "EN" : code === "hi" ? "हिं" : "ਪੰ"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge">🌾 {t.heroBadge}</span>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroSubtitle}</p>
              <button type="button" className="btn-primary" onClick={() => scrollToId("detect")}>
                {t.heroCta} →
              </button>
            </div>

            <div className="hero-card">
              <div className="hero-stats">
                <div className="stat"><strong>2+</strong><span>{t.statCrops}</span></div>
                <div className="stat"><strong>3</strong><span>{t.statLang}</span></div>
                <div className="stat"><strong>AI</strong><span>{t.statAi}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <div className="section-head">
              <h2>{t.featuresTitle}</h2>
              <p>{t.featuresSubtitle}</p>
            </div>
            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon">🔬</div>
                <h3>{t.f1Title}</h3>
                <p>{t.f1Desc}</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon">💊</div>
                <h3>{t.f2Title}</h3>
                <p>{t.f2Desc}</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>{t.f3Title}</h3>
                <p>{t.f3Desc}</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon">🔊</div>
                <h3>{t.f4Title}</h3>
                <p>{t.f4Desc}</p>
              </article>
            </div>
          </div>
        </section>

        <section id="detect">
          <div className="container">
            <div className="section-head">
              <h2>{t.detectTitle}</h2>
              <p>{t.detectSubtitle}</p>
            </div>

            <div className="detect-panel">
              <div className="card">
                <h3>{t.uploadLabel}</h3>
                <p className="muted">{t.uploadHint}</p>

                <label className="upload-zone">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div style={{ marginBottom: "1rem" }}>
  <button
    type="button"
    className="btn-secondary"
    onClick={() => fileInputRef.current?.click()}
  >
    📤 Choose Image
  </button>
</div>
                </label>

                <div className="actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePredict}
                    disabled={loading || !selectedFile}
                  >
                    {loading ? (
                      <span className="loader">
                        <span className="spinner" />
                        {t.analyzing}
                      </span>
                    ) : (
                      t.analyze
                    )}
                  </button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <h3 style={{ marginTop: "1.5rem" }}>{t.preview}</h3>
                <div className="preview-box">
                  {preview ? (
                    <img src={preview} alt={t.preview} />
                  ) : (
                    <span className="preview-placeholder">{t.noPreview}</span>
                  )}
                </div>
              </div>

              <div className="card">
                <h3>{t.results}</h3>
                <p className="muted">{prediction ? displayName : t.noResult}</p>

                {prediction ? (
                  <>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--slate-500)" }}>
                      {t.disease}
                    </p>
                    <p className="result-disease">{displayName}</p>

                    <div className="confidence-bar-wrap">
                      <div className="confidence-label">
                        <span>{t.confidence}</span>
                        <span>{formatConfidence(confidence)}</span>
                      </div>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: confidenceWidth(confidence) }}
                        />
                      </div>
                    </div>

   <div className="info-block">
  <h4>{t.treatment}</h4>

  {Array.isArray(diseaseInfo?.treatment) ? (
    <ul className="info-list">
      {diseaseInfo.treatment.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <p>{diseaseInfo?.treatment || "—"}</p>
  )}
</div>

<div className="info-block">
  <h4>{t.prevention}</h4>

  {Array.isArray(diseaseInfo?.prevention) ? (
    <ul className="info-list">
      {diseaseInfo.prevention.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <p>{diseaseInfo?.prevention || "—"}</p>
  )}
</div>

                    

                    <div className="actions">
                      <button type="button" className="btn-secondary" onClick={handleVoice}>
                        {isSpeaking ? `⏹ ${t.voiceStop}` : `🔊 ${t.voice}`}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-result">{t.noResult}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="container">
            <div className="about-card">
              <h2>{t.aboutTitle}</h2>
              <p>{t.aboutText}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">{t.footer}</div>
      </footer>
    </div>
  );
}