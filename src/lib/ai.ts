/**
 * AI Room Analysis using Google Gemini
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
export interface CategoryScore {
  score: number
  feedback: string
}

export interface RoomAnalysis {
  overallScore: number
  lighting: CategoryScore
  cleanliness: CategoryScore
  space: CategoryScore
  ventilation: CategoryScore
  furnishing: CategoryScore
  summary: string
  improvements: string[]
}

/**
 * Convert image file to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1] // Remove data:image/... prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Analyze room image using Gemini AI
 */
export async function analyzeRoomWithAI(imageFile: File): Promise<RoomAnalysis> {
  try {
    console.log('🤖 Analyzing room with Gemini AI...')

    // Convert image to base64
    const base64Image = await fileToBase64(imageFile)

    // Create prompt for Gemini
    const prompt = `You are an expert room quality inspector. Analyze this room image and provide a detailed assessment.

Rate the following aspects on a scale of 0-10:
1. Lighting (natural light, brightness, lamp quality)
2. Cleanliness (tidiness, maintenance, hygiene)
3. Space (room size, organization, storage)
4. Ventilation (windows, air flow, freshness)
5. Furnishing (furniture quality, comfort, aesthetics)

Also provide:
- Overall score (average of all categories)
- Brief summary of the room
- 3-5 specific improvement suggestions

Return ONLY a valid JSON object with this structure (no markdown, no backticks):
{
  "overallScore": 7.5,
  "lighting": {
    "score": 8,
    "feedback": "Good natural light from large windows..."
  },
  "cleanliness": {
    "score": 7,
    "feedback": "Room is generally clean but..."
  },
  "space": {
    "score": 7,
    "feedback": "Adequate space for a single person..."
  },
  "ventilation": {
    "score": 8,
    "feedback": "Good airflow with windows..."
  },
  "furnishing": {
    "score": 7,
    "feedback": "Basic furniture in decent condition..."
  },
  "summary": "A comfortable, well-lit room suitable for...",
  "improvements": [
    "Add more storage solutions",
    "Consider a fresh coat of paint",
    "Improve cable management"
  ]
}`

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Gemini API error:', errorData)
      throw new Error(`Gemini API failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('🤖 Gemini response:', data)

    // Extract text from response
    const text = data.candidates[0].content.parts[0].text

    // Parse JSON (remove markdown code blocks if present)
    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const analysis: RoomAnalysis = JSON.parse(jsonText)

    console.log('✅ AI Analysis complete:', analysis)
    return analysis
  } catch (error) {
    console.error('❌ Error analyzing room:', error)
    throw new Error('Failed to analyze room image')
  }
}