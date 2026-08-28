// Comprehensive dictionary mapping Quran.com translation resource IDs to their official translator / edition name
export const TRANSLATION_NAMES_MAP = {
  "19": "M. Pickthall",
  "20": "Saheeh International",
  "22": "A. Yusuf Ali",
  "23": "Azerbaijani",
  "25": "Muhamed Mehanović",
  "26": "Czech",
  "27": "Frank Bubenheim and Nadeem",
  "29": "Hussein Taji Kal Dari",
  "30": "Finnish",
  "31": "Muhammad Hamidullah",
  "32": "Abubakar Gumi",
  "33": "Indonesian Islamic Affairs Ministry",
  "35": "Ryoichi Mita",
  "36": "Korean",
  "37": "Abdul Hameed and Kunhi",
  "38": "Maranao",
  "39": "Abdullah Muhammad Basmeih",
  "41": "Norwegian",
  "42": "Józef Bielawski",
  "43": "Samir (Portuguese)",
  "44": "Grigore",
  "45": "Elmir Kuliev (Russian)",
  "46": "Mahmud Muhammad Abduh",
  "47": "Albanian",
  "48": "Knut Bernström",
  "49": "Ali Muhsin Al-Barwani",
  "50": "Jan Trust Foundation",
  "51": "King Fahad Quran Complex (Thai)",
  "52": "Elmalili Hamdi Yazir",
  "53": "Tatar",
  "54": "Maulana Muhammad Junagarhi",
  "55": "Muhammad Sodiq Muhammad Yusuf",
  "56": "Ma Jian (Chinese)",
  "57": "Transliteration",
  "74": "Tajik",
  "75": "Alikhan Musayev",
  "76": "Muhammad Saleh",
  "77": "Diyanet Isleri (Turkish)",
  "78": "Ministry of Awqaf, Egypt",
  "79": "Abu Adel",
  "80": "Muhammad Karakunnu & Vanidas Elayavoor",
  "81": "Burhan Muhammad-Amin",
  "83": "Sheikh Isa Garcia",
  "84": "Mufti Taqi Usmani",
  "85": "M.A.S. Abdel Haleem",
  "86": "Office of the President of Maldives",
  "87": "Sadiq and Sani",
  "88": "Hasan Efendi Nahi",
  "89": "Albanian Translation",
  "95": "A. Maududi (Tafhim commentary)",
  "97": "Tafheem e Qur'an - Syed Abu Ali Maududi",
  "101": "Alauddin Mansour",
  "103": "Helmi Nasr",
  "106": "Magomed Magomedov",
  "108": "Ahl Al-Hadith Central Society of Nepal",
  "109": "Muhammad Makin",
  "111": "Ghali Apapur Apaghuna",
  "112": "Shaban Britch",
  "113": "Khalifah Altai",
  "115": "Abubakar Mahmood Jummi",
  "118": "Zakaria Abulsalam",
  "120": "Shaykh Rafeequl Islam Habibur-Rahman",
  "122": "Maulana Azizul Haque al-Umari",
  "124": "Muslim Shahin",
  "125": "Shaykh Abu Rahimah Mikael Aykyuni",
  "126": "Besim Korkut",
  "127": "Muhammad Sodik Muhammad Yusuf",
  "128": "Cambodian Muslim Community Development",
  "131": "Dr. Mustafa Khattab (The Clear Quran)",
  "133": "Abdul Hameed Baqavi",
  "134": "King Fahad Quran Complex",
  "135": "IslamHouse.com",
  "136": "Montada Islamic Foundation",
  "139": "Khawaja Mirof & Khawaja Mir",
  "140": "Montada Islamic Foundation",
  "141": "The Sabiq Company",
  "143": "Muhammad Saleh Bamoki",
  "144": "Sofian S. Siregar",
  "149": "Fadel Soliman (Bridges)",
  "151": "Shaykh al-Hind Mahmud al-Hasan",
  "153": "Hamza Roberto Piccardo",
  "156": "Fe Zilal al-Qur'an",
  "158": "Bayan-ul-Quran",
  "161": "Taisirul Quran",
  "162": "Rawai Al-bayan",
  "163": "Sheikh Mujibur Rahman",
  "199": "Noor International Center",
  "203": "Al-Hilali & Khan",
  "208": "Abu Reda Muhammad ibn Ahmad",
  "209": "Othman al-Sharif",
  "210": "Dar Al-Salam Center",
  "211": "Dar Al-Salam Center",
  "213": "Dr. Abu Bakr Muhammad Zakaria",
  "214": "Dar Al-Salam Center",
  "217": "Dr. Mikhailo Yaqubovic",
  "218": "Saeed Sato",
  "219": "Hamed Choi",
  "220": "Ruwwad Center",
  "221": "Hasan Abdul-Karim",
  "222": "Khalifa Altay",
  "223": "Pioneers of Translation Center",
  "224": "Abdul-Hamid Haidar & Kanhi Muhammad",
  "225": "Rabila Al-Umry",
  "226": "Muhammad Shafi’i Ansari",
  "227": "Maulana Abder-Rahim ibn Muhammad",
  "228": "Ruwwad Center",
  "229": "Sheikh Omar Sharif bin Abdul Salam",
  "230": "Society of Institutes and Universities",
  "231": "Dr. Abdullah Muhammad Abu Bakr and Sheikh Nasir Khamis",
  "232": "African Development Foundation",
  "233": "Dar Al-Salam Center",
  "234": "Fatah Muhammad Jalandhari",
  "235": "Malak Faris Abdalsalaam",
  "236": "Ramdane At Mansour",
  "237": "Tzvetan Theophanov",
  "238": "Taj Mehmood Amroti",
  "771": "Kannada Translation",
  "774": "The Rwanda Muslims Association team",
  "779": "Rashid Maash",
  "782": "Islamic and Cultural League",
  "785": "Mawlawi Muhammad Anwar Badkhashani",
  "795": "Suliman Kanti",
  "796": "Baba Mamady Jani",
  "798": "Abdul Hamid Silika",
  "819": "Maulana Wahiduddin Khan",
  "831": "Abul Ala Maududi (Roman Urdu)",
  "840": "Abu Bakr Ibrahim Ali (Bakurube)",
};

