"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Moon, Sun } from "lucide-react";
import quotes from "@/lib/quotes.json";

type Quote = {
  topic: string;
  text: string;
  author: string;
};

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    const initialTheme = savedTheme ?? 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);
  

  useEffect(() => {
    // Initialize topics
    const topics = Array.from(new Set(quotes.map((q) => q.topic)));
    setAllTopics(topics);
  }, []);

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const trimmed = topic.trim().toLowerCase();
    if (!trimmed) {
      setFilteredQuotes([]);
      return;
    }
    const matched = quotes
      .filter((q) => q.topic.toLowerCase().includes(trimmed))
      .slice(0, 3);
    setFilteredQuotes(matched);
    setShowSuggestions(false); // close dropdown
  };

  const copyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // DaisyUI theme
    document.documentElement.classList.toggle("dark", newTheme === "dark"); // Tailwind dark mode
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-4 transition-all 
             bg-gradient-to-tr from-purple-100 to-blue-100 
             dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-base-200 shadow-xl p-8 rounded-xl max-w-2xl w-full text-center space-y-6 border border-purple-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 quote-font">
              Quote of the Day
            </h1>
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
          </div>

          <div className="relative" ref={suggestionRef}>
            <Input
              value={topic}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setTopic(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search topic (e.g. love, life)"
              className="input input-bordered w-full"
            />
            {showSuggestions && topic && (
              <ul className="absolute left-0 right-0 mt-2 z-10 bg-white dark:bg-base-200 rounded-lg shadow-md text-left max-h-52 overflow-y-auto">
                {allTopics
                  .filter((t) => t.toLowerCase().includes(topic.toLowerCase()))
                  .map((t, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setTopic(t);
                        setFilteredQuotes(
                          quotes.filter((q) => q.topic === t).slice(0, 3)
                        );
                        setShowSuggestions(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-900"
                    >
                      {t}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition"
          >
            New Quote
          </Button>

          <div className="space-y-6">
            {filteredQuotes.length === 0 ? (
              <p className="text-gray-500">
                No quotes yet. Try searching a topic!
              </p>
            ) : (
              filteredQuotes.map((quote, idx) => (
                <div key={idx} className="space-y-2">
                  <blockquote className="italic text-xl text-purple-700 dark:text-purple-300 quote-font">
                    "{quote.text}"
                  </blockquote>
                  <p className="text-gray-600 dark:text-gray-300">
                    — {quote.author}
                  </p>
                  <Button
                    onClick={() => copyQuote(quote.text)}
                    size="sm"
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Arham Affan. All rights reserved.
      </footer>
    </div>
  );
}