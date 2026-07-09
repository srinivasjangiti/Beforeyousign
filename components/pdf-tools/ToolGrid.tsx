import { CheckCircle2, Lock } from 'lucide-react';
import { PDFTool, CATEGORIES, TOOLS } from './data';

interface ToolGridProps {
  selectedTool: string | null;
  onToolSelect: (toolId: string) => void;
}

export function ToolGrid({ selectedTool, onToolSelect }: ToolGridProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      convert: 'from-blue-600 to-cyan-600',
      organize: 'from-purple-600 to-pink-600',
      optimize: 'from-green-600 to-emerald-600',
      edit: 'from-orange-600 to-red-600',
      security: 'from-red-600 to-rose-600'
    };
    return colors[category as keyof typeof colors] || 'from-stone-600 to-stone-700';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {CATEGORIES.map(category => {
        const categoryTools = TOOLS.filter(t => t.category === category.id);
        if (categoryTools.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 border-b border-stone-200 pb-2">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTools.map(tool => {
                const isSelected = selectedTool === tool.id;
                const isDisabled = tool.comingSoon;

                return (
                  <button
                    key={tool.id}
                    onClick={() => !isDisabled && onToolSelect(tool.id)}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className={`
                      relative flex flex-col items-start p-5 text-left border-2 rounded-xl transition-all duration-200 ease-out group
                      ${isDisabled ? 'opacity-50 cursor-not-allowed bg-stone-50 border-stone-200' : 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-stone-200'}
                      ${isSelected ? 'border-stone-900 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02] ring-1 ring-stone-900' : ''}
                      ${!isSelected && !isDisabled ? 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-lg hover:-translate-y-1' : ''}
                    `}
                    title={isDisabled ? "Coming Soon" : `Select ${tool.name}`}
                  >
                    {/* Selected Badge & Glow */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 bg-stone-900/5 rounded-xl pointer-events-none" />
                        <div className="absolute -top-3 -right-3 bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider animate-in fade-in zoom-in duration-200">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </div>
                      </>
                    )}

                    {/* Coming Soon Overlay / Badge */}
                    {isDisabled && (
                      <div className="absolute top-3 right-3 bg-stone-200 text-stone-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Coming Soon
                      </div>
                    )}

                    <div className="flex justify-between items-start w-full mb-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300
                        ${isSelected ? 'scale-110 shadow-md' : 'group-hover:scale-110'}
                        ${isDisabled ? 'bg-stone-300' : `bg-gradient-to-br ${getCategoryColor(tool.category)}`}
                      `}>
                        <tool.icon className={`w-6 h-6 ${isDisabled ? 'text-stone-500' : 'text-white'}`} />
                      </div>
                    </div>
                    
                    <h3 className={`font-bold mb-1 text-base ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                      {tool.name}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${isSelected ? 'text-stone-700 font-medium' : 'text-stone-500'}`}>
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
