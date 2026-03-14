import { GoogleGenAI, Type } from "@google/genai";
import { Waypoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async suggestWaypoints(start: string, end: string): Promise<Waypoint[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5-8 interesting waypoints (eateries, photo spots, attractions, rest stops) along the route from ${start} to ${end}. 
      Provide the response in JSON format with name, type (one of: eatery, photo, emergency, rest, attraction), lat, lng, and a brief description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["eatery", "photo", "emergency", "rest", "attraction"] },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              description: { type: Type.STRING }
            },
            required: ["name", "type", "lat", "lng", "description"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse waypoints", e);
      return [];
    }
  },

  async estimateCost(distanceKm: number, days: number, vehicleType: string): Promise<number> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Calculate the estimated total travel cost for a ${distanceKm}km trip over ${days} days using a ${vehicleType}. 
      Consider fuel/transport rates, average meal costs, and miscellaneous fees. 
      Return only the total estimated cost as a number.`,
    });

    const cost = parseFloat(response.text?.replace(/[^0-9.]/g, "") || "0");
    return isNaN(cost) ? 0 : cost;
  }
};
