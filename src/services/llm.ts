
import { SourceItem } from './sources';

export interface HazardAnalysisResult {
    isRelevant: boolean;
    hazardType?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    confidence?: number; // 0-1
    summary?: string;
    suggestedAction?: string;
}

export interface TrendAnalysisResult {
    summary: string;
    trendingKeywords: Array<{ word: string; count: number }>;
    dominantSentiment: 'positive' | 'negative' | 'neutral' | 'panic';
}

export class LLMService {
    private apiKey: string;
    private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async callGemini(prompt: string): Promise<any> {
        if (!this.apiKey) {
            console.warn("API Key missing");
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.2, // Low temperature for more deterministic/factual output
                        response_mime_type: "application/json"
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) return null;

            return JSON.parse(textResponse);
        } catch (error) {
            console.error("LLM Call Failed:", error);
            return null;
        }
    }

    async analyzeHazard(item: SourceItem): Promise<HazardAnalysisResult | null> {
        const prompt = `
      Analyze the following text from a ${item.source} source related to ocean/coastal activity.
      Determine if it describes a legitimate safety hazard (tsunami, high waves, flooding, pollution, etc.).
      Ignore general tourism, weather chit-chat, or unrelated noise.
      
      Text: "${item.content}"
      Location (Context): "${item.location}"
      
      Return JSON format:
      {
        "isRelevant": boolean,
        "hazardType": string (e.g. "Tsunami", "Rip Current", "Pollution", null if not relevant),
        "priority": "low" | "medium" | "high" | "critical" (based on urgency),
        "confidence": number,
        "summary": "Short concise description of the event",
        "suggestedAction": "e.g. Evacuate, Verify, Monitor"
      }
    `;

        return this.callGemini(prompt);
    }

    async analyzeTrends(items: SourceItem[]): Promise<TrendAnalysisResult | null> {
        if (items.length === 0) return null;

        const texts = items.map(i => `- ${i.content}`).join('\n');
        const prompt = `
      Analyze this batch of recent social media/news posts about coastal areas:
      
      ${texts}
      
      Return a JSON summary of the trends:
      {
        "summary": "2-sentence summary of what people are discussing",
        "trendingKeywords": [ {"word": "string", "count": number} ] (top 5 relevant keywords),
        "dominantSentiment": "positive" | "negative" | "neutral" | "panic"
      }
    `;

        return this.callGemini(prompt);
    }
}
