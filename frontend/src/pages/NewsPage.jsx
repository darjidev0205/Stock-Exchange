import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import api from '../config/api';

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get('/ai/news').then(({ data }) => setNews(data));
  }, []);

  const sentimentStyles = {
    positive: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
    negative: 'text-red-400 bg-red-500/15 border-red-500/20',
    neutral: 'text-gray-400 bg-gray-500/15 border-gray-500/20',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full min-w-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Market News</h1>
          <p className="text-gray-500 text-sm">Latest financial news and market updates</p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {news.map((item) => (
            <Card key={item.id} hover className="p-4 sm:p-5 overflow-hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2.5">
                    <span className="text-xs text-cyan-400 font-semibold">{item.source}</span>
                    <span className="text-gray-600 hidden sm:inline">·</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${sentimentStyles[item.sentiment]}`}>
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-snug break-words">
                    {item.title}
                  </h3>
                </div>
                <span
                  className={`self-start shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border capitalize ${sentimentStyles[item.sentiment]}`}
                >
                  {item.sentiment}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
