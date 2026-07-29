"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function LanguageSelect({
  languages = [],
  value = "bn",
  onChange = () => {},
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-emerald-500" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Translation Language
        </label>
      </div>
      <Select 
        value={value} 
        onValueChange={(val) => onChange({ target: { value: val } })}
      >
        <SelectTrigger className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {languages.length === 0 ? (
            <SelectItem value={value}>{value}</SelectItem>
          ) : (
            languages.map((lang) => (
              <SelectItem key={lang} value={lang} className="text-xs font-medium cursor-pointer">
                {lang.toUpperCase()}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}