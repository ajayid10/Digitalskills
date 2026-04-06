import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  Play, 
  Download, 
  LogOut, 
  Cpu, 
  Database, 
  Zap, 
  Monitor, 
  Settings, 
  User, 
  Video, 
  Loader2,
  ChevronRight,
  Plus,
  Key,
  Globe,
  Mail,
  Shield,
  Keyboard,
  Trophy,
  RefreshCw,
  Clock,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface User {
  name: string;
  email: string;
  token: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  icon: any;
  type?: 'lesson' | 'typing';
}

interface SavedVideo {
  id: number;
  email: string;
  lesson_id: string;
  video_url: string;
  created_at: string;
}

interface TypingScore {
  id: number;
  wpm: number;
  accuracy: number;
  created_at: string;
}

// --- Constants ---
const LESSONS: Lesson[] = [
  { id: '1', title: 'Introduction to Computers', duration: '12:00 MIN', description: 'Learn the basics of computer hardware and software.', icon: Monitor },
  { id: '2', title: 'Internet & Web Browsing', duration: '10:00 MIN', description: 'Master the web, search engines, and browser safety.', icon: Globe },
  { id: '3', title: 'Email & Communication', duration: '08:00 MIN', description: 'How to write professional emails and use digital communication tools.', icon: Mail },
  { id: '4', title: 'Online Safety & Privacy', duration: '07:00 MIN', description: 'Protect your data and stay safe from online threats.', icon: Shield },
  { id: '5', title: 'Typing Mastery', duration: 'Practice', description: 'Test your typing speed and accuracy with real-time feedback.', icon: Keyboard, type: 'typing' },
];

