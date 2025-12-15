import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

interface SerpApiSuggestion {
  value: string;
  relevance?: number;
}

interface SerpApiResponse {
  suggestions?: SerpApiSuggestion[];
}

router.get("/autocomplete", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      console.error("SERPAPI_KEY not found in environment variables");
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await axios.get<SerpApiResponse>(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_autocomplete",
          q: query,
          api_key: apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Location autocomplete error:", error);
    
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: error.response?.data || "Failed to fetch suggestions",
      });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
