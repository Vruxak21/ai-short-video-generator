const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
     export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Write a script to generate 30 seconds video on topic : Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"imagePrompt\": \"A vast, desolate salt flat stretching under a scorching sun, with a lone figure, a young woman in tattered clothes, pushing a crude wooden cart filled with salt. The scene is rendered in a realistic style, emphasizing the harshness of the landscape and the woman's determination.\",\n    \"ContentText\": \"In the heart of the Sahara, long before modern trade, salt was more precious than gold. This is the story of Amani, a young Berber woman, tasked with carrying the life-sustaining mineral across miles of unforgiving desert.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up, realistic shot of Amani's hands, calloused and scarred, gripping the wooden handle of the cart. The sun beats down on them, highlighting the dust and dryness.\",\n    \"ContentText\": \"Each step was a battle against the heat and the sand.  Her hands, raw and blistered, knew the weight of her family's survival.\"\n  },\n   {\n    \"imagePrompt\": \"A dramatic, realistic rendering of a group of nomadic traders, some on camels, approaching Amani on the salt flat. Their faces are weathered and cautious, their robes flowing in the wind.\",\n    \"ContentText\": \"One day, Amani encountered a group of nomadic traders, their eyes gleaming with interest in her cargo.\"\n  },\n    {\n    \"imagePrompt\": \"A realistic, medium shot depicting the exchange between Amani and the traders. They are bartering with dried dates and cloth. Amani appears wary but determined.\",\n    \"ContentText\": \"Amani, though hesitant, engaged in a tense exchange, carefully weighing the value of her precious salt against the offerings presented.\"\n  },\n   {\n    \"imagePrompt\": \"A realistic, slightly wider shot of Amani returning home, her cart lighter, but her face displaying a mixture of exhaustion and pride, as she arrives at a small, humble village. The setting sun casts long shadows.\",\n    \"ContentText\": \"She returned home, not only with needed provisions but with a newfound respect for her own strength and courage. Her journey, though arduous, had kept her family alive.\"\n  },\n    {\n      \"imagePrompt\": \"A realistic shot of a family gathered around a small fire, sharing food.  Amani is seen helping. The scene conveys warmth and gratitude. Soft focus on Amani, highlighting her strength\",\n      \"ContentText\": \"And so, in the heart of a forgotten land, a young woman's simple act of resilience became a silent, yet powerful, part of history. A reminder of the value of salt, and the strength of the human spirit.\"\n    }\n]\n```\n"},
          ],
        },
      ],
    });
  