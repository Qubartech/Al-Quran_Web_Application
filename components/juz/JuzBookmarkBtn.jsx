"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { Bookmark } from "lucide-react";

export default function JuzBookmarkBtn({ juzId, juzName, startSurah, endSurah }) {
  const { user, session } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !session?.access_token) {
      setIsBookmarked(false);
      return;
    }
    fetch("/api/favorites/juz", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.some((item) => item.juzId === juzId);
          setIsBookmarked(found);
        }
      })
      .catch((e) => console.error("Error fetching juz bookmark state:", e));
  }, [user, session?.access_token, juzId]);

  const handleToggle = async () => {
    if (!user || !session?.access_token) {
      alert("Please Sign In to whitelist Juzs!");
      return;
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        await fetch(`/api/favorites/juz?juzId=${juzId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setIsBookmarked(false);
      } else {
        await fetch("/api/favorites/juz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            juzId,
            juzName: juzName || "",
            startSurah: startSurah || "",
            endSurah: endSurah || "",
          }),
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error("Error toggling juz bookmark:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`mt-2.5 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
        isBookmarked
          ? "bg-primaryColor/10 dark:bg-emerald-500/20 border-primaryColor/30 text-primaryColor dark:text-primaryColor-light"
          : "bg-white/40 dark:bg-slate-800/40 border-gray-250/20 dark:border-slate-800/25 text-gray-500 dark:text-gray-400 hover:text-primaryColor dark:hover:text-primaryColor hover:border-primaryColor/30"
      }`}
    >
      <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
      {isBookmarked ? "Whitelisted Juz" : "Whitelist Juz"}
    </button>
  );
}
