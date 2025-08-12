import React, { useState, useRef, useEffect } from 'react';
import { getFarmAnalysisStream } from '../services/geminiService';
import type { Flock, DailyRecord, ChatMessage } from '../types';
import { Button } from './ui/Button';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';
import { Spinner } from './ui/Spinner';

interface SmartAssistantProps {
  flocks: Flock[];
  dailyRecords: DailyRecord[];
}

const PRESET_QUERIES = [
    "Analisis tingkat kematian terbaru. Apakah ada yang perlu dikhawatirkan?",
    "Bagaimana tren produksi telur untuk kawanan ini?",
    "Evaluasi konsumsi pakan vs. berat badan.",
    "Beri saya ringkasan status kesehatan kawanan ini saat ini."
];

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ flocks, dailyRecords }) => {
  const [selectedFlockId, setSelectedFlockId] = useState<string>(flocks[0]?.id || '');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleQuerySubmit = async (prompt: string) => {
    if (!prompt.trim() || isGenerating || !selectedFlockId) return;

    const selectedFlock = flocks.find(f => f.id === selectedFlockId);
    if (!selectedFlock) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: prompt }];
    setChatHistory(newHistory);
    setQuery('');
    setIsGenerating(true);

    try {
      const recordsForFlock = dailyRecords.filter(r => r.flockId === selectedFlockId).slice(-3);
      const stream = await getFarmAnalysisStream(prompt, selectedFlock, recordsForFlock);
      
      let fullResponse = '';
      const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
      
      const newAssistantMessage: ChatMessage = { role: 'model', content: '' };
      const updatedHistory = [...newHistory, newAssistantMessage];
      setChatHistory(updatedHistory);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullResponse += value;
        setChatHistory(prev => {
            const lastMsg = prev[prev.length - 1];
            lastMsg.content = fullResponse;
            return [...prev];
        });
      }
    } catch (error) {
      console.error("Failed to get AI analysis:", error);
      setChatHistory(prev => [...prev, { role: 'model', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.' }]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePresetQuery = (presetQuery: string) => {
      setQuery(presetQuery);
      handleQuerySubmit(presetQuery);
  };

  const renderMessageContent = (content: string) => {
    // A simple markdown-to-html converter
    const html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<ul class="list-disc list-inside"><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul/g, '<ul'); // a bit of cleanup for lists
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col h-[60vh] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4">
        <label htmlFor="flock-select" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Analisis Kawanan:
        </label>
        <select
          id="flock-select"
          value={selectedFlockId}
          onChange={(e) => setSelectedFlockId(e.target.value)}
          className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          {flocks.map(flock => (
            <option key={flock.id} value={flock.id}>{flock.nameOrCode}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && !isGenerating && (
             <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center">
                <Sparkles className="h-12 w-12 mb-4 text-gray-400" />
                <p className="font-semibold text-lg">Selamat Datang di AgriMind</p>
                <p className="text-sm">Pilih kawanan dan gunakan saran di bawah ini, atau ketik pertanyaan Anda sendiri.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                    {PRESET_QUERIES.map(q => (
                        <button key={q} onClick={() => handlePresetQuery(q)} className="p-3 bg-white dark:bg-gray-700/50 rounded-lg text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        )}
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-xl p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">{renderMessageContent(msg.content)}</div>
              {isGenerating && index === chatHistory.length - 1 && <Spinner size="sm" className="inline-block ml-2"/>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit(query)}
            placeholder={isGenerating ? "AgriMind sedang berpikir..." : `Tanya tentang ${flocks.find(f => f.id === selectedFlockId)?.nameOrCode || 'kawanan'}...`}
            className="w-full pl-4 pr-20 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isGenerating || !selectedFlockId}
          />
          <Button
            onClick={() => handleQuerySubmit(query)}
            disabled={isGenerating || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 !py-2 !px-3"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};