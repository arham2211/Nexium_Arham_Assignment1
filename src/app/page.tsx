'use client';

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Moon, Sun } from 'lucide-react';
import quotes from '@/lib/quotes.json';

type Quote = {
  topic: string;
  text: string;
  author: string;
};

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [allTopics, setAllTopics] = useState<string[]>([]);

  useEffect(() => {
    const topics = Array.from(new Set(quotes.map(q => q.topic)));
    setAllTopics(topics);
  }, []);

  const handleSearch = () => {
    const trimmed = topic.trim().toLowerCase();
    if (!trimmed) {
      setFilteredQuotes([]);
      return;
    }
    const matched = quotes.filter(q =>
      q.topic.toLowerCase().includes(trimmed)
    ).slice(0, 3);
    setFilteredQuotes(matched);
  };

  const copyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 transition-all">
      <div className="bg-white dark:bg-base-200 shadow-xl p-8 rounded-xl max-w-2xl w-full text-center space-y-6 border border-purple-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 quote-font">
            Quote of the Day
          </h1>
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
        </div>

        <div className="relative">
          <Input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Search topic (e.g. love, life)"
            className="input input-bordered w-full"
          />
          <ul className="absolute left-0 right-0 mt-2 z-10 bg-white dark:bg-base-200 rounded-lg shadow-md text-left">
            {topic && allTopics
              .filter(t => t.toLowerCase().includes(topic.toLowerCase()))
              .map((t, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setTopic(t);
                    setFilteredQuotes(
                      quotes.filter(q => q.topic === t).slice(0, 3)
                    );
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  {t}
                </li>
              ))}
          </ul>
        </div>

        <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition">
          New Quote
        </Button>

        <div className="space-y-6">
          {filteredQuotes.length === 0 ? (
            <p className="text-gray-500">No quotes yet. Try searching a topic!</p>
          ) : (
            filteredQuotes.map((quote, idx) => (
              <div key={idx} className="space-y-2">
                <blockquote className="italic text-xl text-purple-700 dark:text-purple-300 quote-font">
                  “{quote.text}”
                </blockquote>
                <p className="text-gray-600 dark:text-gray-300">— {quote.author}</p>
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
  );
}
