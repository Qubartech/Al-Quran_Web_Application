"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Headphones, Loader2 } from "lucide-react";

export default function ReciterSelect({
  value = "7",
  onChange = () => {},
}) {
  const [reciters, setReciters] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch("https://api.quran.com/api/v4/resources/recitations?language=en")
      .then((res) => res.json())
      .then((data) => {
        if (data?.recitations) {
          const sorted = [...data.recitations].sort((a, b) => {
            const nameA = a.translated_name?.name || a.reciter_name || "";
            const nameB = b.translated_name?.name || b.reciter_name || "";
            return nameA.localeCompare(nameB);
          });
          setReciters(sorted);
        }
      })
      .catch((err) => console.error("Error fetching reciters list:", err))
      .finally(() => setLoading(false));
  }, []);

  const currentValue = String(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-emerald-500" />
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Audio Reciter
          </label>
        </div>
        {loading && <Loader2 size={12} className="animate-spin text-emerald-500" />}
      </div>
      <Select
        value={currentValue}
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 truncate">
          <SelectValue placeholder="Select reciter" />
        </SelectTrigger>
        <SelectContent className="max-h-[280px] rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {reciters.length === 0 ? (
            <SelectItem value={currentValue} className="text-xs font-medium">
              {currentValue === "7" ? "Mishary Rashid Alafasy" : `Reciter ${currentValue}`}
            </SelectItem>
          ) : (
            reciters.map((r) => {
              const name = r.translated_name?.name || r.reciter_name;
              const style = r.style ? ` (${r.style})` : "";
              return (
                <SelectItem key={r.id} value={String(r.id)} className="text-xs font-medium cursor-pointer">
                  {name}{style}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
