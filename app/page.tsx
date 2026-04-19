"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-orange-500";
const ACCENT_TEXT = "text-orange-400";
const ACCENT_BORDER = "border-orange-500/30";
const ACCENT_GLOW = "shadow-orange-500/20";

export default function FoodPhotoRecipeCard() {
  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [techniqueNotes, setTechniqueNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !ingredients) {
      setError("Please fill in at least dish name and ingredients.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName, ingredients, techniqueNotes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>📷</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Food Photography Recipe Card</h1>
          <p className="text-sm text-gray-400">Styled recipe cards with photography tips</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Dish Name</label>
            <input value={dishName} onChange={e => setDishName(e.target.value)} placeholder="e.g., Honey Glazed Salmon with Herbs"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ingredients</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5} placeholder="List all ingredients, one per line..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Technique Notes (optional)</label>
            <textarea value={techniqueNotes} onChange={e => setTechniqueNotes(e.target.value)} rows={3} placeholder="Any specific cooking techniques, tools used, or style notes..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Generating Recipe Card..." : "Generate Recipe Card"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your styled recipe card will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
