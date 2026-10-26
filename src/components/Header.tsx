import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div className="leading-tight">
            <span className="block font-bold text-navy text-lg">WattWise</span>
            <span className="block text-[11px] text-gray-400 -mt-0.5">Smart Energy Analyzer</span>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <a href="#dashboard" className="px-3 py-2 rounded-lg text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors">Dashboard</a>
          <a href="#analyzer" className="px-3 py-2 rounded-lg text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors">Analyzer</a>
          <a href="#simulator" className="px-3 py-2 rounded-lg text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors">Simulator</a>
          <a href="#tips" className="px-3 py-2 rounded-lg text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors">Tips</a>
        </nav>
      </div>
    </header>
  );
}
