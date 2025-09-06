import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, MarketSummary, MarketCoin, GroundingChunk, NewsResponse, NewsArticle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const strategySchema = {
  type: Type.OBJECT,
  properties: {
    strategy: {
      type: Type.STRING,
      description: "The name of the strategy. Should be 'Grid', 'DCA', or 'RSI'.",
      enum: ['Grid', 'DCA', 'RSI'],
    },
    tradingPair: {
      type: Type.STRING,
      description: "The crypto trading pair, e.g., 'BTC/USDT'.",
    },
    investment: {
      type: Type.NUMBER,
      description: "The total investment amount in USDT.",
    },
    gridLevels: {
      type: Type.INTEGER,
      description: "For Grid strategy: the number of buy/sell levels.",
    },
    gridStep: {
      type: Type.NUMBER,
      description: "For Grid strategy: the percentage distance between grid levels.",
    },
    takeProfit: {
      type: Type.NUMBER,
      description: "The percentage at which to take profit.",
    },
    stopLoss: {
      type: Type.NUMBER,
      description: "The percentage at which to stop loss to prevent further losses.",
    },
  },
  required: ["strategy", "tradingPair", "investment"],
};

export const getStrategySuggestion = async (prompt: string): Promise<Partial<BotConfig>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following user description, generate a suitable trading bot configuration. User description: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: strategySchema,
      },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("Empty response from API.");
    }

    const suggestion = JSON.parse(text);
    return suggestion as Partial<BotConfig>;

  } catch (error) {
    console.error("Error fetching strategy suggestion from Gemini:", error);
    throw new Error("Failed to get strategy suggestion. Please check your API key and try again.");
  }
};

export const getMarketSummary = async (): Promise<MarketSummary> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "List the top 3 trending cryptocurrencies. For each, provide its name, symbol, current price in USD, and 24-hour percentage change. Format the output as a valid JSON array of objects with keys 'name', 'symbol', 'price', and 'change24h'.",
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text.trim();
        const apiSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

        // Fix: The GroundingChunk type from the Gemini API has optional `web.uri` and `web.title` properties,
        // but our local GroundingChunk type requires them. This filters out incomplete sources and maps
        // the valid ones to our local type, resolving the type mismatch error.
        const sources: GroundingChunk[] = apiSources
            .filter(source => source.web?.uri && source.web.title)
            .map(source => ({
                web: {
                    uri: source.web.uri!,
                    title: source.web.title!,
                }
            }));

        if (!text) {
            throw new Error("Received an empty response from the market summary API.");
        }

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|(\[[\s\S]*\])/);
        if (!jsonMatch) {
            console.error("Failed to parse market data JSON from response:", text);
            throw new Error("Could not parse market data from the response.");
        }

        const jsonString = jsonMatch[1] || jsonMatch[2];
        const coins: MarketCoin[] = JSON.parse(jsonString);

        return { coins, sources };

    } catch (error) {
        console.error("Error fetching market summary from Gemini:", error);
        throw new Error("Failed to retrieve market summary. The API may be unavailable or the key invalid.");
    }
};

export const getCryptoNews = async (): Promise<NewsResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Fetch the top 5 latest and most important news articles about cryptocurrency. For each article, provide a title, a brief one-sentence summary, the source name (e.g., 'CoinDesk'), and the direct URL to the article. Format the output as a valid JSON array of objects with keys 'title', 'summary', 'source', and 'url'.",
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text.trim();
        const apiSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        const sources: GroundingChunk[] = apiSources
            .filter(source => source.web?.uri && source.web.title)
            .map(source => ({
                web: {
                    uri: source.web.uri!,
                    title: source.web.title!,
                }
            }));
            
        if (!text) {
            throw new Error("Received an empty response from the news API.");
        }

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|(\[[\s\S]*\])/);
        if (!jsonMatch) {
            console.error("Failed to parse news data JSON from response:", text);
            throw new Error("Could not parse news articles from the response.");
        }
        
        const jsonString = jsonMatch[1] || jsonMatch[2];
        const articles: NewsArticle[] = JSON.parse(jsonString);

        return { articles, sources };

    } catch (error) {
        console.error("Error fetching crypto news from Gemini:", error);
        throw new Error("Failed to retrieve crypto news. The API may be unavailable or the key invalid.");
    }
};
