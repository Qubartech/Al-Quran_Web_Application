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
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/settings/ThemeToggle";
import LanguageSelect from "@/components/settings/LanguageSelect";
import TranslationSelect from "@/components/settings/TranslationSelect";
import FontSizeControls from "@/components/settings/FontSizeControls";
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
    handleThemeChange,
    handleLanguageChange,
    handleIdentifierChange,
    handleFontSizeChange,
    handleArabicFontSizeChange,
    resetAll,
  } = useSettings();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-md ml-auto h-full">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Configure your application settings
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 py-3">
          <ThemeToggle value={themeChoice} onChange={handleThemeChange} />

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

          <FontSizeControls
            fontSize={fontSize}
            arabicFontSize={arabicFontSize}
            onFontSizeChange={handleFontSizeChange}
            onArabicFontSizeChange={handleArabicFontSizeChange}
          />
        </div>

        <DrawerFooter className="pt-2">
          <SettingsResetButton onReset={resetAll} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
