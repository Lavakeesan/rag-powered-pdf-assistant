'use client';

import { useState, useEffect } from 'react';
import { History as HistoryIcon, MessageSquare, Trash2, ArrowUpRight, Calendar, FileText, Bot, User, Loader2, Search, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChat, setExpandedChat] = useState(null);

  const getUserEmail = () => {
    try {
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        return userData?.email || null;
      }
    } catch (e) {}
    return null;
  };

  const fetchHistory = async () => {
    setLoading(true);
    const email = getUserEmail();
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/history?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago · ${time}`;
      if (diffDays === 1) return `Yesterday · ${time}`;
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${time}`;
    } catch {
      return isoString;
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.question?.toLowerCase().includes(q) ||
      chat.answer?.toLowerCase().includes(q) ||
      chat.filename?.toLowerCase().includes(q)
    );
  });

  // Group chats by date
  const groupedChats = filteredChats.reduce((groups, chat) => {
    try {
      const date = new Date(chat.timestamp);
      const now = new Date();
      const diffDays = Math.floor((now - date) / 86400000);
      let label;
      if (diffDays === 0) label = 'Today';
      else if (diffDays === 1) label = 'Yesterday';
      else if (diffDays < 7) label = 'This Week';
      else label = 'Older';

      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    } catch {
      if (!groups['Other']) groups['Other'] = [];
      groups['Other'].push(chat);
    }
    return groups;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Chat History</h1>
          <p className="text-slate-400 text-sm">Revisit your previous conversations with AskMyPDF AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="p-2.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-white/10"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading your chat history...</p>
        </div>
      ) : filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-purple-600/10 rounded-[2rem] flex items-center justify-center mb-6 border border-purple-500/20">
            <HistoryIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No conversations yet</h2>
          <p className="text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">
            {searchQuery ? 'No results match your search. Try a different query.' : 'Start chatting with your PDFs in Ask AI to see your history here.'}
          </p>
          {!searchQuery && (
            <Link href="/chat" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
              Go to Ask AI <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedChats).map(([dateLabel, groupChats]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dateLabel}</span>
                <div className="flex-1 h-px bg-white/5"></div>
                <span className="text-xs font-bold text-slate-600">{groupChats.length} {groupChats.length === 1 ? 'chat' : 'chats'}</span>
              </div>

              <div className="space-y-3">
                {groupChats.map((chat) => (
                  <div
                    key={chat.chat_id}
                    className={`glass-card rounded-[24px] border transition-all duration-300 group cursor-pointer ${
                      expandedChat === chat.chat_id
                        ? 'border-indigo-500/30 bg-indigo-600/5'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => setExpandedChat(expandedChat === chat.chat_id ? null : chat.chat_id)}
                  >
                    {/* Summary Row */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                          expandedChat === chat.chat_id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'bg-purple-600/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white'
                        }`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">
                            {chat.question}
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" /> {formatDate(chat.timestamp)}
                            </span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3 h-3" /> {chat.filename || 'No Document'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href="/chat"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5"
                        >
                          Open Chat <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Expanded Q&A Detail */}
                    {expandedChat === chat.chat_id && (
                      <div className="px-5 pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="h-px bg-white/5"></div>
                        {chat.messages && chat.messages.length > 0 ? (
                          <div className="space-y-4">
                            {chat.messages.map((msg, index) => (
                              <div key={index} className="space-y-3">
                                {index > 0 && <div className="h-px border-t border-dashed border-white/5 my-4"></div>}
                                <div className="flex gap-3 items-start">
                                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-slate-300" />
                                  </div>
                                  <div className="bg-indigo-600/10 border border-indigo-500/10 rounded-2xl rounded-tl-none p-4 flex-1">
                                    <p className="text-sm text-white leading-relaxed">{msg.question}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                                    <Bot className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex-1">
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-slate-300" />
                              </div>
                              <div className="bg-indigo-600/10 border border-indigo-500/10 rounded-2xl rounded-tl-none p-4 flex-1">
                                <p className="text-sm text-white leading-relaxed">{chat.question}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 items-start">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex-1">
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{chat.answer}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
