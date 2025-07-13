const GEMINI_API_KEY = 'AIzaSyBhojJ0wFVlbgnjkNeTU7aMqnETp63rRLI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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