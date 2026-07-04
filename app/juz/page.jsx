import Link from "next/link";
import { juzList } from "@/lib/juzData";

export const metadata = {
  title: "Juz List - Quran Application",
  description: "Browse the Holy Quran by Juz (Para) partitions",
};

export default function JuzPage() {
  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors my-10 px-5 max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent mb-2 animate-fadeIn">
          Juz List (Paras)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-fadeIn">
          Select a Juz to read its verses, translations, and listen to recitations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
        {juzList.map((juz) => (
          <Link href={`/juz/${juz.number}`} key={juz.number} className="w-full">
            <div className="w-full p-5 rounded-2xl flex items-center border border-transparent dark:border-slate-800/80 group transition-all duration-300 glass glass-hover cursor-pointer">
              {/* Badge */}
              <div className="h-[52px] w-[52px] shrink-0 bg-primaryColor/10 dark:bg-emerald-500/10 group-hover:text-white group-hover:bg-primaryColor border-2 border-primaryColor/25 group-hover:border-transparent text-primaryColor dark:text-primaryColor-light flex items-center justify-center rounded-xl transition-all duration-300">
                <span className="text-lg font-bold">
                  {juz.number}
                </span>
              </div>
              
              {/* Info */}
              <div className="pl-4 flex justify-between items-center w-full">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primaryColor transition-colors">
                    {juz.nameEnglish}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 leading-none">
                    {juz.start} — {juz.end.split(" ")[0]}
                  </p>
                </div>
                <div className="text-end">
                  <span className="font-arabic text-xl text-slate-700 dark:text-slate-300 group-hover:text-primaryColor transition-colors">
                    {juz.nameArabic}
                  </span>
                  <p className="text-[10px] font-bold text-primaryColor dark:text-primaryColor-light mt-0.5">
                    Juz {juz.number}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
