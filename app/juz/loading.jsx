export default function Loading() {
  return (
    <div className="w-full px-5 max-w-screen-xl mx-auto my-10 animate-pulse text-gray-900 dark:text-gray-100">
      
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-2.5">
        <div className="h-9 w-60 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-4.5 w-96 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
      </div>

      {/* Juz Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-full p-5 rounded-2xl flex items-center border border-transparent dark:border-slate-800/80 glass"
          >
            {/* Badge Square Box */}
            <div className="h-[52px] w-[52px] bg-gray-300 dark:bg-slate-700 rounded-xl shrink-0"></div>
            
            {/* Info container */}
            <div className="pl-4 flex justify-between items-center w-full">
              {/* English & Range */}
              <div className="flex flex-col gap-2">
                <div className="h-4.5 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-3 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              </div>
              
              {/* Arabic & Juz badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-14 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                <div className="h-3 w-10 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