const TYPING_EXERCISES = [
  "The quick brown fox jumps over the lazy dog.",
  "Digital skills are essential for success in the modern workplace.",
  "Learning to type fast and accurately takes time and practice.",
  "Always remember to keep your passwords secure and private.",
  "Computers have changed the way we live and work every day."
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [typingScores, setTypingScores] = useState<TypingScore[]>([]);
  const [dbStatus, setDbStatus] = useState<{ status: string, mode: string, message?: string, debug?: any } | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Typing Test State
  const [typingText, setTypingText] = useState("");
  const [typingInput, setTypingInput] = useState("");
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);
  const [typingWpm, setTypingWpm] = useState(0);
  const [typingAccuracy, setTypingAccuracy] = useState(0);
  const [isTypingTestActive, setIsTypingTestActive] = useState(false);

  // Video Generation State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationStatus, setVideoGenerationStatus] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchProgress(parsedUser.email);
      fetchVideos(parsedUser.email);
      fetchTypingScores(parsedUser.email);
    }
    checkApiKey();
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({ status: 'error', mode: 'unknown', message: 'Failed to reach server' });
    } finally {
      setIsCheckingDb(false);
    }
  };

  const checkApiKey = async () => {
    if ((window as any).aistudio?.hasSelectedApiKey) {
      const has = await (window as any).aistudio.hasSelectedApiKey();
      setHasApiKey(has);
    } else {
      setHasApiKey(true);
    }
  };

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const fetchProgress = async (email: string) => {
    try {
      const res = await fetch(`/api/progress/${email}`);
      const data = await res.json();
      setCompletedLessons(data.completedLessons || []);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  const fetchVideos = async (email: string) => {
    try {
      const res = await fetch(`/api/videos/${email}`);
      const data = await res.json();
      setSavedVideos(data.videos || []);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  const playSavedVideo = async (video: SavedVideo) => {
    if (!hasApiKey) {
      await handleOpenKeySelector();
    }

    setVideoGenerationStatus("Loading saved video...");
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("API Key not found. Please select an API key first.");

      const res = await fetch(video.video_url, {
        method: 'GET',
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!res.ok) throw new Error("Failed to fetch video file");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedVideoUrl(url);
      setVideoGenerationStatus("Video loaded!");
      
      // Select the lesson associated with the video
      const lesson = LESSONS.find(l => l.id === video.lesson_id);
      if (lesson) setCurrentLesson(lesson);
      
    } catch (error: any) {
      console.error("Error playing saved video:", error);
      setVideoGenerationStatus(`Error: ${error.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const fetchTypingScores = async (email: string) => {
    try {
      const res = await fetch(`/api/typing-scores/${email}`);
      const data = await res.json();
      setTypingScores(data.scores || []);
    } catch (err) {
      console.error("Failed to fetch typing scores", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      
      if (authMode === 'login') {
        const userData = { name: data.name, email: data.email, token: data.token };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        fetchProgress(data.email);
        fetchVideos(data.email);
        fetchTypingScores(data.email);
      } else {
        setAuthMode('login');
        setError('Account created! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = async (lessonId: string) => {
    if (!user) return;
    const newCompleted = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(newCompleted);
    
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedLessons: newCompleted })
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  // --- Typing Test Logic ---
  const startTypingTest = () => {
    const randomText = TYPING_EXERCISES[Math.floor(Math.random() * TYPING_EXERCISES.length)];
    setTypingText(randomText);
    setTypingInput("");
    setTypingStartTime(null);
    setTypingEndTime(null);
    setTypingWpm(0);
    setTypingAccuracy(0);
    setIsTypingTestActive(true);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setTypingInput(input);

    if (!typingStartTime) {
      setTypingStartTime(Date.now());
    }

    if (input === typingText) {
      const endTime = Date.now();
      setTypingEndTime(endTime);
      calculateTypingResults(endTime);
    }
  };

  const calculateTypingResults = async (endTime: number) => {
    if (!typingStartTime || !user) return;

    const timeInMinutes = (endTime - typingStartTime) / 60000;
    const wordCount = typingText.split(" ").length;
    const wpm = Math.round(wordCount / timeInMinutes);

    let correctChars = 0;
    for (let i = 0; i < typingInput.length; i++) {
      if (typingInput[i] === typingText[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / typingText.length) * 100);

    setTypingWpm(wpm);
    setTypingAccuracy(accuracy);
    setIsTypingTestActive(false);

    // Save Score
    try {
      await fetch("/api/typing-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          wpm,
          accuracy
        })
      });
      fetchTypingScores(user.email);
      
      // Mark lesson as complete if it's the typing lesson
      if (currentLesson?.type === 'typing') {
        toggleLesson(currentLesson.id);
      }
    } catch (err) {
      console.error("Failed to save typing score", err);
    }
  };

  const getApiKey = () => {
    // Priority: window.process.env.API_KEY (platform injection) -> process.env.API_KEY (Vite define) -> process.env.GEMINI_API_KEY (Free key)
    return (window as any).process?.env?.API_KEY || 
           (process.env as any).API_KEY || 
           (process.env as any).GEMINI_API_KEY;
  };

  const handleGenerateVideo = async () => {
    if (!currentLesson || !user) return;

    if (!hasApiKey) {
      await handleOpenKeySelector();
    }

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoGenerationStatus("Initializing AI...");

    try {
      // 1. Initialize GoogleGenAI
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("API Key not found. Please select an API key first.");
      
      const ai = new GoogleGenAI({ apiKey });

      // 2. Generate Prompt using Gemini
      setVideoGenerationStatus("Generating educational prompt...");
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert educational video producer. Create a highly descriptive visual prompt for a video generation model (like Veo). Focus on technical accuracy, clear visuals, and a professional educational style. The prompt should be a single paragraph of descriptive text.
        
        Create a video generation prompt for a lesson titled "${currentLesson.title}". Description: ${currentLesson.description}`,
      });

      const prompt = promptResponse.text || "";
      if (!prompt) throw new Error("Failed to generate video prompt");

      setVideoGenerationStatus("Creating video using Veo...");

      // 3. Start Generation
      let operation = await ai.models.generateVideos({
        model: "veo-3.1-lite-generate-preview",
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: "720p",
          aspectRatio: "16:9",
        },
      });

      setVideoGenerationStatus("Rendering video. This may take a few minutes...");

      // 4. Poll for completion
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("No video URL returned");

      setVideoGenerationStatus("Fetching video file...");

      // 5. Fetch video with API key
      const videoRes = await fetch(videoUri, {
        method: 'GET',
        headers: { 'x-goog-api-key': apiKey },
      });
      const videoBlob = await videoRes.blob();
      const videoUrl = URL.createObjectURL(videoBlob);

      setGeneratedVideoUrl(videoUrl);
      setVideoGenerationStatus("Video generated successfully!");

      // 6. Save to DB
      await fetch("/api/save-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          lessonId: currentLesson.id,
          videoUrl: videoUri, // Save URI, not Blob URL
        }),
      });

      fetchVideos(user.email);
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      let msg = error.message || "Failed to generate video";
      if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
        msg = "Permission Denied: Veo requires a Paid API Key from a billing-enabled Google Cloud project. Please click the 'Select Key' button in the bottom right to choose a valid key.";
        // Reset key selection state to force re-selection if needed
        setHasApiKey(false);
      }
      setVideoGenerationStatus(`Error: ${msg}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCompletedLessons([]);
    setSavedVideos([]);
    setCurrentLesson(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <BookOpen className="text-white w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center mb-2">Digital Skills</h1>
          <p className="text-neutral-400 text-center mb-8">Master the essential tools of the digital age.</p>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Digital Skills</span>
          </div>
          
            <div className="flex items-center gap-4">
              {dbStatus && (
                <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                  dbStatus.status === 'ok' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                    : 'bg-red-500/10 border-red-500/30 text-red-500'
                }`}>
                  <Database className="w-3 h-3" />
                  <span>{dbStatus.mode === 'rds' ? 'RDS Connected' : 'In-Memory Mode'}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-full border border-neutral-800">
              <User className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-neutral-900 rounded-full text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Course Content */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-500 w-5 h-5" />
                Course Content
              </h2>
              <div className="space-y-3">
                {LESSONS.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                      currentLesson?.id === lesson.id 
                        ? 'bg-blue-600/10 border-blue-500/50' 
                        : 'bg-neutral-800/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      currentLesson?.id === lesson.id ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${currentLesson?.id === lesson.id ? 'text-white' : 'text-neutral-300'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">{lesson.duration}</p>
                    </div>
                    {completedLessons.includes(lesson.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {dbStatus?.status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                  <Shield className="w-5 h-5" />
                  Database Connection Error
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  The application is unable to reach your RDS instance. Using in-memory storage for now.
                </p>
                <div className="space-y-2 text-xs text-neutral-500 bg-neutral-950 p-4 rounded-xl border border-neutral-800 overflow-x-auto">
                  <p className="font-bold text-neutral-400 uppercase tracking-widest mb-1">Troubleshooting:</p>
                  <p>1. In AWS RDS Console, set "Publicly Accessible" to **Yes**.</p>
                  <p>2. In Security Group, allow **Port 3306** from **0.0.0.0/0**.</p>
                  <p>3. Verify DB_HOST and DB_PORT in AI Studio Secrets.</p>
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <p className="text-red-400 font-mono">Error: {dbStatus.message || 'Connection Timed Out'}</p>
                    {dbStatus.debug && (
                      <pre className="mt-2 text-[10px] opacity-50">
                        {JSON.stringify(dbStatus.debug, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
                <button 
                  onClick={checkDbStatus}
                  disabled={isCheckingDb}
                  className="mt-4 w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isCheckingDb ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Retry Connection
                </button>
              </div>
            )}

            {/* Progress Stats */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Your Progress</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold">{Math.round((completedLessons.length / LESSONS.length) * 100)}%</span>
                <span className="text-neutral-500 text-sm">{completedLessons.length} of {LESSONS.length} lessons</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedLessons.length / LESSONS.length) * 100}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Lesson Detail & Video Gen / Typing Test */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson ? (
              <motion.div 
                key={currentLesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden"
              >
                {currentLesson.type === 'typing' ? (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Typing Mastery</h1>
                        <p className="text-neutral-400">Improve your speed and accuracy with interactive exercises.</p>
                      </div>
                      <Keyboard className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>

                    {!isTypingTestActive && typingWpm === 0 ? (
                      <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-12 text-center">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-4">Ready to test your skills?</h3>
                        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                          Click the button below to start a typing exercise. We'll track your Words Per Minute (WPM) and accuracy.
                        </p>
                        <button 
                          onClick={startTypingTest}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 mx-auto"
                        >
                          <Play className="w-5 h-5" /> Start Exercise
                        </button>
                      </div>
                    ) : isTypingTestActive ? (
                      <div className="space-y-6">
                        <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 font-mono text-xl leading-relaxed select-none">
                          {typingText.split("").map((char, idx) => {
                            let color = "text-neutral-600";
                            if (idx < typingInput.length) {
                              color = typingInput[idx] === char ? "text-green-500" : "text-red-500";
                            }
                            return <span key={idx} className={color}>{char}</span>;
                          })}
                        </div>
                        <textarea
                          autoFocus
                          value={typingInput}
                          onChange={handleTypingChange}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-32 resize-none"
                          placeholder="Start typing here..."
                        />
                        <div className="flex items-center justify-between text-neutral-500 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Timer starts on first keypress</span>
                          </div>
                          <button 
                            onClick={startTypingTest}
                            className="hover:text-white transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className="w-4 h-4" /> Reset
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-8 text-center">
                            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-1">Typing Speed</p>
                            <h4 className="text-5xl font-bold text-white">{typingWpm} <span className="text-xl text-neutral-500">WPM</span></h4>
                          </div>
                          <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-8 text-center">
                            <Target className="w-8 h-8 text-green-500 mx-auto mb-4" />
                            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-1">Accuracy</p>
                            <h4 className="text-5xl font-bold text-white">{typingAccuracy}<span className="text-xl text-neutral-500">%</span></h4>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4">
                          <button 
                            onClick={startTypingTest}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                          >
                            <RefreshCw className="w-5 h-5" /> Try Again
                          </button>
                        </div>
                      </div>
                    )}

                    {typingScores.length > 0 && (
                      <div className="mt-12">
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Your Top Scores</h3>
                        <div className="space-y-2">
                          {typingScores.map((score) => (
                            <div key={score.id} className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                                  <Trophy className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                  <p className="font-bold text-white">{score.wpm} WPM</p>
                                  <p className="text-xs text-neutral-500">{new Date(score.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-500">{score.accuracy}% Accuracy</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="aspect-video bg-neutral-800 flex items-center justify-center relative group overflow-hidden rounded-t-3xl">
                      {generatedVideoUrl ? (
                        <video 
                          src={generatedVideoUrl} 
                          controls 
                          className="w-full h-full object-contain bg-black"
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <div className="text-center p-8">
                          <currentLesson.icon className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-neutral-400">Video Content for {currentLesson.title}</h3>
                          <p className="text-neutral-500 max-w-md mx-auto mt-2">
                            Generate a custom AI visual explanation for this lesson using Google Veo.
                          </p>
                        </div>
                      )}
                      
                      {isGeneratingVideo && (
                        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                          <p className="text-lg font-medium text-white">{videoGenerationStatus}</p>
                          <p className="text-sm text-neutral-400 mt-2">This usually takes 1-3 minutes. You can stay on this page.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 text-blue-500 text-sm font-semibold uppercase tracking-widest mb-1">
                            <span>Lesson {LESSONS.indexOf(currentLesson) + 1} of {LESSONS.length}</span>
                            <ChevronRight className="w-4 h-4" />
                            <span>{currentLesson.duration}</span>
                          </div>
                          <h1 className="text-3xl font-bold text-white">{currentLesson.title}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleLesson(currentLesson.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                              completedLessons.includes(currentLesson.id)
                                ? 'bg-green-600/20 text-green-500 border border-green-500/30'
                                : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                          >
                            {completedLessons.includes(currentLesson.id) ? (
                              <><CheckCircle className="w-5 h-5" /> Completed</>
                            ) : (
                              'Mark as Complete'
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                        {currentLesson.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={handleGenerateVideo}
                          disabled={isGeneratingVideo}
                          className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 p-4 rounded-2xl transition-all group disabled:opacity-50"
                        >
                          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                            <Video className="text-blue-500 w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white">Generate AI Video</p>
                            <p className="text-xs text-neutral-500">Powered by Google Veo</p>
                          </div>
                        </button>

                        <button className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 p-4 rounded-2xl transition-all group">
                          <div className="w-10 h-10 bg-neutral-700/50 rounded-lg flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                            <Download className="text-neutral-400 w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white">Download Notes</p>
                            <p className="text-xs text-neutral-500">PDF Study Guide</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-neutral-800 rounded-3xl flex items-center justify-center mb-6">
                  <Play className="text-neutral-600 w-10 h-10 ml-1" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to start learning?</h2>
                <p className="text-neutral-500 max-w-md">Select a lesson from the sidebar to begin your journey into computer hardware.</p>
              </div>
            )}

            {/* Saved Videos Section */}
            {savedVideos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Video className="text-blue-500 w-5 h-5" />
                  Your AI Generated Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedVideos.map((vid) => {
                    const lesson = LESSONS.find(l => l.id === vid.lesson_id);
                    return (
                      <div key={vid.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
                        <div className="aspect-video bg-neutral-800 relative">
                          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                            <Video className="w-8 h-8 text-neutral-700" />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => playSavedVideo(vid)}
                              className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                            >
                              <Play className="w-6 h-6 fill-current" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white truncate max-w-[150px]">{lesson?.title || 'Unknown Lesson'}</p>
                            <p className="text-xs text-neutral-500">{new Date(vid.created_at).toLocaleDateString()}</p>
                          </div>
                          <a 
                            href={vid.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4 text-neutral-400" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* API Key Warning / Selector */}
      {!hasApiKey && user && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-blue-400/30"
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">API Key Required</p>
              <p className="text-xs text-blue-100">Select a key to generate videos</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
            >
              Select Key
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
