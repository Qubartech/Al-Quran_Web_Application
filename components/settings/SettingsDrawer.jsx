"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/rightDrawer";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import ThemeToggle from "@/components/settings/ThemeToggle";
import LanguageSelect from "@/components/settings/LanguageSelect";
import TranslationSelect from "@/components/settings/TranslationSelect";
import ReciterSelect from "@/components/settings/ReciterSelect";
import FontSizeControls from "@/components/settings/FontSizeControls";
import ArabicFontSelect from "@/components/settings/ArabicFontSelect";
import WordTooltipToggle from "@/components/settings/WordTooltipToggle";
import SettingsResetButton from "@/components/settings/SettingsResetButton";
import useSettings from "@/components/settings/hooks/useSettings";

export default function SettingsDrawer({ open, onClose }) {
  const {
    themeChoice,
    resolvedTheme,
    languages,
    language,
    filteredEditions,
    identifier,
    fontSize,
    arabicFontSize,
    arabicFontFamily,
    reciterId,
    showWordTooltip,
    handleThemeChange,
    handleLanguageChange,
    handleIdentifierChange,
    handleFontSizeChange,
    handleArabicFontSizeChange,
    handleArabicFontChange,
    handleReciterIdChange,
    handleToggleWordTooltip,
    resetAll,
  } = useSettings();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-md ml-auto h-full bg-slate-50/90 dark:bg-[#0b1324]/90 backdrop-blur-2xl border-l border-gray-200/60 dark:border-slate-800/80 shadow-2xl">
        {/* Drawer Header */}
        <DrawerHeader className="text-left px-5 py-4 border-b border-gray-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <DrawerTitle className="text-lg font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  Settings
                </DrawerTitle>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Personalize reading & audio experience
                </p>
              </div>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Configure your application settings
          </DrawerDescription>
        </DrawerHeader>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 hover-scrollbar">
          {/* Card 1: Theme */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
            <ThemeToggle value={themeChoice} onChange={handleThemeChange} resolvedTheme={resolvedTheme} />
          </div>

          {/* Card 2: Translation & Language */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <LanguageSelect
              languages={languages}
              value={language}
              onChange={handleLanguageChange}
            />
            <TranslationSelect
              editions={filteredEditions}
              value={identifier}
              onChange={handleIdentifierChange}
            />
          </div>

          {/* Card 3: Audio Reciter */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
            <ReciterSelect
              value={reciterId}
              onChange={handleReciterIdChange}
            />
          </div>

          {/* Card 4: Word Meaning Tooltip Toggle */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
            <WordTooltipToggle
              checked={showWordTooltip}
              onChange={handleToggleWordTooltip}
            />
          </div>

          {/* Card 5: Arabic Font Style Selector */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
            <ArabicFontSelect
              value={arabicFontFamily}
              onChange={handleArabicFontChange}
            />
          </div>

          {/* Card 6: Typography & Live Preview */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
            <FontSizeControls
              fontSize={fontSize}
              arabicFontSize={arabicFontSize}
              onFontSizeChange={handleFontSizeChange}
              onArabicFontSizeChange={handleArabicFontSizeChange}
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <DrawerFooter className="px-5 py-3 border-t border-gray-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
          <SettingsResetButton onReset={resetAll} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
