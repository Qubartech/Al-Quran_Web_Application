export const learnLevels = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Basic Arabic Alphabets & Qaida",
    subtitle: "Master letter shapes, articulation points (Makharij), and basic vowels",
    badge: "Beginner",
    color: "from-emerald-500 to-teal-600",
    icon: "🔤",
    modules: [
      {
        id: "mod-1-1",
        title: "The 28 Arabic Alphabets",
        description: "Learn to recognize all 28 Arabic letters in their isolated forms and pronunciation points.",
        estimatedMinutes: 15,
        slides: [
          {
            title: "Introduction to Arabic Alphabets",
            content: "Arabic is read from right to left. There are 28 basic letters. Each letter has a unique sound produced from specific parts of the throat, tongue, or lips (Makharij).",
            gridItems: [
              { arabic: "أ", name: "Alif", trans: "a", tip: "Emitted from empty space in mouth/throat" },
              { arabic: "ب", name: "Ba", trans: "b", tip: "Formed by closing both lips together" },
              { arabic: "ت", name: "Ta", trans: "t", tip: "Tip of tongue touching root of upper teeth" },
              { arabic: "ث", name: "Tha", trans: "th", tip: "Tip of tongue touching edge of upper front teeth" },
              { arabic: "ج", name: "Jeem", trans: "j", tip: "Middle of tongue touching roof of mouth" },
              { arabic: "ح", name: "Ha", trans: "h (sharp)", tip: "Middle part of the throat" },
              { arabic: "خ", name: "Kha", trans: "kh", tip: "Top part of the throat near mouth" },
              { arabic: "د", name: "Dal", trans: "d", tip: "Tip of tongue touching roots of upper teeth" }
            ]
          },
          {
            title: "Heavy vs. Light Letters (Tafkheem & Tarqeeq)",
            content: "7 Arabic letters are ALWAYS pronounced with a full, heavy voice (Tafkheem): خ ص ض غ ط ق ظ. Remember the phrase: خُصَّ ضَغْطٍ قِظْ.",
            examples: [
              { arabic: "خَالِدِينَ", trans: "Khalideena (Heavy Kha)" },
              { arabic: "صِرَاطَ", trans: "Sirata (Heavy Sad & Ta)" },
              { arabic: "الْغَفُورُ", trans: "Al-Ghafoor (Heavy Ghayn)" }
            ]
          }
        ],
        quiz: [
          {
            question: "Which of the following letters is ALWAYS pronounced heavy (Tafkheem)?",
            options: ["ب (Ba)", "خ (Kha)", "ت (Ta)", "م (Meem)"],
            correctAnswer: 1,
            explanation: "Kha (خ) is one of the 7 heavy letters in Arabic."
          },
          {
            question: "From where is the letter 'Ba' (ب) articulated?",
            options: ["Middle of throat", "Tip of tongue", "Closing both lips", "Roof of mouth"],
            correctAnswer: 2,
            explanation: "'Ba' is pronounced by bringing both lips together."
          }
        ]
      },
      {
        id: "mod-1-2",
        title: "Short Vowels (Harakat: Fatha, Kasra, Damma)",
        description: "Understand short vowel marks that give letters sound.",
        estimatedMinutes: 12,
        slides: [
          {
            title: "The Three Primary Short Vowels",
            content: "In Arabic, vowel sounds are indicated by small symbols above or below letters:",
            bullets: [
              "Fatha ( َ ): Dash above letter — sound 'a' (e.g. 💥 بَ = Ba)",
              "Kasra ( ِ ): Dash below letter — sound 'i' (e.g. 💥 بِ = Bi)",
              "Damma ( ُ ): Small 9-like shape above — sound 'u' (e.g. 💥 بُ = Bu)"
            ],
            gridItems: [
              { arabic: "كَتَبَ", name: "Ka-Ta-Ba", trans: "He wrote", tip: "3 Fathas" },
              { arabic: "سَمِعَ", name: "Sa-Mi-'A", trans: "He heard", tip: "Fatha, Kasra, Fatha" },
              { arabic: "كُتِبَ", name: "Ku-Ti-Ba", trans: "It was written", tip: "Damma, Kasra, Fatha" }
            ]
          }
        ],
        quiz: [
          {
            question: "What sound does Kasra ( ِ ) produce?",
            options: ["'a' sound", "'u' sound", "'i' sound", "Silent sound"],
            correctAnswer: 2,
            explanation: "Kasra placed under a letter makes an 'i' sound like in 'Bi'."
          }
        ]
      },
      {
        id: "mod-1-3",
        title: "Tanween, Sukoon & Shaddah",
        description: "Master double vowels (nunnation), silent letters (Sukoon), and doubled consonants (Shaddah).",
        estimatedMinutes: 15,
        slides: [
          {
            title: "Understanding Sukoon ( ْ ) & Shaddah ( ّ )",
            content: "Sukoon means a letter has no vowel (silent rest). Shaddah doubles a letter: the first is silent (Sukoon) and the second has a vowel.",
            examples: [
              { arabic: "مَنْ", trans: "Man (Nūn with Sukoon)" },
              { arabic: "رَبَّنَا", trans: "Rabbana (Double Ba with Shaddah: Rab-bana)" },
              { arabic: "كِتَابًا", trans: "Kitaban (Double Fatha Tanween = 'an')" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does Shaddah ( ّ ) indicate on a letter?",
            options: ["Make it silent", "Double the letter", "Long vowel 'aa'", "End of verse"],
            correctAnswer: 1,
            explanation: "Shaddah means the letter is doubled (first silent, second vocalized)."
          }
        ]
      }
    ]
  },

  {
    id: "level-2",
    levelNumber: 2,
    title: "Tajweed Rules & Recitation Polish",
    subtitle: "Learn essential Tajweed rules: Nun Sakinah, Meem Sakinah, Madd, and Waqf",
    badge: "Intermediate",
    color: "from-cyan-500 to-blue-600",
    icon: "📖",
    modules: [
      {
        id: "mod-2-1",
        title: "Rules of Nun Sakinah & Tanween",
        description: "Master the 4 fundamental Tajweed rules: Izhar, Idgham, Iqlab, and Ikhfa.",
        estimatedMinutes: 20,
        slides: [
          {
            title: "Overview of Nun Sakinah (نْ) & Tanween",
            content: "When a silent Nun (نْ) or Tanween (ً ٍ ٌ) is followed by any Arabic letter, one of 4 rules applies:",
            bullets: [
              "1. Izhar (Clear): Pronounced clearly without nasal sound when followed by throat letters (ء هـ ع ح غ خ).",
              "2. Idgham (Merging): Merged into the next letter when followed by (ي ر م ل و ن - Yarmaloon).",
              "3. Iqlab (Conversion): Turned into a 'Meem' sound when followed by 'Ba' (ب).",
              "4. Ikhfa (Hiding): Hidden with nasal ghunnah (2 counts) before the remaining 15 letters."
            ],
            examples: [
              { arabic: "مَنْ آمَنَ", trans: "Man Aamana (Izhar - Clear)" },
              { arabic: "مَن يَقُولُ", trans: "May-Yaqoolu (Idgham with Ghunnah)" },
              { arabic: "مِن بَعْدِ", trans: "Mim-Ba'di (Iqlab - Nun becomes M)" },
              { arabic: "مِن قَبْلِ", trans: "Min-Qabli (Ikhfa - Hidden N with Ghunnah)" }
            ]
          }
        ],
        quiz: [
          {
            question: "What happens in Iqlab when Nun Sakinah is followed by 'Ba' (ب)?",
            options: ["It is omitted", "It changes to 'Meem' sound", "It is pronounced extra loud", "It is merged into Alif"],
            correctAnswer: 1,
            explanation: "Iqlab converts the silent Nun into a soft Meem sound (e.g. Min Ba'd -> Mim Ba'd)."
          },
          {
            question: "Which letters trigger Izhar (Clear Nun Sakinah)?",
            options: ["Yarmaloon letters", "Throat letters (ء هـ ع ح غ خ)", "Lip letters", "Heavy letters"],
            correctAnswer: 1,
            explanation: "The 6 throat letters cause Nun Sakinah to be pronounced clearly (Izhar)."
          }
        ]
      },
      {
        id: "mod-2-2",
        title: "Madd (Elongation Rules)",
        description: "Learn short Madd (2 counts) vs. long Madd (4-6 counts).",
        estimatedMinutes: 15,
        slides: [
          {
            title: "Natural Madd vs. Obligatory Madd",
            content: "Madd means stretching the sound of Madd letters (ا , و , ي):",
            bullets: [
              "Madd Asli (Natural): Stretch for 2 counts (e.g., قَالَ Qala).",
              "Madd Muttasil (Connected): Stretch for 4-5 counts when Hamzah is in the same word (e.g., جَاءَ Jaaa'a).",
              "Madd Munfasil (Separated): Stretch for 4-5 counts when Hamzah is in the next word (e.g., فِي أَنفُسِكُمْ)."
            ]
          }
        ],
        quiz: [
          {
            question: "How many counts is Natural Madd (Madd Asli) stretched?",
            options: ["1 count", "2 counts", "6 counts", "No stretch"],
            correctAnswer: 1,
            explanation: "Natural Madd is stretched for exactly 2 counts."
          }
        ]
      }
    ]
  },

  {
    id: "level-3",
    levelNumber: 3,
    title: "High-Frequency Quranic Vocabulary",
    subtitle: "Learn the 80% most frequent words in the Holy Quran to understand while listening",
    badge: "Advanced",
    color: "from-amber-500 to-orange-600",
    icon: "💡",
    modules: [
      {
        id: "mod-3-1",
        title: "Top Quranic Nouns & Pronouns",
        description: "Key words that appear hundreds of times in every Surah.",
        estimatedMinutes: 20,
        slides: [
          {
            title: "Common Quranic Nouns & Pronouns",
            content: "Mastering these core words unlocks immediate understanding of large portions of verses:",
            gridItems: [
              { arabic: "اللَّه", name: "Allah", trans: "God / The One Almighty God", tip: "Occurs 2,699 times" },
              { arabic: "رَبّ", name: "Rabb", trans: "Lord / Sustainer / Cherisher", tip: "Occurs 970+ times" },
              { arabic: "أَرْض", name: "Ard", trans: "Earth / Land", tip: "Occurs 460+ times" },
              { arabic: "سَمَاء", name: "Samaa", trans: "Sky / Heaven", tip: "Occurs 310+ times" },
              { arabic: "يَوْم", name: "Yawm", trans: "Day", tip: "Occurs 400+ times" },
              { arabic: "قَلْب", name: "Qalb", trans: "Heart", tip: "Occurs 160+ times" },
              { arabic: "عَلِيم", name: "Aleem", trans: "All-Knowing", tip: "Attribute of Allah" },
              { arabic: "رَحِيم", name: "Raheem", trans: "Most Merciful", tip: "Attribute of Allah" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does the Quranic word 'Rabb' (رَبّ) mean?",
            options: ["Sky", "Lord / Sustainer", "Heart", "Book"],
            correctAnswer: 1,
            explanation: "Rabb means Lord, Owner, and Cherisher who sustains creation."
          }
        ]
      }
    ]
  },

  {
    id: "level-4",
    levelNumber: 4,
    title: "Quranic Grammar & Themes",
    subtitle: "Master Arabic sentence structures, root words, and thematic Surah insights",
    badge: "Mastery",
    color: "from-purple-600 to-indigo-700",
    icon: "🎓",
    modules: [
      {
        id: "mod-4-1",
        title: "3 Parts of Arabic Speech (اسم , فعل , حرف)",
        description: "Classify Arabic words into Nouns (Ism), Verbs (Fi'l), and Particles (Harf).",
        estimatedMinutes: 25,
        slides: [
          {
            title: "Understanding Word Types in Quranic Arabic",
            content: "Every single word in the Quran belongs to one of three categories:",
            bullets: [
              "1. Ism (اسم): Person, place, thing, adjective, or idea (e.g. كِتَاب Book).",
              "2. Fi'l (فِعْل): Action bound by time — Past, Present, or Command (e.g. خَلَقَ He created).",
              "3. Harf (حَرْف): Preposition or particle that connects words (e.g. فِي In, مِنْ From)."
            ]
          }
        ],
        quiz: [
          {
            question: "Into how many parts of speech is Arabic classified?",
            options: ["8 parts", "5 parts", "3 parts (Ism, Fi'l, Harf)", "12 parts"],
            correctAnswer: 2,
            explanation: "Arabic grammar classifies all words strictly into 3 categories: Ism, Fi'l, and Harf."
          }
        ]
      }
    ]
  }
];
