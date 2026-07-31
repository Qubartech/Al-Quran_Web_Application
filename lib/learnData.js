export const learnLevels = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Basic Arabic Alphabets & Qaida",
    subtitle: "Master letter shapes, articulation points (Makharij), short vowels, and joining rules",
    badge: "Beginner",
    color: "from-emerald-500 to-teal-600",
    icon: "🔤",
    modules: [
      {
        id: "mod-1-1",
        title: "The 28 Arabic Alphabets & Makharij",
        description: "Learn to recognize all 28 Arabic letters in their isolated forms and their exact articulation points in the vocal tract.",
        estimatedMinutes: 15,
        category: "Qaida",
        slides: [
          {
            title: "Arabic Alphabets (Part 1: Letters 1 – 14)",
            content: "Arabic is written from right to left. Here are the first 14 of the 28 basic Arabic letters with their articulation points (Makharij):",
            gridItems: [
              { arabic: "أ", name: "Alif", trans: "a", tip: "Empty space in throat/mouth" },
              { arabic: "ب", name: "Ba", trans: "b", tip: "Closing both lips together" },
              { arabic: "ت", name: "Ta", trans: "t", tip: "Tip of tongue on upper teeth roots" },
              { arabic: "ث", name: "Tha", trans: "th", tip: "Tip of tongue on upper teeth edges" },
              { arabic: "ج", name: "Jeem", trans: "j", tip: "Middle of tongue on palate roof" },
              { arabic: "ح", name: "Ha", trans: "h (sharp)", tip: "Middle part of the throat" },
              { arabic: "خ", name: "Kha", trans: "kh (heavy)", tip: "Top part of the throat" },
              { arabic: "د", name: "Dal", trans: "d", tip: "Tip of tongue on upper teeth roots" },
              { arabic: "ذ", name: "Dhal", trans: "dh", tip: "Tip of tongue on upper teeth edges" },
              { arabic: "ر", name: "Ra", trans: "r", tip: "Tip of tongue touching palate" },
              { arabic: "ز", name: "Zay", trans: "z", tip: "Tip of tongue near front teeth" },
              { arabic: "س", name: "Seen", trans: "s", tip: "Tip of tongue behind lower teeth" },
              { arabic: "ش", name: "Sheen", trans: "sh", tip: "Middle of tongue near roof of mouth" },
              { arabic: "ص", name: "Sad", trans: "S (heavy)", tip: "Tip of tongue with heavy sound" }
            ]
          },
          {
            title: "Arabic Alphabets (Part 2: Letters 15 – 28)",
            content: "Here are the remaining 14 letters completing all 28 Arabic alphabets:",
            gridItems: [
              { arabic: "ض", name: "Dhad", trans: "Dh (heavy)", tip: "Edge of tongue on upper molars" },
              { arabic: "ط", name: "Ta", trans: "T (heavy)", tip: "Tip of tongue on upper teeth roots" },
              { arabic: "ظ", name: "Za", trans: "Z (heavy)", tip: "Tip of tongue on upper teeth edges" },
              { arabic: "ع", name: "'Ayn", trans: "'a", tip: "Middle part of the throat" },
              { arabic: "غ", name: "Ghayn", trans: "gh (heavy)", tip: "Upper part of the throat" },
              { arabic: "ف", name: "Fa", trans: "f", tip: "Inner lower lip on upper teeth tips" },
              { arabic: "ق", name: "Qaf", trans: "q (heavy)", tip: "Deep back of tongue on soft palate" },
              { arabic: "ك", name: "Kaf", trans: "k", tip: "Back of tongue against hard palate" },
              { arabic: "ل", name: "Lam", trans: "l", tip: "Edge of tongue touching upper palate" },
              { arabic: "م", name: "Meem", trans: "m", tip: "Closing both lips with nasal tone" },
              { arabic: "ن", name: "Nun", trans: "n", tip: "Tip of tongue on upper palate" },
              { arabic: "هـ", name: "Ha", trans: "h (soft)", tip: "Deep bottom part of throat" },
              { arabic: "و", name: "Waw", trans: "w", tip: "Rounding both lips without touching" },
              { arabic: "ي", name: "Yaa", trans: "y", tip: "Middle of tongue touching palate" }
            ]
          },
          {
            title: "Heavy vs. Light Letters (Tafkheem & Tarqeeq)",
            content: "7 Arabic letters are ALWAYS pronounced with a full, heavy voice (Tafkheem): خ ص ض غ ط ق ظ. Remember the phrase: خُصَّ ضَغْطٍ قِظْ.",
            examples: [
              { arabic: "خَالِدِينَ", trans: "Khalideena (Heavy Kha)" },
              { arabic: "صِرَاطَ", trans: "Sirata (Heavy Sad & Ta)" },
              { arabic: "الْغَفُورُ", trans: "Al-Ghafoor (Heavy Ghayn)" },
              { arabic: "الظَّالِمِينَ", trans: "Az-Zalimeena (Heavy Za)" }
            ]
          }
        ],
        quiz: [
          {
            question: "Which of the following letters is ALWAYS pronounced heavy (Tafkheem)?",
            options: ["ب (Ba)", "خ (Kha)", "ت (Ta)", "م (Meem)"],
            correctAnswer: 1,
            explanation: "Kha (خ) is one of the 7 heavy letters in Arabic summarized by 'خص ضغط قظ'."
          },
          {
            question: "From where is the letter 'Ba' (ب) articulated?",
            options: ["Middle of throat", "Tip of tongue", "Closing both lips", "Roof of mouth"],
            correctAnswer: 2,
            explanation: "'Ba' is pronounced by bringing both lips gently together."
          },
          {
            question: "How many letters are in the basic Arabic alphabet?",
            options: ["24", "26", "28", "30"],
            correctAnswer: 2,
            explanation: "The Arabic language consists of 28 fundamental letters."
          },
          {
            question: "From where is the sharp throat letter 'Ha' (ح) articulated?",
            options: ["Lips", "Middle part of throat", "Nasal passage", "Teeth edges"],
            correctAnswer: 1,
            explanation: "The letter 'Ha' (ح) comes from the middle region of the throat (Wasat al-Halq)."
          }
        ]
      },
      {
        id: "mod-1-2",
        title: "Short Vowels (Harakat: Fatha, Kasra, Damma)",
        description: "Understand short vowel marks that give movement and sound to Arabic consonants.",
        estimatedMinutes: 12,
        category: "Qaida",
        slides: [
          {
            title: "The Three Primary Short Vowels",
            content: "In Arabic, consonants are silent until vowel symbols (Harakat) are placed above or below them:",
            bullets: [
              "Fatha ( َ ): Small dash above letter — produces 'a' sound (e.g. بَ = Ba)",
              "Kasra ( ِ ): Small dash below letter — produces 'i' sound (e.g. بِ = Bi)",
              "Damma ( ُ ): Small loop (9-shape) above letter — produces 'u' sound (e.g. بُ = Bu)"
            ],
            gridItems: [
              { arabic: "كَتَبَ", name: "Ka-Ta-Ba", trans: "He wrote", tip: "3 Fathas" },
              { arabic: "سَمِعَ", name: "Sa-Mi-'A", trans: "He heard", tip: "Fatha, Kasra, Fatha" },
              { arabic: "كُتِبَ", name: "Ku-Ti-Ba", trans: "It was written", tip: "Damma, Kasra, Fatha" },
              { arabic: "قُرِئَ", name: "Qu-Ri-'A", trans: "It was recited", tip: "Damma, Kasra, Fatha" }
            ]
          }
        ],
        quiz: [
          {
            question: "What sound does Kasra ( ِ ) produce?",
            options: ["'a' sound", "'u' sound", "'i' sound", "Silent rest"],
            correctAnswer: 2,
            explanation: "Kasra placed under a letter produces an 'i' sound like in 'Bi'."
          },
          {
            question: "Where is Fatha ( َ ) placed on an Arabic letter?",
            options: ["Below the letter", "Above the letter", "Inside the letter", "After the letter"],
            correctAnswer: 1,
            explanation: "Fatha is drawn as a small diagonal line above the letter."
          },
          {
            question: "What is the vowel mark for the 'u' sound in 'Bu' (بُ)?",
            options: ["Sukoon", "Damma", "Kasra", "Fatha"],
            correctAnswer: 1,
            explanation: "Damma ( ُ ) produces the short 'u' sound."
          },
          {
            question: "What is the pronunciation of (خَلَقَ)?",
            options: ["Khi-li-qa", "Kha-la-qa", "Khu-lu-qu", "Kha-li-qa"],
            correctAnswer: 1,
            explanation: "All three letters have Fatha: Kha - La - Qa."
          }
        ]
      },
      {
        id: "mod-1-3",
        title: "Tanween, Sukoon & Shaddah",
        description: "Master double vowels (nunnation), silent resting letters (Sukoon), and doubled consonants (Shaddah).",
        estimatedMinutes: 15,
        category: "Qaida",
        slides: [
          {
            title: "Tanween (Nunnation)",
            content: "Tanween adds a hidden 'N' sound (نْ) to the end of a noun. It comes in 3 forms: Tanween Fatha (ً - an), Tanween Kasra (ٍ - in), and Tanween Damma (ٌ - un)."
          },
          {
            title: "Sukoon ( ْ ) & Shaddah ( ّ )",
            content: "Sukoon signifies a rest (no vowel). Shaddah signifies a doubled consonant — the first is resting (Sukoon) and the second is vocalized.",
            examples: [
              { arabic: "مَنْ", trans: "Man (Nūn with Sukoon rest)" },
              { arabic: "رَبَّنَا", trans: "Rabbana (Shaddah on Ba: Rab-bana)" },
              { arabic: "كِتَابًا", trans: "Kitaban (Double Fatha Tanween = 'an')" },
              { arabic: "عَلِيمٌ", trans: "Aleemun (Double Damma Tanween = 'un')" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does Shaddah ( ّ ) indicate on a letter?",
            options: ["Make it silent", "Double the letter", "Long vowel 'aa'", "End of verse"],
            correctAnswer: 1,
            explanation: "Shaddah doubles a consonant (first silent, second vocalized)."
          },
          {
            question: "What sound does Tanween Fatha ( ً ) make at the end of a word?",
            options: ["'-un'", "'-in'", "'-an'", "'-oo'"],
            correctAnswer: 2,
            explanation: "Tanween Fatha adds an '-an' sound at the end of the word."
          },
          {
            question: "What symbol indicates a consonant is silent without any vowel movement?",
            options: ["Fatha", "Shaddah", "Sukoon ( ْ )", "Kasra"],
            correctAnswer: 2,
            explanation: "Sukoon indicates that the letter is pronounced in a stationary rest state."
          },
          {
            question: "In the word (كِتَابًا), what symbol is at the end?",
            options: ["Tanween Fatha", "Tanween Kasra", "Damma", "Sukoon"],
            correctAnswer: 0,
            explanation: "The word ends with double Fatha (Tanween Fatha), pronounced 'Kitaban'."
          }
        ]
      },
      {
        id: "mod-1-4",
        title: "Long Vowels (Huroof al-Madd)",
        description: "Learn how Alif, Ya, and Waw stretch short vowels into natural long vowels (2 counts).",
        estimatedMinutes: 14,
        category: "Qaida",
        slides: [
          {
            title: "The Three Madd Letters (ا , و , ي)",
            content: "When a short vowel is followed by its matching Madd letter, the sound is stretched for 2 counts:",
            bullets: [
              "Fatha followed by Alif ( َ + ا ): Stretches 'a' to 'aa' (e.g. قَالَ Qala)",
              "Damma followed by Waw ( ُ + و ): Stretches 'u' to 'oo' (e.g. يَقُولُ Yaqoolu)",
              "Kasra followed by Ya ( ِ + ي ): Stretches 'i' to 'ee' (e.g. قِيلَ Qeela)"
            ],
            gridItems: [
              { arabic: "قَالَ", name: "Qala", trans: "He said", tip: "Alif Madd (aa)" },
              { arabic: "يَقُولُ", name: "Yaqoolu", trans: "He says", tip: "Waw Madd (oo)" },
              { arabic: "قِيلَ", name: "Qeela", trans: "It was said", tip: "Ya Madd (ee)" },
              { arabic: "نُوحِيهَا", name: "Noo-hee-haa", trans: "We reveal it", tip: "All 3 Madds combined!" }
            ]
          }
        ],
        quiz: [
          {
            question: "Which letter stretches a Fatha vowel into a long 'aa' sound?",
            options: ["Waw", "Alif (ا)", "Ya", "Meem"],
            correctAnswer: 1,
            explanation: "Alif preceded by Fatha creates the long 'aa' vowel."
          },
          {
            question: "How long should Natural Madd (Madd Asli) be held?",
            options: ["1 count", "2 counts", "6 counts", "4 counts"],
            correctAnswer: 1,
            explanation: "Natural Madd is stretched for exactly 2 counts (approx 1 second)."
          },
          {
            question: "In the word (يَقُولُ), which Madd letter is present?",
            options: ["Alif", "Waw (و)", "Ya", "None"],
            correctAnswer: 1,
            explanation: "Waw Sakinah preceded by Damma produces the long 'oo' sound."
          },
          {
            question: "Which iconic word contains all three long Madd letters in a single word?",
            options: ["كِتَابٌ", "نُوحِيهَا", "الْحَمْدُ", "سَمِيعٌ"],
            correctAnswer: 1,
            explanation: "Nu-hi-ha (نُوحِيهَا) combines Waw Madd (oo), Ya Madd (ee), and Alif Madd (aa)."
          }
        ]
      },
      {
        id: "mod-1-5",
        title: "Letter Shapes & Compound Joining (Murakkabat)",
        description: "Understand how Arabic letters change shape in Initial, Medial, and Final positions when connected.",
        estimatedMinutes: 16,
        category: "Qaida",
        slides: [
          {
            title: "Letter Positions (Initial, Medial, Final)",
            content: "Most Arabic letters connect to adjacent letters in cursive script. A letter can have 4 visual states: Isolated, Initial (Start), Medial (Middle), and Final (End).",
            bullets: [
              "Non-connecting letters (6 letters only): Alif (ا), Dal (د), Dhal (ذ), Ra (ر), Zay (ز), Waw (و) NEVER connect to the letter after them.",
              "Connecting letters (22 letters): Change form to attach to both preceding and succeeding letters."
            ],
            gridItems: [
              { arabic: "بـ ـبـ ـب", name: "Ba", trans: "b", tip: "Initial, Medial, Final" },
              { arabic: "جـ ـجـ ـج", name: "Jeem", trans: "j", tip: "Initial, Medial, Final" },
              { arabic: "سـ ـسـ ـس", name: "Seen", trans: "s", tip: "Initial, Medial, Final" },
              { arabic: "عـ ـعـ ـع", name: "'Ayn", trans: "'a", tip: "Initial, Medial, Final" }
            ]
          }
        ],
        quiz: [
          {
            question: "How many Arabic letters NEVER connect to the letter after them?",
            options: ["22 letters", "6 letters (ا د ذ ر ز و)", "10 letters", "All letters connect"],
            correctAnswer: 1,
            explanation: "The 6 non-connecting letters only attach to preceding letters, never to what follows."
          },
          {
            question: "In the word (بِسْمِ), what position is the letter 'Ba' (بـ)?",
            options: ["Isolated", "Initial (Beginning of word)", "Medial", "Final"],
            correctAnswer: 1,
            explanation: "'Ba' is in the Initial position at the start of the word 'Bism'."
          },
          {
            question: "Does the letter 'Alif' (ا) connect to the letter after it?",
            options: ["Yes, always", "No, never", "Only in verbs", "Only with Fatha"],
            correctAnswer: 1,
            explanation: "Alif is one of the 6 non-connecting letters."
          },
          {
            question: "What happens to the letter 'Jeem' (ج) when written at the beginning of a word?",
            options: ["It keeps its big loop tail", "Its tail is dropped and it extends a line to connect (جـ)", "It becomes silent", "It turns into Alif"],
            correctAnswer: 1,
            explanation: "In initial form, Jeem drops its lower tail to connect to the next letter."
          }
        ]
      }
    ]
  },

  {
    id: "level-2",
    levelNumber: 2,
    title: "Tajweed Rules & Recitation Polish",
    subtitle: "Learn essential Tajweed rules: Nun Sakinah, Meem Sakinah, Madds, Qalqala, Waqf, and Ra rules",
    badge: "Intermediate",
    color: "from-cyan-500 to-blue-600",
    icon: "📖",
    modules: [
      {
        id: "mod-2-1",
        title: "Rules of Nun Sakinah & Tanween",
        description: "Master the 4 fundamental Tajweed rules: Izhar, Idgham, Iqlab, and Ikhfa.",
        estimatedMinutes: 20,
        category: "Tajweed",
        slides: [
          {
            title: "Overview of Nun Sakinah (نْ) & Tanween",
            content: "When a silent Nun (نْ) or Tanween (ً ٍ ٌ) meets any Arabic letter, one of 4 rules applies:",
            bullets: [
              "1. Izhar (Clear): Pronounced clearly without nasal sound before 6 throat letters (ء هـ ع ح غ خ).",
              "2. Idgham (Merging): Merged into the next letter before 6 letters (ي ر م ل و ن - Yarmaloon).",
              "3. Iqlab (Conversion): Converted into a 'Meem' sound before 'Ba' (ب).",
              "4. Ikhfa (Hiding): Hidden with 2-count nasal Ghunnah before the remaining 15 letters."
            ],
            examples: [
              { arabic: "مَنْ آمَنَ", trans: "Man Aamana (Izhar - Clear N)" },
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
            options: ["Yarmaloon letters", "6 Throat letters (ء هـ ع ح غ خ)", "Lip letters", "Heavy letters"],
            correctAnswer: 1,
            explanation: "The 6 throat letters cause Nun Sakinah to be pronounced clearly without nasal sound."
          },
          {
            question: "Which phrase summarizes the 6 letters of Idgham?",
            options: ["خُصَّ ضَغْطٍ", "يَرْمَلُونَ (Yarmaloon)", "قُطْبُ جَدٍ", "أَبْجَدْ"],
            correctAnswer: 1,
            explanation: "The 6 letters of Idgham are Ya, Ra, Meem, Lam, Waw, Nun (ي ر م ل و ن)."
          },
          {
            question: "How long should the nasal Ghunnah sound be held in Ikhfa?",
            options: ["1 count", "2 counts", "4 counts", "No nasal sound"],
            correctAnswer: 1,
            explanation: "The nasal Ghunnah in Ikhfa is held for exactly 2 counts."
          }
        ]
      },
      {
        id: "mod-2-2",
        title: "Rules of Meem Sakinah (مْ)",
        description: "Understand the 3 Tajweed rules for silent Meem: Ikhfa Shafawi, Idgham Shafawi, and Izhar Shafawi.",
        estimatedMinutes: 15,
        category: "Tajweed",
        slides: [
          {
            title: "The 3 Rules of Meem Sakinah",
            content: "When a Meem has a Sukoon (مْ), its pronunciation depends on the letter that follows it:",
            bullets: [
              "1. Ikhfa Shafawi (Labial Hiding): When followed by 'Ba' (ب), hide the Meem with Ghunnah (e.g. تَرْمِيهِم بِحِجَارَةٍ).",
              "2. Idgham Shafawi (Labial Merging): When followed by another 'Meem' (م), merge them with Ghunnah (e.g. لَهُم مَّا يَشَاءُونَ).",
              "3. Izhar Shafawi (Labial Clarity): When followed by ANY OTHER letter, pronounce Meem clearly without extra Ghunnah."
            ],
            examples: [
              { arabic: "تَرْمِيهِم بِحِجَارَةٍ", trans: "Tarmeehim bi-hijarah (Ikhfa Shafawi)" },
              { arabic: "لَهُم مَّا يَشَاءُونَ", trans: "Lahum-ma yasha'oon (Idgham Shafawi)" },
              { arabic: "أَنعَمتَ عَلَيهِم", trans: "An'amta 'alayhim (Izhar Shafawi)" }
            ]
          }
        ],
        quiz: [
          {
            question: "What rule applies when Meem Sakinah (مْ) is followed by 'Ba' (ب)?",
            options: ["Idgham Shafawi", "Ikhfa Shafawi", "Izhar Shafawi", "Qalqala"],
            correctAnswer: 1,
            explanation: "When Meem Sakinah meets 'Ba', it is hidden with nasal Ghunnah (Ikhfa Shafawi)."
          },
          {
            question: "What rule applies when Meem Sakinah meets another Meem (م)?",
            options: ["Idgham Shafawi", "Izhar", "Iqlab", "Madd Muttasil"],
            correctAnswer: 0,
            explanation: "The two Meems merge into a single doubled Meem with Ghunnah (Idgham Shafawi)."
          },
          {
            question: "How many letters trigger Izhar Shafawi?",
            options: ["2 letters", "6 letters", "26 letters (all except Ba & Meem)", "15 letters"],
            correctAnswer: 2,
            explanation: "Izhar Shafawi applies to all 26 remaining letters except Ba and Meem."
          },
          {
            question: "In (أَنْعَمْتَ عَلَيْهِمْ), how is the Meem Sakinah in 'An'amta' pronounced?",
            options: ["Hidden with Ghunnah", "Clearly (Izhar Shafawi)", "Changed to Nun", "Omitted"],
            correctAnswer: 1,
            explanation: "Since it is followed by 'Ta', it is pronounced clearly (Izhar Shafawi)."
          }
        ]
      },
      {
        id: "mod-2-3",
        title: "Madd (Elongation Rules)",
        description: "Learn short Madd (2 counts) vs. long Madd (4-6 counts) in recitation.",
        estimatedMinutes: 18,
        category: "Tajweed",
        slides: [
          {
            title: "Types of Elongation (Madd)",
            content: "Madd means stretching the sound of Madd letters (ا , و , ي):",
            bullets: [
              "Madd Asli (Natural): Stretch for 2 counts (e.g., قَالَ Qala).",
              "Madd Muttasil (Connected): Stretch for 4-5 counts when Hamzah is in the SAME word (e.g., جَاءَ Jaaa'a).",
              "Madd Munfasil (Separated): Stretch for 4-5 counts when Hamzah is in the NEXT word (e.g., فِي أَنفُسِكُمْ).",
              "Madd Laazim (Compulsory): Stretch for 6 full counts when Madd letter is followed by a Shaddah/Sukoon (e.g. الضَّالِّينَ)."
            ]
          }
        ],
        quiz: [
          {
            question: "How many counts is Natural Madd (Madd Asli) stretched?",
            options: ["1 count", "2 counts", "6 counts", "No stretch"],
            correctAnswer: 1,
            explanation: "Natural Madd is stretched for exactly 2 counts."
          },
          {
            question: "What is Madd Muttasil?",
            options: ["Hamzah in next word", "Hamzah in same word (4-5 counts)", "Madd at end of Surah", "Silent Madd"],
            correctAnswer: 1,
            explanation: "Madd Muttasil occurs when a Madd letter and Hamzah are connected in the same word."
          },
          {
            question: "How long is Madd Laazim (e.g., in الضَّالِّينَ) stretched?",
            options: ["2 counts", "4 counts", "6 full counts", "8 counts"],
            correctAnswer: 2,
            explanation: "Madd Laazim is compulsory and must be held for 6 full counts."
          },
          {
            question: "In the phrase (فِي أَنفُسِكُمْ), what type of Madd is present in 'Fee'?",
            options: ["Madd Asli", "Madd Muttasil", "Madd Munfasil (Separated)", "Madd Laazim"],
            correctAnswer: 2,
            explanation: "Madd Munfasil occurs because 'Fee' ends with Madd and the next word starts with Hamzah."
          }
        ]
      },
      {
        id: "mod-2-4",
        title: "Qalqala (Echoing / Bouncing Sound)",
        description: "Master the 5 Qalqala letters (ق ط ب ج د) and how to produce their crisp echoing sound.",
        estimatedMinutes: 12,
        category: "Tajweed",
        slides: [
          {
            title: "The 5 Qalqala Letters (قُطْبُ جَدٍ)",
            content: "When any of these 5 letters has a Sukoon (مْنْ) or when stopping upon it at the end of a verse, it must be recited with a rebounding echo:",
            bullets: [
              "Qaf (ق), Ta (ط), Ba (ب), Jeem (ج), Dal (د)",
              "Qalqala Sughra (Minor): Sukoon in the middle of a word (e.g. يَجْعَلُونَ Yaj-'aloon).",
              "Qalqala Kubra (Major): Stopping at the end of an Ayah on a Qalqala letter (e.g. الْفَلَقِ Al-Falaq)."
            ],
            examples: [
              { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", trans: "Ahad (Major Qalqala on Dal when stopping)" },
              { arabic: "مِن شَرِّ مَا خَلَقَ", trans: "Khalaq (Major Qalqala on Qaf)" },
              { arabic: "يَجْعَلُونَ أَصَابِعَهُمْ", trans: "Yaj-'aloon (Minor Qalqala on Jeem)" }
            ]
          }
        ],
        quiz: [
          {
            question: "Which phrase combines all 5 Qalqala letters?",
            options: ["يَرْمَلُونَ", "قُطْبُ جَدٍ", "خُصَّ ضَغْطٍ", "أَبْجَدْ"],
            correctAnswer: 1,
            explanation: "The letters of Qalqala are summarized in the phrase Qutbu Jaddin (ق ط ب ج د)."
          },
          {
            question: "When is Qalqala performed?",
            options: ["When the letter has Fatha", "When the letter has Sukoon or when stopping on it", "When the letter has Kasra", "Always"],
            correctAnswer: 1,
            explanation: "Qalqala only triggers when a Qalqala letter is silent (Sukoon) or stopped upon."
          },
          {
            question: "What is the difference between Qalqala Sughra and Qalqala Kubra?",
            options: ["Sughra is at start, Kubra in middle", "Sughra is in middle of word, Kubra is at end upon stopping", "Kubra is silent", "Sughra is 6 counts"],
            correctAnswer: 1,
            explanation: "Sughra is minor (in middle of word), while Kubra is stronger (when stopping at verse end)."
          },
          {
            question: "In Surah Al-Ikhlas (قُلْ هُوَ اللَّهُ أَحَدٌ), what rule applies to (أَحَدٌ) when stopping?",
            options: ["Idgham", "Qalqala Kubra on Dal", "Ikhfa", "Madd Muttasil"],
            correctAnswer: 1,
            explanation: "Stopping on Dal creates a strong echoing Qalqala Kubra sound."
          }
        ]
      },
      {
        id: "mod-2-5",
        title: "Rules of Stopping (Waqf & Signs)",
        description: "Understand Quranic punctuation symbols (مـ , قلى , صلى , ج , لا) to stop and pause correctly.",
        estimatedMinutes: 14,
        category: "Tajweed",
        slides: [
          {
            title: "Essential Waqf Signs in the Mus-haf",
            content: "Stopping signs guide reciters on where to pause without breaking verse meaning:",
            bullets: [
              "مـ (Waqf Lazim): Compulsory stop — changing meaning if continued.",
              "قلى (Waqf al-Awla): Better to stop here.",
              "صلى (Al-Wasl al-Awla): Better to continue without stopping.",
              "ج (Waqf Ja'iz): Permissible to stop or continue.",
              "لا (Waqf Mamnoo'): Forbidden to stop — distorts meaning."
            ]
          }
        ],
        quiz: [
          {
            question: "What does the symbol (مـ) indicate in Tajweed?",
            options: ["Optional pause", "Compulsory stop (Waqf Lazim)", "Must continue", "End of Juz"],
            correctAnswer: 1,
            explanation: "Meem (مـ) indicates a compulsory stop where continuing could alter meaning."
          },
          {
            question: "What does the symbol (لا) signify?",
            options: ["Do not stop (Waqf Mamnoo')", "Stop immediately", "Repeat verse", "Prostrated Ayah"],
            correctAnswer: 0,
            explanation: "Laa (لا) means do not stop here as it breaks the sentence incomplete."
          },
          {
            question: "Which symbol means 'Better to stop'?",
            options: ["صلى", "قلى", "لا", "ج"],
            correctAnswer: 1,
            explanation: "Qala (قلى) stands for 'Al-Waqfu Awla' (Stopping is preferred)."
          },
          {
            question: "Which symbol means 'Better to continue'?",
            options: ["صلى", "قلى", "مـ", "لا"],
            correctAnswer: 0,
            explanation: "Sala (صلى) stands for 'Al-Waslu Awla' (Continuing is preferred)."
          }
        ]
      },
      {
        id: "mod-2-6",
        title: "Rules of Ra (Tafkheem & Tarqeeq of Ra)",
        description: "Learn when the letter Ra (ر) is recited heavy (full mouth) versus light (thin mouth).",
        estimatedMinutes: 15,
        category: "Tajweed",
        slides: [
          {
            title: "Heavy Ra (Tafkheem) vs. Light Ra (Tarqeeq)",
            content: "The letter Ra (ر) alternates between heavy and light pronunciation depending on its vowels and context:",
            bullets: [
              "Heavy Ra (Tafkheem): When Ra carries a Fatha ( رَ ) or Damma ( رُ ) (e.g. رَحْمَةٌ Rahmah, رُزِقْنَا Ruziqna).",
              "Light Ra (Tarqeeq): When Ra carries a Kasra ( رِ ) (e.g. رِزْقًا Rizqan)."
            ],
            examples: [
              { arabic: "رَحْمَةٌ", trans: "Rahmah (Heavy Ra - Fatha)" },
              { arabic: "رِزْقًا", trans: "Rizqan (Light Ra - Kasra)" },
              { arabic: "الْقَادِرُ", trans: "Al-Qadir (Light Ra when stopping with preceding Kasra)" }
            ]
          }
        ],
        quiz: [
          {
            question: "How is Ra (رَ) pronounced when it carries a Fatha?",
            options: ["Light (Tarqeeq)", "Heavy (Tafkheem)", "Silent", "Nasal Ghunnah"],
            correctAnswer: 1,
            explanation: "A Ra with Fatha or Damma is ALWAYS recited heavy with a full voice."
          },
          {
            question: "How is Ra (رِ) pronounced when it carries a Kasra?",
            options: ["Heavy (Tafkheem)", "Light (Tarqeeq)", "Echoing Qalqala", "Doubled"],
            correctAnswer: 1,
            explanation: "Kasra makes the letter Ra light and thin in pronunciation."
          },
          {
            question: "In the word (رُزِقْنَا), how is Ra pronounced?",
            options: ["Light", "Heavy (Tafkheem due to Damma)", "Silent", "Soft"],
            correctAnswer: 1,
            explanation: "Because Ra carries Damma ( ُ ), it is pronounced heavy."
          },
          {
            question: "In the word (رِزْقًا), why is Ra pronounced light?",
            options: ["Because it has Fatha", "Because it carries Kasra ( ِ )", "Because it is at the end", "Because of Shaddah"],
            correctAnswer: 1,
            explanation: "Kasra under the letter Ra triggers light (Tarqeeq) pronunciation."
          }
        ]
      }
    ]
  },

  {
    id: "level-3",
    levelNumber: 3,
    title: "High-Frequency Quranic Vocabulary",
    subtitle: "Learn the 80% most frequent words, verbs, names of Allah, numbers, and prepositions in the Quran",
    badge: "Advanced",
    color: "from-amber-500 to-orange-600",
    icon: "💡",
    modules: [
      {
        id: "mod-3-1",
        title: "Top Quranic Nouns & Pronouns",
        description: "Key words that appear hundreds of times in almost every Surah.",
        estimatedMinutes: 20,
        category: "Vocabulary",
        slides: [
          {
            title: "Most Frequent Quranic Nouns",
            content: "Mastering these core words unlocks immediate comprehension of vast portions of verses:",
            gridItems: [
              { arabic: "اللَّه", name: "Allah", trans: "God / Almighty God", tip: "2,699 occurrences" },
              { arabic: "رَبّ", name: "Rabb", trans: "Lord / Sustainer", tip: "970+ occurrences" },
              { arabic: "أَرْض", name: "Ard", trans: "Earth / Land", tip: "460+ occurrences" },
              { arabic: "سَمَاء", name: "Samaa", trans: "Sky / Heaven", tip: "310+ occurrences" },
              { arabic: "يَوْم", name: "Yawm", trans: "Day", tip: "400+ occurrences" },
              { arabic: "قَلْب", name: "Qalb", trans: "Heart", tip: "160+ occurrences" },
              { arabic: "عَلِيم", name: "Aleem", trans: "All-Knowing", tip: "Attribute of Allah" },
              { arabic: "رَحِيم", name: "Raheem", trans: "Most Merciful", tip: "Attribute of Allah" }
            ]
          },
          {
            title: "Personal Pronouns (Detached)",
            content: "Arabic pronouns are essential for identifying who is performing an action:",
            bullets: [
              "هُوَ (Huwa): He (Occurs 480+ times)",
              "هِيَ (Hiya): She (Occurs 60+ times)",
              "هُمْ (Hum): They (Occurs 440+ times)",
              "أَنْتَ (Anta): You (singular male) (Occurs 80+ times)",
              "أَنَا (Ana): I (Occurs 68 times)",
              "نَحْنُ (Nahnu): We (Occurs 86 times)"
            ]
          }
        ],
        quiz: [
          {
            question: "What does the Quranic word 'Rabb' (رَبّ) mean?",
            options: ["Sky", "Lord / Sustainer", "Heart", "Book"],
            correctAnswer: 1,
            explanation: "Rabb means Lord, Owner, and Cherisher who sustains creation."
          },
          {
            question: "What does the pronoun 'هُوَ' (Huwa) mean?",
            options: ["We", "They", "He", "I"],
            correctAnswer: 2,
            explanation: "'Huwa' is the masculine singular pronoun meaning 'He'."
          },
          {
            question: "Which word means 'Earth' or 'Land' in Arabic?",
            options: ["سَمَاء", "أَرْض", "يَوْم", "قَلْب"],
            correctAnswer: 1,
            explanation: "'Ard' (أَرْض) means Earth or land and appears over 460 times."
          },
          {
            question: "What does 'نَحْنُ' (Nahnu) mean?",
            options: ["I", "You", "We", "They"],
            correctAnswer: 2,
            explanation: "'Nahnu' is the first-person plural pronoun meaning 'We'."
          }
        ]
      },
      {
        id: "mod-3-2",
        title: "Frequently Used Quranic Verbs",
        description: "Master the top verbs that drive narrative and commands in the Holy Quran.",
        estimatedMinutes: 22,
        category: "Vocabulary",
        slides: [
          {
            title: "Top 8 High-Frequency Verbs",
            content: "These verbs form the core of Quranic stories, laws, and prayers:",
            gridItems: [
              { arabic: "قَالَ", name: "Qala", trans: "He said", tip: "520+ occurrences" },
              { arabic: "كَانَ", name: "Kaana", trans: "He was / Is", tip: "1350+ occurrences" },
              { arabic: "آمَنَ", name: "Aamana", trans: "He believed", tip: "530+ occurrences" },
              { arabic: "جَعَلَ", name: "Ja'ala", trans: "He made / appointed", tip: "340+ occurrences" },
              { arabic: "عَلِمَ", name: "'Alima", trans: "He knew", tip: "380+ occurrences" },
              { arabic: "عَمِلَ", name: "'Amila", trans: "He did / worked", tip: "360+ occurrences" },
              { arabic: "جَاءَ", name: "Jaa'a", trans: "He came", tip: "270+ occurrences" },
              { arabic: "دَعَا", name: "Da'aa", trans: "He called / prayed", tip: "170+ occurrences" }
            ]
          }
        ],
        quiz: [
          {
            question: "What is the meaning of the verb 'قَالَ' (Qala)?",
            options: ["He created", "He said", "He entered", "He listened"],
            correctAnswer: 1,
            explanation: "'Qala' means 'He said' and appears over 520 times in the Quran."
          },
          {
            question: "What does 'آمَنَ' (Aamana) mean?",
            options: ["He disbelieved", "He believed", "He wrote", "He returned"],
            correctAnswer: 1,
            explanation: "'Aamana' means 'He believed' (root A-M-N)."
          },
          {
            question: "Which verb means 'He knew' in Arabic?",
            options: ["عَلِمَ ('Alima)", "عَمِلَ ('Amila)", "جَعَلَ (Ja'ala)", "دَعَا (Da'aa)"],
            correctAnswer: 0,
            explanation: "'Alima (عَلِمَ) means 'He knew'."
          },
          {
            question: "What does 'كَانَ' (Kaana) translate to?",
            options: ["He will be", "He was / is", "He left", "He spoke"],
            correctAnswer: 1,
            explanation: "'Kaana' is the past verb meaning 'He was' or 'He is'."
          }
        ]
      },
      {
        id: "mod-3-3",
        title: "Essential Prepositions & Connectors",
        description: "Learn particles (Huroof) that connect words and create sentence relationships.",
        estimatedMinutes: 15,
        category: "Vocabulary",
        slides: [
          {
            title: "Core Quranic Prepositions (Huroof al-Jarr)",
            content: "Prepositions link nouns and give them a Kasra ending:",
            gridItems: [
              { arabic: "مِنْ", name: "Min", trans: "From / Of", tip: "3,000+ occurrences" },
              { arabic: "إِلَى", name: "Ila", trans: "To / Towards", tip: "740+ occurrences" },
              { arabic: "عَنْ", name: " 'An", trans: "About / From", tip: "400+ occurrences" },
              { arabic: "عَلَى", name: " 'Ala", trans: "Upon / On", tip: "1,400+ occurrences" },
              { arabic: "فِي", name: "Fee", trans: "In / Inside", tip: "1,700+ occurrences" },
              { arabic: "بِـ", name: "Bi", trans: "With / By / In", tip: "500+ occurrences" },
              { arabic: "لِـ", name: "Li", trans: "For / To / Belonging to", tip: "1,300+ occurrences" },
              { arabic: "إِنَّ", name: "Inna", trans: "Indeed / Verily", tip: "1,500+ occurrences" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does the preposition 'فِي' (Fee) mean?",
            options: ["From", "In / Inside", "Upon", "To"],
            correctAnswer: 1,
            explanation: "'Fee' means 'in' or 'inside'."
          },
          {
            question: "What does 'إِنَّ' (Inna) signify at the start of a sentence?",
            options: ["If", "Indeed / Verily (Emphasis)", "Maybe", "No"],
            correctAnswer: 1,
            explanation: "'Inna' is a particle of particle emphasis meaning 'Indeed' or 'Verily'."
          },
          {
            question: "What does the preposition 'عَلَى' ('Ala) mean?",
            options: ["Under", "Upon / On", "From", "Behind"],
            correctAnswer: 1,
            explanation: "'Ala means 'upon' or 'on top of'."
          },
          {
            question: "Which preposition means 'From'?",
            options: ["مِنْ (Min)", "إِلَى (Ila)", "فِي (Fee)", "عَلَى ('Ala)"],
            correctAnswer: 0,
            explanation: "Min (مِنْ) means 'from'."
          }
        ]
      },
      {
        id: "mod-3-4",
        title: "Names & Attributes of Allah (Asma-ul-Husna)",
        description: "Learn the high-frequency Divine Names that appear at the end of Quranic verses.",
        estimatedMinutes: 18,
        category: "Vocabulary",
        slides: [
          {
            title: "Divine Attributes at Verse Endings",
            content: "Allah concludes many Ayahs with pairs of Divine Names that reflect the theme of the verse:",
            gridItems: [
              { arabic: "الرَّحْمَٰن", name: "Al-Rahman", trans: "The Most Gracious", tip: "Boundless Mercy" },
              { arabic: "الرَّحِيم", name: "Al-Raheem", trans: "The Most Merciful", tip: "Specific Mercy to believers" },
              { arabic: "الْغَفُور", name: "Al-Ghafoor", trans: "The Oft-Forgiving", tip: "Covers & forgives sins" },
              { arabic: "الْعَلِيم", name: "Al-'Aleem", trans: "The All-Knowing", tip: "Knows seen & unseen" },
              { arabic: "الْحَكِيم", name: "Al-Hakeem", trans: "The All-Wise", tip: "Wisdom in all decrees" },
              { arabic: "الْسَّمِيع", name: "As-Samee'", trans: "The All-Hearing", tip: "Hears all prayers" },
              { arabic: "الْبَصِير", name: "Al-Baseer", trans: "The All-Seeing", tip: "Sees every action" },
              { arabic: "الْعَزِيز", name: "Al-'Azeez", trans: "The Almighty / Mighty", tip: "Invincible Power" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does 'الْغَفُورُ' (Al-Ghafoor) mean?",
            options: ["The Creator", "The Oft-Forgiving", "The Provider", "The Judge"],
            correctAnswer: 1,
            explanation: "Al-Ghafoor means The Oft-Forgiving who covers and forgives sins."
          },
          {
            question: "Which Divine Name means 'The All-Wise'?",
            options: ["الْحَكِيم (Al-Hakeem)", "الْسَّمِيع (As-Samee')", "الْعَزِيز (Al-'Azeez)", "الْقَدِير"],
            correctAnswer: 0,
            explanation: "Al-Hakeem (الْحَكِيم) refers to Allah's perfect wisdom in creation and legislation."
          },
          {
            question: "What does 'الْسَّمِيعُ الْعَلِيمُ' mean when paired together?",
            options: ["The All-Seeing, The Almighty", "The All-Hearing, The All-Knowing", "The Most Merciful, The Creator", "The King, The Holy"],
            correctAnswer: 1,
            explanation: "As-Samee' Al-'Aleem translates to 'The All-Hearing, The All-Knowing'."
          },
          {
            question: "What is the difference between Al-Rahman and Al-Raheem?",
            options: ["No difference", "Al-Rahman is general mercy for all creation; Al-Raheem is specific mercy for believers", "Al-Rahman is for angels", "Al-Raheem means power"],
            correctAnswer: 1,
            explanation: "Al-Rahman describes Allah's all-encompassing mercy in nature, while Al-Raheem denotes His special mercy."
          }
        ]
      },
      {
        id: "mod-3-5",
        title: "Quranic Numbers, Time & Days",
        description: "Learn numbers, time periods, and calendar terms frequently mentioned in Quranic oaths and laws.",
        estimatedMinutes: 15,
        category: "Vocabulary",
        slides: [
          {
            title: "Numbers & Time Concepts in Quran",
            content: "Numbers and time markers structure Quranic legal rulings and historical narratives:",
            gridItems: [
              { arabic: "وَاحِد", name: "Wahid", trans: "One", tip: "Monotheism" },
              { arabic: "اثْنَان", name: "Ithnan", trans: "Two", tip: "Pairs" },
              { arabic: "ثَلَاثَة", name: "Thalatha", trans: "Three", tip: "Witnesses / Period" },
              { arabic: "أَرْبَعَة", name: "Arba'a", trans: "Four", tip: "Months / Witnesses" },
              { arabic: "سَبْع", name: "Sab'", trans: "Seven", tip: "7 Heavens" },
              { arabic: "أَلْف", name: "Alf", trans: "Thousand", tip: "Laylatul Qadr" },
              { arabic: "يَوْم", name: "Yawm", trans: "Day", tip: "Yawm al-Qiyamah" },
              { arabic: "لَيْل", name: "Layl", trans: "Night", tip: "Surah Al-Layl" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does the Quranic word 'أَلْف' (Alf) mean?",
            options: ["Hundred", "Thousand", "Million", "Ten"],
            correctAnswer: 1,
            explanation: "'Alf' means thousand, as in 'Khayrum min Alfi Shahr' (Better than a thousand months)."
          },
          {
            question: "What number does 'سَبْع' (Sab') refer to?",
            options: ["Five", "Seven", "Ten", "Three"],
            correctAnswer: 1,
            explanation: "'Sab'' means seven, frequently mentioned as 'Sab'a Samawat' (Seven Heavens)."
          },
          {
            question: "What does 'لَيْل' (Layl) translate to?",
            options: ["Morning", "Night", "Sun", "Month"],
            correctAnswer: 1,
            explanation: "'Layl' means Night."
          },
          {
            question: "What does 'وَاحِد' (Wahid) signify in Quranic context?",
            options: ["First", "One / Single God (Tawheed)", "Last", "Many"],
            correctAnswer: 1,
            explanation: "'Wahid' signifies One, used in 'Ilahun Wahid' (One God)."
          }
        ]
      }
    ]
  },

  {
    id: "level-4",
    levelNumber: 4,
    title: "Quranic Grammar & Word Morphology",
    subtitle: "Master Arabic sentence structures, attached pronouns, demonstratives, root words, and patterns",
    badge: "Mastery",
    color: "from-purple-600 to-indigo-700",
    icon: "🎓",
    modules: [
      {
        id: "mod-4-1",
        title: "3 Parts of Arabic Speech (اسم , فعل , حرف)",
        description: "Classify Arabic words into Nouns (Ism), Verbs (Fi'l), and Particles (Harf).",
        estimatedMinutes: 20,
        category: "Grammar",
        slides: [
          {
            title: "Understanding Word Types in Quranic Arabic",
            content: "Every single word in the Quran belongs to one of three categories:",
            bullets: [
              "1. Ism (اسم): Person, place, thing, adjective, pronoun, or idea (e.g. كِتَاب Book). Signs: Alif-Lam (ال), Tanween (ً ٍ ٌ).",
              "2. Fi'l (فِعْل): Action bound by time — Past (Maadi), Present/Future (Mudari'), or Command (Amr) (e.g. خَلَقَ He created).",
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
          },
          {
            question: "Which of the following is a sign of an Ism (Noun)?",
            options: ["Starts with Alif-Lam (ال)", "Ends with Sukoon", "Contains 10 letters", "Cannot be plural"],
            correctAnswer: 0,
            explanation: "Alif-Lam (ال) and Tanween are exclusive markers of an Ism."
          },
          {
            question: "What category does the word 'خَلَقَ' (He created) belong to?",
            options: ["Ism", "Fi'l (Verb)", "Harf", "Madd"],
            correctAnswer: 1,
            explanation: "'Khalaqa' is an action bound by past time, making it a Fi'l."
          },
          {
            question: "What category does 'مِنْ' (From) belong to?",
            options: ["Ism", "Fi'l", "Harf (Particle)", "Ayah"],
            correctAnswer: 2,
            explanation: "'Min' is a connecting particle (Harf)."
          }
        ]
      },
      {
        id: "mod-4-2",
        title: "Nominal vs. Verbal Sentences",
        description: "Learn the two sentence structures: Jumlah Ismiyya (Noun sentence) and Jumlah Fi'liyya (Verb sentence).",
        estimatedMinutes: 22,
        category: "Grammar",
        slides: [
          {
            title: "Sentence Structures in the Quran",
            content: "Arabic has two fundamental sentence types:",
            bullets: [
              "1. Jumlah Ismiyya (Nominal Sentence): Begins with an Ism. Consists of Subject (Mubtada) + Predicate (Khabar). Indicates permanence and stability (e.g., اللَّهُ غَفُورٌ Allah is All-Forgiving).",
              "2. Jumlah Fi'liyya (Verbal Sentence): Begins with a Fi'l. Consists of Verb (Fi'l) + Subject/Doer (Fa'il) + Object (Maf'ool). Indicates action and renewal (e.g., خَلَقَ اللَّهُ السَّمَاوَاتِ God created the heavens)."
            ]
          }
        ],
        quiz: [
          {
            question: "What does a Nominal Sentence (Jumlah Ismiyya) begin with?",
            options: ["Verb", "Noun (Ism)", "Particle", "Number"],
            correctAnswer: 1,
            explanation: "Jumlah Ismiyya always starts with an Ism (Noun)."
          },
          {
            question: "What does a Jumlah Ismiyya communicate rhetorically?",
            options: ["Temporary movement", "Permanence, stability, and timeless truth", "Command", "Question"],
            correctAnswer: 1,
            explanation: "Nominal sentences emphasize continuous, timeless reality."
          },
          {
            question: "In the sentence (خَلَقَ اللَّهُ), what is the role of 'Allah'?",
            options: ["Verb (Fi'l)", "Subject/Doer (Fa'il)", "Particle", "Madd"],
            correctAnswer: 1,
            explanation: "Allah is the Fa'il (Doer of the action 'created')."
          },
          {
            question: "Which of the following is a Jumlah Fi'liyya?",
            options: ["اللَّهُ غَفُورٌ", "قَالَ الْمَلِكُ", "الْحَمْدُ لِلَّهِ", "إِنَّ اللَّهَ مَعَنَا"],
            correctAnswer: 1,
            explanation: "Qala al-Maliku begins with the verb 'Qala' (said)."
          }
        ]
      },
      {
        id: "mod-4-3",
        title: "Understanding Triliteral Root Words",
        description: "Discover how 3-letter roots (e.g. ك-ت-ب) unlock dozens of derived words in the Quran.",
        estimatedMinutes: 25,
        category: "Grammar",
        slides: [
          {
            title: "The Genius of the Arabic Root System",
            content: "Over 85% of Quranic words originate from 3-letter roots. By learning 1 root, you instantly understand 10+ derived words!",
            examples: [
              { arabic: "ك-ت-ب (K-T-B)", trans: "Root meaning: Writing / Prescribing" },
              { arabic: "كَتَبَ", trans: "Kataba = He wrote" },
              { arabic: "كِتَاب", trans: "Kitaab = Book" },
              { arabic: "كَاتِب", trans: "Kaatib = Writer" },
              { arabic: "مَكْتُوب", trans: "Maktoob = Written / Prescribed" }
            ]
          }
        ],
        quiz: [
          {
            question: "What core concept links words derived from the root (ك - ت - ب)?",
            options: ["Peace", "Writing / Prescribing", "Knowledge", "Creation"],
            correctAnswer: 1,
            explanation: "K-T-B pertains to writing, books, and prescribed laws."
          },
          {
            question: "What does the root (س - ل - م) relate to?",
            options: ["War", "Peace, safety, and submission", "Mercy", "Sight"],
            correctAnswer: 1,
            explanation: "S-L-M forms words like Salaam (Peace), Islam (Submission), and Muslim."
          },
          {
            question: "If 'Alima' (عَلِمَ) means 'He knew', what does 'Aleem' (عَلِيم) mean?",
            options: ["Teacher", "All-Knowing", "Student", "Book of knowledge"],
            correctAnswer: 1,
            explanation: "'Aleem' is an intensive form meaning 'All-Knowing'."
          },
          {
            question: "What percentage of Quranic words stem from 3-letter roots?",
            options: ["20%", "50%", "Over 85%", "100%"],
            correctAnswer: 2,
            explanation: "Over 85% of Arabic vocabulary derives from triliteral roots."
          }
        ]
      },
      {
        id: "mod-4-4",
        title: "Attached Pronouns (Dama'ir Muttasilah)",
        description: "Understand suffix pronouns attached to nouns, verbs, and prepositions (e.g. -hu, -ha, -ka, -na).",
        estimatedMinutes: 20,
        category: "Grammar",
        slides: [
          {
            title: "Possessive & Object Suffixes",
            content: "Unlike detached pronouns (Hua, Anta), attached pronouns attach directly to the end of a word:",
            bullets: [
              "ـهُ (-hu): His / Him (e.g., كِتَابُهُ Kitabu-hu = His Book)",
              "ـهَا (-ha): Her / Its (e.g., رَبُّهَا Rabbu-ha = Her Lord)",
              "ـكَ (-ka): Your (sing. male) (e.g., دِينُكَ Deenu-ka = Your religion)",
              "ـنَا (-na): Our / Us (e.g., رَبَّنَا Rabba-na = Our Lord)",
              "ـي (-ee): My / Me (e.g., رَبِّي Rabbi = My Lord)",
              "ـكُمْ (-kum): Your (plural male) (e.g., أَعْمَالُكُمْ A'malu-kum = Your deeds)"
            ]
          }
        ],
        quiz: [
          {
            question: "In the phrase (رَبَّنَا), what does the suffix 'ـنَا' (-na) mean?",
            options: ["His", "Our", "My", "Their"],
            correctAnswer: 1,
            explanation: "'-na' attached to a noun means 'Our' (Rabba-na = Our Lord)."
          },
          {
            question: "What does (كِتَابُكَ) translate to?",
            options: ["My book", "His book", "Your book", "Our book"],
            correctAnswer: 2,
            explanation: "'-ka' attached to Kitab means 'Your book'."
          },
          {
            question: "Which suffix signifies 'His' or 'Him'?",
            options: ["ـهُ (-hu)", "ـهَا (-ha)", "ـنَا (-na)", "ـي (-ee)"],
            correctAnswer: 0,
            explanation: "'-hu' means 'His' or 'Him'."
          },
          {
            question: "What does (إِلَيْهِ) mean when 'Ila' (To) combines with 'ـهِ' (-hu)?",
            options: ["To us", "To Him", "To me", "To you"],
            correctAnswer: 1,
            explanation: "'Ilayhi' means 'To Him'."
          }
        ]
      },
      {
        id: "mod-4-5",
        title: "Demonstratives & Relatives (Ism Ishara & Mawsool)",
        description: "Master pointing words (This/That) and connecting pronouns (Who/Which) in Quranic Arabic.",
        estimatedMinutes: 18,
        category: "Grammar",
        slides: [
          {
            title: "Demonstratives & Relative Words",
            content: "These words appear constantly in Quranic pointers and descriptions:",
            gridItems: [
              { arabic: "هَٰذَا", name: "Haadha", trans: "This (Masculine)", tip: "Near pointer" },
              { arabic: "هَٰذِهِ", name: "Haadhihi", trans: "This (Feminine)", tip: "Near pointer" },
              { arabic: "ذَٰلِكَ", name: "Dhaalika", trans: "That (Masculine)", tip: "Far pointer" },
              { arabic: "تِلْكَ", name: "Tilka", trans: "That (Feminine)", tip: "Far pointer" },
              { arabic: "الَّذِي", name: "Alladhee", trans: "He who / Which", tip: "Relative singular" },
              { arabic: "الَّذِينَ", name: "Alladheena", trans: "Those who", tip: "Relative plural" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does the pointer 'ذَٰلِكَ' (Dhaalika) mean in (ذَٰلِكَ الْكِتَابُ)?",
            options: ["This", "That (far pointer)", "Who", "Here"],
            correctAnswer: 1,
            explanation: "Dhaalika is the masculine far demonstrative meaning 'That'."
          },
          {
            question: "What does 'الَّذِينَ' (Alladheena) mean in (الَّذِينَ آمَنُوا)?",
            options: ["This man", "Those who", "That book", "Where"],
            correctAnswer: 1,
            explanation: "Alladheena is the masculine plural relative pronoun meaning 'Those who'."
          },
          {
            question: "Which word means 'This' (feminine or broken plural)?",
            options: ["هَٰذَا", "هَٰذِهِ (Haadhihi)", "ذَٰلِكَ", "تِلْكَ"],
            correctAnswer: 1,
            explanation: "Haadhihi is the feminine near demonstrative meaning 'This'."
          },
          {
            question: "What does 'الَّذِي' (Alladhee) translate to?",
            options: ["Those who", "He who / The one which", "These", "You"],
            correctAnswer: 1,
            explanation: "Alladhee is the singular masculine relative pronoun meaning 'He who' or 'The one which'."
          }
        ]
      }
    ]
  },

  {
    id: "level-5",
    levelNumber: 5,
    title: "Surah Context & Asbab al-Nuzul",
    subtitle: "Understand revelation history, Makki vs. Madani Surahs, Prophet stories, and Ayatal Kursi",
    badge: "Deep Dive",
    color: "from-rose-500 to-pink-600",
    icon: "🏛️",
    modules: [
      {
        id: "mod-5-1",
        title: "Makki vs. Madani Surahs",
        description: "Learn the core thematic and historical differences between revelations in Makkah and Madinah.",
        estimatedMinutes: 20,
        category: "Tafseer",
        slides: [
          {
            title: "Key Characteristics of Revelations",
            content: "The Quran was revealed over 23 years in two major historical phases:",
            bullets: [
              "Makki Surahs (86 Surahs): Revealed before the Hijrah to Madinah. Focus on Tawheed (Oneness of God), Resurrection, Judgment Day, Paradise/Hell, and short poetic verses (e.g. Surah Al-Ikhlas, Al-Qariah).",
              "Madani Surahs (28 Surahs): Revealed after the Hijrah. Focus on social laws, governance, family affairs, hypocrites, interfaith dialogue, and longer verses (e.g. Surah Al-Baqarah, An-Nisa)."
            ]
          }
        ],
        quiz: [
          {
            question: "What defines a Makki Surah?",
            options: ["Revealed inside the Kaaba only", "Revealed before the Hijrah to Madinah", "Shortest surah only", "Revealed at night"],
            correctAnswer: 1,
            explanation: "Makki Surahs are those revealed prior to the Prophet's migration (Hijrah) to Madinah."
          },
          {
            question: "What is a primary theme of Makki Surahs?",
            options: ["Inheritance laws", "Tawheed (Monotheism) and the Day of Judgment", "Treaties with tribes", "Fasting rules"],
            correctAnswer: 1,
            explanation: "Makki revelations laid the foundation of faith, monotheism, and moral accountability."
          },
          {
            question: "Which Surah is the longest Madani Surah in the Quran?",
            options: ["Surah Al-Fatiha", "Surah Al-Baqarah", "Surah Yaseen", "Surah Al-Mulk"],
            correctAnswer: 1,
            explanation: "Surah Al-Baqarah is the longest Madani Surah containing comprehensive community guidance."
          },
          {
            question: "How many total Surahs are in the Holy Quran?",
            options: ["100", "114 (86 Makki, 28 Madani)", "120", "99"],
            correctAnswer: 1,
            explanation: "The Holy Quran contains 114 Surahs."
          }
        ]
      },
      {
        id: "mod-5-2",
        title: "Virtues & Lessons of Surah Al-Fatiha",
        description: "Explore the 7 off-repeated verses (Sab'an min al-Mathani) that form the essence of the Quran.",
        estimatedMinutes: 18,
        category: "Tafseer",
        slides: [
          {
            title: "Umm al-Kitab (The Mother of the Book)",
            content: "Surah Al-Fatiha is mandatory in every unit of Salah. It summarizes the entire message of the Quran into praise, recognition of sovereignty, and prayer for guidance.",
            examples: [
              { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", trans: "You alone we worship, and You alone we ask for help." },
              { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", trans: "Guide us to the Straight Path." }
            ]
          }
        ],
        quiz: [
          {
            question: "What does 'Sab'an min al-Mathani' refer to?",
            options: ["The 7 heavy letters", "The 7 oft-repeated verses of Surah Al-Fatiha", "7 heavens", "7 days of creation"],
            correctAnswer: 1,
            explanation: "Surah Al-Fatiha is referred to as the 7 oft-repeated verses in Surah Al-Hijr (15:87)."
          },
          {
            question: "What is the central du'a in Surah Al-Fatiha?",
            options: ["Asking for wealth", "Asking for rain", "Asking for guidance to the Straight Path (Sirat al-Mustaqeem)", "Asking for long life"],
            correctAnswer: 2,
            explanation: "'Ihdinas-Sirat al-Mustaqeem' is the ultimate prayer for righteous guidance."
          },
          {
            question: "What title did the Prophet Muhammad (PBUH) give to Surah Al-Fatiha?",
            options: ["Heart of Quran", "Umm al-Kitab (Mother of the Book)", "Light of Night", "Sword of Truth"],
            correctAnswer: 1,
            explanation: "It is called Umm al-Kitab because it contains the summary of all Quranic themes."
          },
          {
            question: "In every Raka'ah of Salah, how many times must Al-Fatiha be recited?",
            options: ["Optional", "At least once per Raka'ah", "Only in Fajr", "Once per day"],
            correctAnswer: 1,
            explanation: "Reciting Al-Fatiha is a obligatory pillar in every Raka'ah of daily prayer."
          }
        ]
      },
      {
        id: "mod-5-3",
        title: "Stories of Prophets in Quran (Qasas al-Anbiya)",
        description: "Understand the lessons, trials, and wisdom behind the stories of Ibrahim, Musa, Isa, and Yusuf (PBUT).",
        estimatedMinutes: 22,
        category: "Tafseer",
        slides: [
          {
            title: "Why Allah Tells Prophetic Stories",
            content: "Prophetic narratives are not mere history; they are timeless lessons for patience, faith, and standing up for truth:",
            bullets: [
              "Prophet Ibrahim (AS): Symbol of pure monotheism (Hanif) and total submission to God.",
              "Prophet Musa (AS): Most mentioned prophet in Quran (136+ times). Story of standing against Pharaoh's tyranny.",
              "Prophet Yusuf (AS): Surah Yusuf is called 'Ahsan al-Qasas' (The Best of Stories) — lessons in patience and forgiveness.",
              "Prophet Isa (AS): Born of the Virgin Maryam (AS), miraculous speeches, and messenger of the Injeel."
            ]
          }
        ],
        quiz: [
          {
            question: "Which Prophet is mentioned by name most frequently in the Quran (136+ times)?",
            options: ["Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Isa (AS)", "Prophet Nuh (AS)"],
            correctAnswer: 1,
            explanation: "Prophet Musa (AS) is mentioned over 136 times across numerous Surahs."
          },
          {
            question: "Which Surah is described in the Quran as 'Ahsan al-Qasas' (The Best of Stories)?",
            options: ["Surah Yaseen", "Surah Yusuf", "Surah Al-Kahf", "Surah Maryam"],
            correctAnswer: 1,
            explanation: "Surah Yusuf (12:3) explicitly titles his life story as Ahsan al-Qasas."
          },
          {
            question: "What title is given to Prophet Ibrahim (AS) in the Quran for his pure monotheism?",
            options: ["Hanif (True Monotheist)", "King", "Poet", "Judge"],
            correctAnswer: 0,
            explanation: "Ibrahim (AS) is repeatedly praised as Hanifan Musliman."
          },
          {
            question: "What is the primary spiritual lesson of Prophetic stories in the Quran?",
            options: ["Fictional entertainment", "Strengthening faith, patience in adversity, and moral guidance", "Geographical mapping", "Ancient dates"],
            correctAnswer: 1,
            explanation: "Allah states these stories solidify the heart of believers and teach moral endurance."
          }
        ]
      },
      {
        id: "mod-5-4",
        title: "Ayatal Kursi & Last Verses of Al-Baqarah",
        description: "Explore the greatest verse in the Quran (2:255) and its divine attributes.",
        estimatedMinutes: 20,
        category: "Tafseer",
        slides: [
          {
            title: "Ayatal Kursi: The Greatest Verse (2:255)",
            content: "Prophet Muhammad (PBUH) named Ayatal Kursi as the greatest verse in the Quran because it contains 10 distinct statements of divine sovereignty:",
            examples: [
              { arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", trans: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence." },
              { arabic: "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", trans: "Neither drowsiness overtakes Him nor sleep." },
              { arabic: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ", trans: "His Kursi extends over the heavens and the earth." }
            ]
          }
        ],
        quiz: [
          {
            question: "Which Ayah is recognized as the greatest verse in the Holy Quran?",
            options: ["Ayatal Kursi (Al-Baqarah 2:255)", "Surah Al-Ikhlas v1", "Surah Al-Fatiha v1", "Surah Yaseen v1"],
            correctAnswer: 0,
            explanation: "Ayatal Kursi (2:255) is affirmed by Authentic Hadiths as the single greatest verse."
          },
          {
            question: "What does 'Al-Hayy Al-Qayyooma' mean?",
            options: ["The Creator, The Builder", "The Ever-Living, The Self-Sustaining", "The Merciful, The Forgiving", "The High, The Mighty"],
            correctAnswer: 1,
            explanation: "Al-Hayy means The Ever-Living; Al-Qayyoom means The Sustainer of all existence."
          },
          {
            question: "Does slumber or sleep ever overtake Allah according to Ayatal Kursi?",
            options: ["Yes, at night", "Neither drowsiness nor sleep overtakes Him", "Only sleep", "Sometimes"],
            correctAnswer: 1,
            explanation: "The verse declares: 'La ta'khuthuhu sinatun wa la nawm' (Neither drowsiness nor sleep overtakes Him)."
          },
          {
            question: "What protection benefit is associated with reciting Ayatal Kursi after compulsory prayers?",
            options: ["Nothing prevents entry to Paradise except death", "Richness", "Flying ability", "Long life"],
            correctAnswer: 0,
            explanation: "The Prophet (PBUH) said whoever recites Ayatal Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death."
          }
        ]
      }
    ]
  },

  {
    id: "level-6",
    levelNumber: 6,
    title: "Memorization & Reflection (Hifz & Tadabbur)",
    subtitle: "Proven techniques for Quran memorization, retention, Rabt, and iconic Rabbana supplications",
    badge: "Mastery",
    color: "from-amber-600 to-yellow-600",
    icon: "🌟",
    modules: [
      {
        id: "mod-6-1",
        title: "Proven Hifz Techniques & Daily Routine",
        description: "Learn structured methods: 3x3 repetition, linking verses (Rabt), and revision strategies (Sabqi & Manzil).",
        estimatedMinutes: 25,
        category: "Hifz",
        slides: [
          {
            title: "The Golden Rules of Quran Memorization",
            content: "Memorization requires consistency over intensity:",
            bullets: [
              "1. Sabaq (New Lesson): Learn a small portion (3-5 lines) with perfect Tajweed first.",
              "2. Sabqi (Recent Revision): Recite the last 5-7 days of memorization daily before starting new lines.",
              "3. Manzil (Old Revision): Maintain a weekly rotation of older Juz to ensure zero forgotten pages.",
              "4. Golden Tip: Recite your new memorized verses in Sunnah and Nafl prayers!"
            ]
          }
        ],
        quiz: [
          {
            question: "What is 'Sabqi' in the traditional Hifz routine?",
            options: ["Brand new lesson", "Revision of recent days (last 5-7 days)", "Revision of old Juz", "Writing verses"],
            correctAnswer: 1,
            explanation: "Sabqi solidifies the memory of recently learned lessons before they fade."
          },
          {
            question: "What is the best practical way to reinforce newly memorized Surahs?",
            options: ["Reciting them in your daily Sunnah/Nafl prayers", "Only listening", "Memorizing 10 pages a day", "Reading translation only"],
            correctAnswer: 0,
            explanation: "Reciting new verses during prayer anchors them firmly into long-term memory."
          },
          {
            question: "Which factor is most vital for successful Hifz?",
            options: ["Speed", "Consistent daily routine & revision", "Memorizing without Tajweed", "Skipping days"],
            correctAnswer: 1,
            explanation: "Consistency and regular revision are far more effective than sporadic high-volume attempts."
          },
          {
            question: "What does 'Manzil' refer to in Quran memorization?",
            options: ["Building a house", "Systematic review of older memorized Juz", "Starting a new Surah", "Reciting fast"],
            correctAnswer: 1,
            explanation: "Manzil is the continuous cycle of reviewing older Juz to maintain complete retention."
          }
        ]
      },
      {
        id: "mod-6-2",
        title: "Art of Quranic Reflection (Tadabbur)",
        description: "How to connect Quranic teachings to your daily life, actions, and heart.",
        estimatedMinutes: 20,
        category: "Tadabbur",
        slides: [
          {
            title: "Moving From Reading to Living the Quran",
            content: "Allah says: 'Do they not reflect upon the Quran, or are there locks upon their hearts?' (Surah Muhammad 47:24).",
            bullets: [
              "1. Pause at Verses of Mercy: Ask Allah for His grace.",
              "2. Pause at Verses of Warning: Seek refuge in Allah.",
              "3. Self-Examination (Muhasaba): Ask: 'How does this Ayah apply to my character and actions today?'"
            ]
          }
        ],
        quiz: [
          {
            question: "What does the term 'Tadabbur' mean?",
            options: ["Reciting at high speed", "Deep reflection & contemplation upon Quranic meaning", "Writing calligraphy", "Counting letters"],
            correctAnswer: 1,
            explanation: "Tadabbur means pondering deeply over the meanings and personal applications of the Quran."
          },
          {
            question: "What did the Prophet (PBUH) do when passing an Ayah of Rahmah (Mercy) during night prayer?",
            options: ["Paused to ask Allah for His Mercy", "Skip it", "Recite faster", "Stop praying"],
            correctAnswer: 0,
            explanation: "The Prophet (PBUH) would actively interact with verses, asking for mercy and refuge when prompted."
          },
          {
            question: "Which Surah explicitly asks: 'Do they not reflect upon the Quran...?'",
            options: ["Surah Muhammad (47:24)", "Surah Al-Fatiha", "Surah Yaseen", "Surah Al-Kahf"],
            correctAnswer: 0,
            explanation: "Surah Muhammad verse 24 highlights the necessity of heartful reflection."
          },
          {
            question: "What is the ultimate goal of reading and learning the Quran?",
            options: ["Trophy", "Transforming character, actions, and drawing closer to Allah", "Bragging", "Speed reading"],
            correctAnswer: 1,
            explanation: "The Quran is sent as guidance to transform human character and draw believers near to God."
          }
        ]
      },
      {
        id: "mod-6-3",
        title: "Iconic Quranic Du'as (Rabbana Prayers)",
        description: "Learn essential supplications directly from the Quran for wisdom, guidance, family, and forgiveness.",
        estimatedMinutes: 22,
        category: "Tadabbur",
        slides: [
          {
            title: "The 40 Rabbana Supplications",
            content: "Du'as stated in the Quran are divine formulas taught by Allah to His Prophets and righteous believers:",
            examples: [
              { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", trans: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire. (2:201)" },
              { arabic: "رَبِّ زِدْنِي عِلْمًا", trans: "My Lord, increase me in knowledge. (20:114)" },
              { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", trans: "Our Lord, grant us from among our wives and offspring comfort to our eyes. (25:74)" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does the famous Du'a (رَبِّ زِدْنِي عِلْمًا) ask Allah for?",
            options: ["Increase in wealth", "Increase in knowledge", "Long life", "Power"],
            correctAnswer: 1,
            explanation: "Rabbi zidni 'ilma translates to 'My Lord, increase me in knowledge' (Surah Taha 20:114)."
          },
          {
            question: "What two realms of goodness are requested in (رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...)?",
            options: ["Goodness in this Dunya and in the Hereafter (Akhirah)", "Goodness in food only", "Goodness in speech only", "Goodness in business"],
            correctAnswer: 0,
            explanation: "This comprehensive prayer asks for ultimate goodness in both worldly life and eternal life."
          },
          {
            question: "Why are Quranic Du'as considered the most powerful supplications?",
            options: ["They are long", "They are Allah's own chosen words taught to His Prophets", "They are poetic only", "They must be recited in chorus"],
            correctAnswer: 1,
            explanation: "Quranic prayers are revealed by Allah, encapsulating perfect sincerity, etiquette, and spiritual impact."
          },
          {
            question: "What does 'قُرَّةَ أَعْيُنٍ' mean in the prayer for family (25:74)?",
            options: ["Comfort / Joy to our eyes", "Large house", "Gold", "Strength"],
            correctAnswer: 0,
            explanation: "Qurrata A'yun means a source of deep joy, comfort, and peace to one's eyes."
          }
        ]
      }
    ]
  },

  {
    id: "level-7",
    levelNumber: 7,
    title: "Advanced Qira'at & Variant Recitations",
    subtitle: "Study the 10 authentic Recitations (القراءات العشر), transmission chains (Isnad), and reciters",
    badge: "Expert Qira'at",
    color: "from-sky-600 to-indigo-800",
    icon: "🎙️",
    modules: [
      {
        id: "mod-7-1",
        title: "The 10 Authentic Qira'at & Transmission",
        description: "Understand the origin of the 10 mutawatir Qira'at, their canonical reciters, and dialectal nuances.",
        estimatedMinutes: 25,
        category: "Qira'at",
        slides: [
          {
            title: "Introduction to Qira'at al-Ashr",
            content: "The Quran was revealed in 7 Ahruf (modes), from which 10 authentic schools of recitation (Qira'at) were preserved through unbroken chains of transmission (Isnad) to the Prophet (PBUH):",
            bullets: [
              "1. Nafi' al-Madani (Reciters: Qaloon & Warsh)",
              "2. Ibn Kathir al-Makki (Reciters: Al-Bazzi & Qunbul)",
              "3. Abu 'Amr al-Basri (Reciters: Al-Duri & Al-Susi)",
              "4. Ibn 'Amir al-Shami (Reciters: Hisham & Ibn Dhakwan)",
              "5. 'Asim al-Kufi (Reciters: Shu'bah & Hafs - Most common worldwide today)",
              "6. Hamzah al-Kufi (Reciters: Khalaf & Khallad)",
              "7. Al-Kisa'i al-Kufi (Reciters: Al-Layth & Al-Duri)"
            ]
          }
        ],
        quiz: [
          {
            question: "Which Qira'ah transmission is most widely recited in the Muslim world today?",
            options: ["Warsh 'an Nafi'", "Hafs 'an 'Asim", "Al-Duri 'an Abi 'Amr", "Qaloon"],
            correctAnswer: 1,
            explanation: "Hafs 'an 'Asim is used by over 90% of Muslims worldwide in published Mus-hafs."
          },
          {
            question: "What is an 'Isnad' in Qira'at?",
            options: ["A book of grammar", "An unbroken chain of oral transmission leading back to Prophet Muhammad (PBUH)", "A translation", "A Tajweed symbol"],
            correctAnswer: 1,
            explanation: "Isnad is the certified chain of trustworthy reciters preserving exact Quranic pronunciation."
          },
          {
            question: "How many authentic Mutawatir Qira'at schools are universally accepted?",
            options: ["3 schools", "7 schools", "10 schools", "14 schools"],
            correctAnswer: 2,
            explanation: "There are 10 authentic Mutawatir Qira'at schools."
          },
          {
            question: "Who is the primary reciter paired with Imam Nafi' widely recited in North Africa?",
            options: ["Hafs", "Warsh", "Shu'bah", "Al-Bazzi"],
            correctAnswer: 1,
            explanation: "Warsh 'an Nafi' is widely recited in North and West African nations."
          }
        ]
      },
      {
        id: "mod-7-2",
        title: "Rules of Warsh 'an Nafi' vs. Hafs 'an 'Asim",
        description: "Compare core rules: Naql (Vowel transfer), Imalah (Vowel inclination), and Alif softening.",
        estimatedMinutes: 24,
        category: "Qira'at",
        slides: [
          {
            title: "Distinctive Rules in Warsh Recitation",
            content: "Warsh differs from Hafs in specific phonetic rules that embellish recitation:",
            bullets: [
              "1. Naql (Vowel Transfer): Transferring Hamzah's vowel to the preceding silent letter (e.g., قد افلح -> Qadaflaha).",
              "2. Taghleeth of Lam: Pronouncing Lam heavy when preceded by Sad, Dhad, or Ta with Fatha (e.g., الصَّلاةَ -> Al-Salata with heavy L).",
              "3. Imalah (Inclination): Inclining Fatha towards Kasra in specific word endings (e.g., موسى -> Moosey)."
            ]
          }
        ],
        quiz: [
          {
            question: "What is 'Naql' in Warsh recitation?",
            options: ["Deleting the verse", "Transferring the vowel of a Hamzah to the preceding silent letter", "Stretching Madd for 10 counts", "Whispering"],
            correctAnswer: 1,
            explanation: "Naql moves Hamzah's short vowel onto the silent consonant before it."
          },
          {
            question: "What is 'Imalah'?",
            options: ["Pronouncing Fatha slightly inclined towards a Kasra sound", "Doubling letters", "Stopping mid-word", "Heavy Qaf"],
            correctAnswer: 0,
            explanation: "Imalah leans the Fatha vowel towards Kasra (producing an 'ey' sound)."
          },
          {
            question: "When does Warsh pronounce the letter Lam (ل) heavy (Taghleeth)?",
            options: ["Always", "When preceded by Sad, Dhad, or Ta with Fatha/Sukoon", "Never", "Only at verse end"],
            correctAnswer: 1,
            explanation: "Warsh makes Lam heavy after heavy letters Sad, Dhad, or Ta under specific vowel conditions."
          },
          {
            question: "Are differences in Qira'at contradictory in meaning?",
            options: ["Yes, completely", "No, they complement each other and reveal deeper layers of divine meaning", "They are errors", "Only 1 is correct"],
            correctAnswer: 1,
            explanation: "All 10 Qira'at are divine revelations that enrich and complement Quranic meanings without contradiction."
          }
        ]
      },
      {
        id: "mod-7-3",
        title: "Tariq al-Shatibiyyah & Recitation Science",
        description: "Study Imam Al-Shatibi's famous poem (Hirz al-Amani) and the formal sciences of Qira'at.",
        estimatedMinutes: 22,
        category: "Qira'at",
        slides: [
          {
            title: "Imam Al-Shatibi & Al-Shatibiyyah",
            content: "Imam Al-Shatibi (538-590 AH) authored 1,173 poetic couplets detailing the rules of the 7 primary reciters, making Qira'at preservation systematic worldwide."
          }
        ],
        quiz: [
          {
            question: "Who authored the famous Qira'at poem 'Hirz al-Amani' (Al-Shatibiyyah)?",
            options: ["Imam Al-Shatibi", "Imam Al-Ghazali", "Imam Ibn Kathir", "Imam Al-Bukhari"],
            correctAnswer: 0,
            explanation: "Imam Al-Shatibi authored Al-Shatibiyyah, a masterwork of 1,173 mnemonic poetry lines."
          },
          {
            question: "Why was Qira'at written in poetry form by classical scholars?",
            options: ["For singing", "To enable foolproof memorization and preservation across generations", "For competition", "To hide meanings"],
            correctAnswer: 1,
            explanation: "Poetic meters allowed scholars and students to memorize complex reciter rules flawlessly."
          },
          {
            question: "What does 'Tariq' mean in Qira'at terminology?",
            options: ["A road / sub-transmission line from a reciter's student", "A type of Madd", "A verse number", "A city"],
            correctAnswer: 0,
            explanation: "Tariq refers to the specific sub-branch or narrator transmission path (e.g. Tariq al-Shatibiyyah)."
          },
          {
            question: "What condition must a Qira'ah meet to be authentic (Sahih)?",
            options: ["Authentic Isnad, matching Uthmani script, and correct Arabic grammar", "Written in modern print", "Recited by 1 person", "Shortest length"],
            correctAnswer: 0,
            explanation: "A Qira'ah must satisfy 3 pillars: Authentic Isnad, conformity to Uthmani Mushaf, and Arabic grammar."
          }
        ]
      }
    ]
  },

  {
    id: "level-8",
    levelNumber: 8,
    title: "Advanced Quranic Rhetoric & Eloquence",
    subtitle: "Master Balagha (البلاغة): Metaphors, word placement (Taqdeem), and structural inimitability (I'jaz)",
    badge: "Rhetorical Mastery",
    color: "from-rose-600 to-purple-900",
    icon: "✨",
    modules: [
      {
        id: "mod-8-1",
        title: "Ilm al-Bayan: Quranic Metaphors & Similes",
        description: "Analyze how the Quran uses vivid imagery (Tashbeeh, Majaz, and Isti'arah) to convey spiritual realities.",
        estimatedMinutes: 26,
        category: "Rhetoric",
        slides: [
          {
            title: "The Art of Imagery in the Quran",
            content: "Ilm al-Bayan explores how concepts are expressed through allegories and metaphors:",
            bullets: [
              "Tashbeeh (Simile): Comparing two things using 'like' or 'as' (e.g., 'His deeds are like a mirage in a desert' 24:39).",
              "Isti'arah (Metaphor): Borrowing a word's physical trait for spiritual reality (e.g., 'Bringing them out from darknesses into light' 2:257).",
              "Majaz (Figurative Expression): Words used outside literal meaning for rhetorical power."
            ],
            examples: [
              { arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", trans: "Allah is the Light of the heavens and the earth (Ayah al-Noor 24:35)" },
              { arabic: "مَثَلُ الَّذِينَ كَفَرُوا بِرَبِّهِمْ أَعْمَالُهُمْ كَرَمَادٍ", trans: "The deeds of those who disbelieve are like ashes blown by wind on a stormy day (14:18)" }
            ]
          }
        ],
        quiz: [
          {
            question: "What does 'Isti'arah' mean in Quranic rhetoric (Balagha)?",
            options: ["Literal description", "Metaphor (borrowing imagery like 'light' for guidance)", "Grammar rule", "Rhyme scheme"],
            correctAnswer: 1,
            explanation: "Isti'arah is a metaphor that borrows physical concepts (like Light/Darkness) for spiritual truths."
          },
          {
            question: "In Surah Al-Noor (24:39), what are the deeds of disbelievers compared to?",
            options: ["A garden", "A mirage in a desert (Tashbeeh)", "A mountain", "A river"],
            correctAnswer: 1,
            explanation: "Deeds without faith are likened to a thirsty traveler chasing a mirage."
          },
          {
            question: "What is the purpose of Quranic parables (Amthal)?",
            options: ["To make abstract spiritual realities tangible and memorable to the human mind", "Historical dates", "Poetry practice", "Grammar drills"],
            correctAnswer: 0,
            explanation: "Parables transform high spiritual truths into vivid mental pictures."
          },
          {
            question: "What branch of Balagha studies metaphors and imagery?",
            options: ["Ilm al-Badi'", "Ilm al-Bayan", "Ilm al-Nahw", "Ilm al-Qira'at"],
            correctAnswer: 1,
            explanation: "Ilm al-Bayan is the science of imagery, similes, and metaphors."
          }
        ]
      },
      {
        id: "mod-8-2",
        title: "Ilm al-Ma'ani: Word Order & Emphasis (Taqdeem)",
        description: "Discover why words are placed early or delayed in an Ayah for exclusivity and emphasis.",
        estimatedMinutes: 24,
        category: "Rhetoric",
        slides: [
          {
            title: "Taqdeem wa Ta'kheer (Fronting & Delaying)",
            content: "In Quranic Arabic, changing standard word order creates profound exclusive meaning (Hasr):",
            examples: [
              { arabic: "إِيَّاكَ نَعْبُدُ", trans: "Standard order: Na'budu-ka (We worship You). Quranic order: Iyyaka Na'budu = YOU ALONE WE WORSHIP (Exclusive restriction to Allah!)." },
              { arabic: "وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ", trans: "And upon Allah ALONE let the believers put their trust." }
            ]
          }
        ],
        quiz: [
          {
            question: "Why does Surah Al-Fatiha say 'Iyyaka Na'budu' instead of 'Na'budu-ka'?",
            options: ["Rhythm only", "To restrict worship EXCLUSIVELY to Allah alone ('You ALONE we worship')", "Standard grammar", "No difference"],
            correctAnswer: 1,
            explanation: "Placing the object 'Iyyaka' first creates grammatical Hasr (exclusivity), ruling out any other deity."
          },
          {
            question: "What is 'Taqdeem' in Ilm al-Ma'ani?",
            options: ["Placing a word earlier in sentence for emphasis or honor", "Deleting a word", "Stretching sound", "Ending verse"],
            correctAnswer: 0,
            explanation: "Taqdeem (fronting) prioritizes crucial words first to capture attention and convey exclusivity."
          },
          {
            question: "When Allah mentions 'Heavens and Earth', why are Heavens almost always mentioned first?",
            options: ["Alphabetical", "Honoring higher realm of angels and divine decrees first", "Random", "Shorter word"],
            correctAnswer: 1,
            explanation: "The Quranic word placement systematically reflects cosmic hierarchy and spiritual honor."
          },
          {
            question: "What science examines sentence structures matching exact situational contexts?",
            options: ["Ilm al-Ma'ani", "Ilm al-Tajweed", "Ilm al-Khat", "Ilm al-Fiqh"],
            correctAnswer: 0,
            explanation: "Ilm al-Ma'ani studies how word choices fit the exact rhetorical need of every verse."
          }
        ]
      },
      {
        id: "mod-8-3",
        title: "Quranic Inimitability (I'jaz al-Quran)",
        description: "Explore the linguistic, structural, scientific, and prophetic perfection of the Quran that remains unchallenged.",
        estimatedMinutes: 28,
        category: "Rhetoric",
        slides: [
          {
            title: "The Multidimensional Miracle (I'jaz)",
            content: "Allah challenged the master poets of Arabia and all humanity to produce even a single Surah like it (Surah Al-Baqarah 2:23). The Quran's I'jaz spans multiple dimensions:",
            bullets: [
              "1. Linguistic Perfection: Neither poetry nor prose, yet possessing unmatched rhythm, precision, and rhetorical power.",
              "2. Historical & Future Accuracy: Precise prophecies (e.g. Roman victory in Surah Al-Rum) and unearthing ancient historical facts.",
              "3. Spiritual Impact: Transforming hearts and establishing justice globally."
            ]
          }
        ],
        quiz: [
          {
            question: "What challenge did Allah issue in the Quran to all of humanity and jinn?",
            options: ["To build a monument", "To produce even a single Surah like it (Surah Al-Baqarah 2:23)", "To write a dictionary", "To memorize 100 books"],
            correctAnswer: 1,
            explanation: "The Quran challenged master Arabic poets to produce a single Surah matching its eloquence, a challenge unanswered for 1400+ years."
          },
          {
            question: "What does 'I'jaz al-Quran' mean?",
            options: ["Difficulty of reading", "The inimitability and miraculous nature of the Quran", "Length of Surahs", "Speed of recitation"],
            correctAnswer: 1,
            explanation: "I'jaz refers to the divine miracle and inimitability of the Holy Quran."
          },
          {
            question: "Is the literary style of the Quran classified as standard poetry (Shi'r)?",
            options: ["Yes, pure poetry", "No, it transcends both traditional poetry and prose into a unique divine category", "Yes, rhymed prose only", "Song lyrics"],
            correctAnswer: 1,
            explanation: "The Quran possesses its own unique structural genre beyond all traditional Arabic poetic meters."
          },
          {
            question: "Which Surah foretold the unexpected comeback victory of the Byzantine Empire (Romans) over Persia within a few years?",
            options: ["Surah Al-Rum (The Romans)", "Surah Al-Fath", "Surah Al-Nasr", "Surah Yaseen"],
            correctAnswer: 0,
            explanation: "Surah Al-Rum (30:2-4) foretold the exact historical victory of the Romans within 3 to 9 years (Bid'i Sineen)."
          }
        ]
      }
    ]
  }
];
