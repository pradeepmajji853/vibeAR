const GEMINI_API_KEY = 'AIzaSyBhojJ0wFVlbgnjkNeTU7aMqnETp63rRLI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface RoomAnalysis {
  colorPalette: string[];
  theme: string;
  dimensions: {
    estimatedSize: string;
    availableSpace: string[];
  };
  lighting: string;
  style: string;
  suggestions: string[];
  furnitureKeywords: string[];
}

export const generateSuggestion = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an interior design expert specializing in furniture recommendations. Given this request: "${prompt}", provide specific, actionable furniture suggestions including colors, materials, and placement ideas. Keep responses concise but helpful, focusing on practical advice for home decor.`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw error;
  }
};

export const generateRoomAnalysis = async (roomDescription: string): Promise<string> => {
  const prompt = `Analyze this room description and provide furniture suggestions: ${roomDescription}. Include specific items, colors, and how they would improve the space aesthetically and functionally.`;
  return generateSuggestion(prompt);
};

export const analyzeRoomWithImage = async (imageBase64: string, description: string): Promise<RoomAnalysis> => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert interior designer analyzing a room image. Provide a detailed analysis in the following structured format:

                ANALYSIS:
                
                COLOR_PALETTE: List the 3-5 main colors you see in the room (walls, furniture, decor). Use common color names like "Warm White", "Navy Blue", "Oak Brown", etc.
                
                THEME: What is the overall design theme? (e.g., Modern, Scandinavian, Industrial, Bohemian, Traditional, Minimalist)
                
                STYLE: What specific style category? (e.g., Contemporary, Mid-Century Modern, Rustic, Urban, Classic)
                
                ESTIMATED_SIZE: What size is this room? (e.g., "Small bedroom 10x12 ft", "Large living room 20x15 ft", "Compact studio")
                
                AVAILABLE_SPACE: List specific areas where furniture could be added (e.g., "Corner near window", "Wall opposite sofa", "Center of room", "Under window")
                
                LIGHTING: Describe the lighting conditions (e.g., "Natural light from large windows", "Warm ambient lighting", "Bright overhead lighting")
                
                IMPROVEMENT_SUGGESTIONS: Provide 3-4 specific, actionable suggestions to improve this space
                
                FURNITURE_KEYWORDS: List 5-8 keywords for finding matching furniture on Sketchfab
                
                Additional context: ${description || 'No additional context provided'}
                
                Please be specific and practical in your analysis. Focus on what you can actually see in the image.`
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64.split(',')[1]
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Parse the structured response
      const analysis = parseGeminiResponse(responseText);
      return analysis;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error analyzing room image:', error);
    // Return a default analysis instead of throwing
    return {
      colorPalette: ["Unable to analyze colors from image"],
      theme: "Unable to determine theme",
      dimensions: {
        estimatedSize: "Unable to estimate room size",
        availableSpace: ["Analysis failed - please try again"]
      },
      lighting: "Unable to analyze lighting",
      style: "Analysis unavailable",
      suggestions: [
        "Image analysis failed. Please try uploading a clearer image.",
        "Ensure the room is well-lit and the image shows the full space.",
        "Try taking the photo from a corner to capture more of the room."
      ],
      furnitureKeywords: ["modern", "furniture", "home", "decor"]
    };
  }
};

const parseGeminiResponse = (responseText: string): RoomAnalysis => {
  try {
    // Extract information using regex patterns
    const colorPaletteMatch = responseText.match(/COLOR_PALETTE[:\s]*(.+?)(?=THEME|$)/s);
    const themeMatch = responseText.match(/THEME[:\s]*(.+?)(?=STYLE|$)/s);
    const styleMatch = responseText.match(/STYLE[:\s]*(.+?)(?=ESTIMATED_SIZE|$)/s);
    const sizeMatch = responseText.match(/ESTIMATED_SIZE[:\s]*(.+?)(?=AVAILABLE_SPACE|$)/s);
    const spaceMatch = responseText.match(/AVAILABLE_SPACE[:\s]*(.+?)(?=LIGHTING|$)/s);
    const lightingMatch = responseText.match(/LIGHTING[:\s]*(.+?)(?=IMPROVEMENT_SUGGESTIONS|$)/s);
    const suggestionsMatch = responseText.match(/IMPROVEMENT_SUGGESTIONS[:\s]*(.+?)(?=FURNITURE_KEYWORDS|$)/s);
    const keywordsMatch = responseText.match(/FURNITURE_KEYWORDS[:\s]*(.+?)$/s);

    // Parse color palette
    const colorPalette = colorPaletteMatch 
      ? colorPaletteMatch[1].trim().split(/[,\n]/).map(c => c.trim()).filter(c => c.length > 0).slice(0, 5)
      : ["Warm White", "Gray", "Brown"];

    // Parse available space
    const availableSpace = spaceMatch
      ? spaceMatch[1].trim().split(/[,\n\-\•]/).map(s => s.trim()).filter(s => s.length > 0)
      : ["Center area", "Near walls"];

    // Parse suggestions
    const suggestions = suggestionsMatch
      ? suggestionsMatch[1].trim().split(/[,\n\-\•]/).map(s => s.trim()).filter(s => s.length > 0)
      : ["Add more lighting", "Consider new furniture", "Improve color coordination"];

    // Parse keywords
    const furnitureKeywords = keywordsMatch
      ? keywordsMatch[1].trim().split(/[,\s]/).map(k => k.trim()).filter(k => k.length > 0)
      : ["modern", "furniture", "chair", "table"];

    return {
      colorPalette,
      theme: themeMatch ? themeMatch[1].trim() : "Modern",
      style: styleMatch ? styleMatch[1].trim() : "Contemporary", 
      dimensions: {
        estimatedSize: sizeMatch ? sizeMatch[1].trim() : "Medium room",
        availableSpace
      },
      lighting: lightingMatch ? lightingMatch[1].trim() : "Mixed lighting",
      suggestions,
      furnitureKeywords
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    // Return fallback data
    return {
      colorPalette: ["White", "Gray", "Brown"],
      theme: "Modern",
      style: "Contemporary",
      dimensions: {
        estimatedSize: "Medium room",
        availableSpace: ["Center area", "Corner spaces"]
      },
      lighting: "Natural lighting",
      suggestions: [
        "Add accent lighting for ambiance",
        "Consider adding plants for freshness", 
        "Use mirrors to make space appear larger"
      ],
      furnitureKeywords: ["modern", "furniture", "chair", "table", "lamp"]
    };
  }
};

export const analyzeRoomImage = async (imageDescription: string): Promise<string> => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert interior designer. Analyze this room image description: "${imageDescription}". 
                
                Provide a detailed analysis including:
                1. Current room style and aesthetic
                2. Lighting conditions and color palette
                3. Space utilization and layout
                4. Specific furniture recommendations with exact items
                5. Color suggestions that would complement the space
                6. Placement suggestions for optimal flow
                
                Format your response in clear sections and be specific about furniture pieces, brands if possible, and exact placement locations.`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error analyzing room image:', error);
    throw error;
  }
};