/**
 * Returns the translator name for a given translation ID or object.
 * @param {string|number|object} trans - The resource ID or translation item object
 * @param {number} [fallbackIndex] - Optional fallback 1-based index (e.g. 1, 2, 3)
 * @returns {string} The resolved name (e.g. "Taisirul Quran" or "Dr. Abu Bakr Muhammad Zakaria")
 */
export function getTranslatorName(trans, fallbackIndex = null) {
  if (!trans) {
    return fallbackIndex ? `Translation ${fallbackIndex}` : "Translation";
  }

  // If passed an object
  if (typeof trans === "object") {
    if (trans.name && trans.name.trim() && !trans.name.startsWith("Translation")) {
      return trans.name.trim();
    }
    if (trans.authorName && trans.authorName.trim()) {
      return trans.authorName.trim();
    }
    const id = trans.id || trans.resource_id || trans.identifier;
    if (id && TRANSLATION_NAMES_MAP[String(id)]) {
      return TRANSLATION_NAMES_MAP[String(id)];
    }
  }

  // If passed an ID directly
  const strId = String(trans).trim();
  if (TRANSLATION_NAMES_MAP[strId]) {
    return TRANSLATION_NAMES_MAP[strId];
  }

  return fallbackIndex ? `Translation ${fallbackIndex}` : "Translation";
}

/**
 * Formats a badge label like "TRANSLATION 1: Dr. Abu Bakr Muhammad Zakaria"
 * @param {object|string|number} transItem - The translation item or resource ID
 * @param {number} index - 0-based index of the translation
 * @returns {string} Formatted badge label
 */
export function formatTranslationBadge(transItem, index = 0) {
  const translatorName = getTranslatorName(transItem, index + 1);
  return `TRANSLATION ${index + 1}: ${translatorName}`;
}
