export interface StandardPerformanceData {
  week: number;
  mortality: number;
  bodyWeight: { min: number; max: number };
  waterConsumption: { min: number; max: number };
  feedIntake: { min: number; max: number };
  cumulativeFeedIntake: { min: number; max: number };
  uniformity: number;
  eggProduction?: { min: number; max: number };
  eggWeight?: { min: number; max: number };
  fcr?: { min: number; max: number };
}

const parseRange = (rangeStr: string): { min: number; max: number } => {
  if (!rangeStr || rangeStr === '') return { min: 0, max: 0 };
  
  const cleanStr = rangeStr.replace(',', '.');
  if (cleanStr.includes('–')) {
    const [min, max] = cleanStr.split('–').map(s => parseFloat(s.trim()));
    return { min: min || 0, max: max || 0 };
  }
  
  const value = parseFloat(cleanStr);
  return { min: value || 0, max: value || 0 };
};

const parseNumber = (numStr: string): number => {
  if (!numStr || numStr === '') return 0;
  return parseFloat(numStr.replace(',', '.')) || 0;
};

export const parseStandardPerformanceCSV = (csvContent: string): StandardPerformanceData[] => {
  const lines = csvContent.split('\n');
  const data: StandardPerformanceData[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    if (columns.length < 12) continue;
    
    const week = parseInt(columns[0]);
    if (isNaN(week)) continue;
    
    const standardData: StandardPerformanceData = {
      week,
      mortality: parseNumber(columns[1]),
      bodyWeight: parseRange(columns[2]),
      waterConsumption: parseRange(columns[3]),
      feedIntake: parseRange(columns[4]),
      cumulativeFeedIntake: parseRange(columns[5]),
      uniformity: parseNumber(columns[6]),
    };
    
    // Add egg production data if available (from week 18+)
    if (columns[7] && columns[7] !== '') {
      standardData.eggProduction = parseRange(columns[7]);
    }
    
    // Add egg weight data if available
    if (columns[11] && columns[11] !== '') {
      standardData.eggWeight = parseRange(columns[11]);
    }
    
    // Calculate FCR from feed intake and egg production (simplified)
    if (standardData.eggProduction && standardData.feedIntake) {
      const avgFeedIntake = (standardData.feedIntake.min + standardData.feedIntake.max) / 2;
      const avgEggProduction = (standardData.eggProduction.min + standardData.eggProduction.max) / 2;
      const avgEggWeight = standardData.eggWeight ? (standardData.eggWeight.min + standardData.eggWeight.max) / 2 : 60;
      
      // FCR = Feed consumed (g) / Egg mass produced (g)
      const eggMassPerDay = (avgEggProduction / 100) * avgEggWeight;
      const fcr = eggMassPerDay > 0 ? avgFeedIntake / eggMassPerDay : 0;
      
      standardData.fcr = { min: fcr * 0.9, max: fcr * 1.1 }; // ±10% range
    }
    
    data.push(standardData);
  }
  
  return data;
};

export const getStandardDataForWeek = (data: StandardPerformanceData[], week: number): StandardPerformanceData | null => {
  return data.find(d => d.week === week) || null;
};

export const getStandardDataForWeekRange = (data: StandardPerformanceData[], startWeek: number, endWeek: number): StandardPerformanceData[] => {
  return data.filter(d => d.week >= startWeek && d.week <= endWeek);
};

// Standard performance data for Hy-Line Max Pro (embedded)
export const HYLINE_MAX_PRO_STANDARD = `UMUR (minggu);KEMATIAN Kumulatif (%);BERAT BADAN (g);KONSUMSI AIR MINUM (ml/ekor/hari);KONSUMSI PAKAN (g/ekor/hari);KUMULATIF KONSUMSI PAKAN (g/ekor);KESERAGAMAN %;% PROD. TELUR Current;TELUR HARIAN Kumulatif;TELUR PER HEN HOUSE Kumulatif;EGG MAS PER HH Kumulatif (kg);BERAT TELUR RATA-RATA (g/telur);;;;
18;0,25;1396–1475;125–172;83–86;581–602;90;6,1–7,7;0,4–0,5;0,4–0,5;;46,5–47,2;;83;–;86
19;0,30;1451–1533;134–184;89–92;1204–1246;90;22,4–27,1;2,0–2,4;2,0–2,4;0,1–0,1;49,3–50,0;;89;–;92
20;0,34;1507–1593;141–196;94–98;1862–1932;90;50,7–57,3;5,5–6,4;5,5–6,4;0,3–0,3;51,6–52,4;;94;–;98
21;0,38;1564–1653;149–206;99–103;2555–2653;90;75,7–80,5;10,8–12,1;10,8–12,1;0,6–0,6;53,5–54,3;;99;–;103
22;0,42;1620–1712;156–214;104–107;3283–3402;90;88,6–90,6;17,0–18,4;17,0–18,4;0,9–1,0;55,0–55,8;;104;–;107
23;0,47;1672–1768;161–222;107–111;4032–4179;90;93,2–94,1;23,6–25,0;23,5–24,9;1,3–1,4;56,4–57,2;;107;–;111
24;0,51;1719–1817;164–226;109–113;4795–4970;90;94,9–95,5;30,2–31,7;30,1–31,6;1,7–1,7;57,5–58,4;;109;–;113
25;0,56;1759–1859;167–230;111–115;5572–5775;90;95,7–96,2;36,9–38,4;36,8–38,3;2,1–2,1;58,4–59,3;;111;–;115
26;0,61;1790–1892;168–232;112–116;6356–6587;85;96,0–96,4;43,6–45,2;43,4–45,0;2,5–2,5;59,2–60,1;;112;–;116
27;0,65;1812–1915;168–232;112–116;7140–7399;85;96,2–96,6;50,4–51,9;50,1–51,7;2,9–2,9;59,9–60,8;;112;–;116
28;0,70;1827–1931;168–232;112–116;7924–8211;85;96,2–96,6;57,1–58,7;56,8–58,4;3,3–3,4;60,4–61,3;;112;–;116
29;0,75;1837–1942;168–232;112–116;8708–9023;85;96,2–96,6;63,8–65,5;63,5–65,1;3,7–3,8;60,9–61,8;;112;–;116
30;0,80;1844–1949;168–232;112–116;9492–9835;85;96,1–96,5;70,5–72,2;70,2–71,8;4,1–4,2;61,3–62,2;;112;–;116`;

export const getHyLineMaxProStandard = (): StandardPerformanceData[] => {
  return parseStandardPerformanceCSV(HYLINE_MAX_PRO_STANDARD);
};