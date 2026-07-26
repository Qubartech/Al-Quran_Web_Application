export default function Loading() {
  return (
    <div className="w-full px-4 md:px-0 text-gray-900 dark:text-gray-100 min-h-screen my-10 animate-pulse">
      
      {/* HomeWelcome Skeleton */}
      <div className="relative overflow-hidden p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 mb-8 min-h-[120px] flex flex-col justify-center gap-3">
        <div className="h-3 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        <div className="h-8 w-64 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-3 w-80 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Main Content Tabs & List Skeleton */}
        <div className="w-full">
          {/* Tabs Header Skeleton */}
          <div className="flex border-b border-gray-200/50 dark:border-slate-800/80 mb-6 gap-2 pb-2">
            <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
          </div>

          {/* Surah List Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

        {/* Namaz Time Sidebar Skeleton */}
        <div className="w-full md:w-[430px] pt-5 md:pt-0 shrink-0">
          <div className="p-6 rounded-2xl glass border border-gray-200/20 dark:border-slate-800/80 shadow-md flex flex-col gap-4">
            <div className="h-5 w-40 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-10 w-full bg-gray-300 dark:bg-slate-700 rounded-xl"></div>
            
            {/* Namaz Times rows */}
            <div className="flex flex-col gap-3 mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800/40">
                  <div className="h-3.5 w-20 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                  <div className="h-3.5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
