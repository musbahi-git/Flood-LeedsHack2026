const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Choose safest route + explanation using Gemini
 */
async function chooseRouteWithGemini(routes) {
  const safest = routes.reduce((a, b) =>
    a.dangerScore < b.dangerScore ? a : b
  );

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an emergency evacuation assistant.

Routes:
${JSON.stringify(routes, null, 2)}

Explain in 2–3 sentences why route ${safest.id} is safest.
Focus on flood risk, nearby incidents, and distance from danger.
`;

  const result = await model.generateContent(prompt);
  const explanation = result.response.text();

  return {
    chosenRouteId: safest.id,
    explanation,
  };
}

module.exports = { chooseRouteWithGemini };
