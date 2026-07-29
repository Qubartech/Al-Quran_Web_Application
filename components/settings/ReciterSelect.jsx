"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
          // Sort reciters alphabetically
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Audio Reciter
        </label>
        {loading && <Loader2 size={12} className="animate-spin text-primaryColor" />}
      </div>
      <Select
        value={currentValue}
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select reciter" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {reciters.length === 0 ? (
            <SelectItem value={currentValue}>
              {currentValue === "7" ? "Mishary Rashid Alafasy" : `Reciter ${currentValue}`}
            </SelectItem>
          ) : (
            reciters.map((r) => {
              const name = r.translated_name?.name || r.reciter_name;
              const style = r.style ? ` (${r.style})` : "";
              return (
                <SelectItem key={r.id} value={String(r.id)}>
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
