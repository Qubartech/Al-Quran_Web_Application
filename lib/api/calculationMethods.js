/**
 * Comprehensive AlAdhan Calculation Methods List
 * Reference: https://aladhan.com/prayer-times-api
 */
export const CALCULATION_METHODS = [
  { id: 3, name: "Muslim World League (MWL)" },
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 4, name: "Umm al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 0, name: "Shia Ithna-Ashari, Leva Institute, Qum" },
  { id: 7, name: "Institute of Geophysics, University of Tehran" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura, Singapore (MUIS)" },
  { id: 12, name: "Union Organization Islamic de France (UOIF)" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
  { id: 15, name: "Moonsighting Committee Worldwide" },
  { id: 16, name: "Dubai, UAE" },
  { id: 17, name: "Jabatan Kemajuan Islam Malaysia (JAKIM)" },
  { id: 18, name: "Tunisia" },
  { id: 19, name: "Algeria" },
  { id: 20, name: "Kementerian Agama Republik Indonesia (KEMENAG)" },
  { id: 21, name: "Morocco" },
  { id: 22, name: "Comunidade Islamica de Lisboa, Portugal" },
  { id: 23, name: "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan" }
];

export function getMethodName(methodId) {
  const found = CALCULATION_METHODS.find((m) => m.id === methodId);
  return found ? found.name : "Muslim World League (MWL)";
}
