import { GoogleGenAI } from "@google/genai";
import type { Flock, DailyRecord } from '../types';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Variabel lingkungan VITE_GEMINI_API_KEY tidak ditemukan. Fitur AI tidak akan berfungsi.");
}

// Only create AI client if API key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getFarmAnalysisStream = async (
  query: string,
  flock: Flock,
  records: DailyRecord[]
) => {
  if (!apiKey || !ai) {
    // Return a readable stream that yields an error message
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("Error: Kunci API Gemini tidak dikonfigurasi. Silakan tambahkan VITE_GEMINI_API_KEY di file .env.local"));
        controller.close();
      }
    });
  }

  const model = "gemini-2.5-flash";

  const dataContext = `
    Informasi Kawanan:
    - Nama/Kode: ${flock.nameOrCode}
    - Tanggal Masuk: ${flock.entryDate}
    - Populasi Awal: ${flock.initialPopulation}

    Catatan Harian Terbaru (3 hari terakhir):
    ${records.map(r => 
      `- Tanggal: ${r.recordDate}, Kematian: ${r.mortality}, Produksi Telur: ${r.eggProduction}, Pakan (kg): ${r.feedConsumption}, Berat Rata-rata (kg): ${r.averageBodyWeight}`
    ).join('\n')}
  `;

  const systemInstruction = `Anda adalah "AgriMind", asisten AI khusus untuk manajemen peternakan unggas. Analisis Anda harus ringkas, berdasarkan data, dan praktis.
  - Analisis data kawanan yang diberikan untuk menjawab pertanyaan pengguna.
  - Identifikasi potensi masalah (misalnya, masalah kesehatan yang ditunjukkan oleh lonjakan kematian, masalah konversi pakan).
  - Berikan rekomendasi yang dapat ditindaklanjuti.
  - Format respons Anda menggunakan markdown untuk kejelasan (misalnya, poin-poin, teks tebal).
  - Jaga agar respons Anda tetap profesional dan membantu. Jangan sebutkan bahwa Anda adalah model AI. Mulai analisis secara langsung.`;
  
  const fullPrompt = `
  Konteks:
  ${dataContext}

  Pertanyaan Pengguna: "${query}"
  `;

  try {
    const streamResult = await ai.models.generateContentStream({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    // The response from the SDK is an AsyncGenerator. We'll create a ReadableStream
    // that the client can consume, pushing encoded text chunks into it.
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResult) {
          const text = chunk.text;
          if (text) {
             controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    return readableStream;

  } catch (error) {
    console.error("Terjadi kesalahan saat membuat aliran konten:", error);
    // Return a readable stream that yields an error message
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("Terjadi kesalahan saat berkomunikasi dengan asisten AI."));
        controller.close();
      }
    });
  }
};