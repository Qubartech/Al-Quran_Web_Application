export default function Loading() {
  return (
    <div className="w-full px-4 md:px-0 text-gray-900 dark:text-gray-100 min-h-screen my-10 animate-pulse">
      
      {/* Welcome Banner Skeleton */}
      <div className="relative overflow-hidden p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 mb-6 min-h-[120px] flex flex-col justify-center gap-3">
        <div className="h-3 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        <div className="h-8 w-64 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-3 w-80 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
      </div>

      {/* Grid: Daily Ayah, Quick Access, Namaz Timings (3-Column balanced layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Daily Ayah Card Skeleton */}
        <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 flex flex-col justify-between gap-4 h-[440px]">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="flex gap-2">
              <div className="h-7 w-7 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-7 w-7 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 my-2">
            <div className="h-8 w-[90%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-8 w-[70%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 w-[85%] bg-gray-300 dark:bg-slate-700 rounded-full self-start mt-3"></div>
            <div className="h-4 w-[60%] bg-gray-300 dark:bg-slate-700 rounded-full self-start"></div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-800/40">
            <div className="h-3.5 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>

        {/* Quick Access Card Skeleton */}
        <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 shadow-md flex flex-col justify-between h-[440px] gap-4">
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/10 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
                    <div className="flex flex-col gap-1">
                      <div className="h-2.5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-1.5 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-2.5 w-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Namaz Timings Card Skeleton */}
        <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 shadow-md flex flex-col gap-4 h-[440px]">
          <div className="h-5 w-40 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-slate-700 rounded-xl"></div>
          
          {/* Namaz Times rows */}
          <div className="flex flex-col gap-2.5 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800/40">
                <div className="h-3 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-3 w-12 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Container with Restored Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-0">
        
        {/* Main Content (Surah list / tabs) */}
        <div className="w-full">
          {/* Tabs Header Skeleton */}
          <div className="flex border-b border-gray-200/50 dark:border-slate-800/80 mb-6 gap-2 pb-2">
            <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
          </div>

          {/* Surah List Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full p-4.5 rounded-2xl flex items-center justify-between border border-transparent dark:border-slate-800/80 glass"
              >
                <div className="flex items-center gap-4">
                  {/* Badge Circle */}
                  <div className="h-10 w-10 bg-gray-300 dark:bg-slate-700 rounded-xl shrink-0"></div>
                  {/* Info lines */}
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-3 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                {/* Arabic Name block */}
                <div className="flex flex-col items-end gap-2">
                  <div className="h-6 w-16 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-3 w-12 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeletons */}
        <div className="w-full lg:w-[400px] pt-5 lg:pt-0 shrink-0 flex flex-col gap-6">
          
          {/* Quran Insights Skeleton */}
          <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 shadow-md flex flex-col gap-4">
            <div className="h-4 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="grid grid-cols-2 gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-gray-200/10 dark:border-slate-800/10 flex flex-col gap-2">
                  <div className="h-5 w-10 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-2.5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Skeleton */}
          <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 shadow-md flex flex-col gap-4">
            <div className="h-4 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="flex flex-col gap-3">
              <div className="h-3 w-20 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-14 w-full bg-white/10 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-850/20 rounded-xl"></div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
