const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_INSTRUCTION = `You are an expert career advisor for CAREERSTIDEZ, a global careers and study abroad platform. 
You help users with:
- Career advice and job search strategies
- Resume and interview tips
- Study abroad programs, universities, and scholarships
- Choosing the right career path
- Skills development recommendations
Be concise, helpful, and encouraging. Always relate your advice to global career opportunities and education.`;

exports.getCareerAdvice = async (req, res, next) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Please set GEMINI_API_KEY.' });
    }

    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Build conversation contents
    const contents = [
      // Include chat history
      ...history.map(({ role, text }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text }],
      })),
      // Current user message
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: errData?.error?.message || 'Gemini API error',
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

    res.json({ success: true, data: { reply: text } });
  } catch (error) {
    next(error);
  }
};
