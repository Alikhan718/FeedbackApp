const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aspectMap = {
  restaurant: [
    'food quality',
    'service',
    'atmosphere',
    'cleanliness',
    'price/value'
  ],
  hotel: [
    'room quality',
    'cleanliness',
    'staff/service',
    'location',
    'amenities',
    'overall experience'
  ],
  beauty: [
    'service',
    'cleanliness',
    'staff',
    'results',
    'atmosphere'
  ],
  clinic: [
    'service',
    'staff',
    'results',
    'cleanliness',
    'wait time'
  ]
  // Add more as needed
};

const aiService = {
  async analyzeReview(text, businessType = 'restaurant') {
    try {
      const aspects = aspectMap[businessType.toLowerCase()] || ['overall experience'];
      console.log('AI Review Validation:');
      console.log('  Business Type:', businessType);
      console.log('  Aspects:', aspects);
      console.log('  Review Text:', text);
      const prompt = `You are an AI assistant that validates customer reviews for a ${businessType} business.\n\nReview: "${text}"\n\nRequired aspects for this business type: ${aspects.join(", ")}\n\n1. List which aspects are covered in the review.\n2. List which aspects are missing.\n3. Suggest a polite, personalized message for the client to encourage them to add missing aspects (if any).\n4. Suggest a personalized confirmation message for the client if the review is detailed and covers most aspects.\n\nRespond with a JSON object:\n{\n  "approved": true/false,\n  "covered_aspects": [...],\n  "missing_aspects": [...],\n  "suggestions": "If any aspects are missing, what should the client add?",\n  "confirmation_message": "A personalized thank you/confirmation message for the client.",\n  "reason": "Why approved/rejected",\n  "sentiment": "positive/negative/neutral",\n  "topics": ["topic1", "topic2"]\n}\nOnly respond with the JSON object, no extra text.`;
      console.log('  Prompt sent to OpenAI:', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a review validation AI. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      const response = completion.choices[0].message.content;
      console.log('  Raw OpenAI response:', response);
      const result = JSON.parse(response);
      console.log('  Parsed AI result:', result);

      // Strict approval: must cover all aspects and be at least 50 characters
      const coversAllAspects = Array.isArray(result.covered_aspects) && result.covered_aspects.length === aspects.length && (!result.missing_aspects || result.missing_aspects.length === 0);
      const isLongEnough = text.trim().length >= 50;
      let approved = coversAllAspects && isLongEnough;
      let reason = result.reason;
      let suggestions = result.suggestions;
      if (!isLongEnough) {
        approved = false;
        reason = 'Review is too short. Please provide at least 50 characters.';
        suggestions = 'Please provide more details about your experience.';
      } else if (!coversAllAspects) {
        approved = false;
        reason = 'Review does not cover all required aspects.';
        suggestions = result.suggestions || `Please add more details about: ${result.missing_aspects ? result.missing_aspects.join(', ') : ''}`;
      }

      return {
        approved,
        reason,
        sentiment: result.sentiment,
        topics: result.topics,
        suggestions: suggestions || null,
        covered_aspects: result.covered_aspects || [],
        missing_aspects: result.missing_aspects || [],
        confirmation_message: result.confirmation_message || null
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to basic validation if API fails
      const aspects = aspectMap[businessType.toLowerCase()] || ['overall experience'];
      // Naive aspect detection
      const lowercaseText = text.toLowerCase();
      const covered_aspects = aspects.filter(a => lowercaseText.includes(a.split(' ')[0]));
      const missing_aspects = aspects.filter(a => !covered_aspects.includes(a));
      const isLongEnough = text.trim().length >= 50;
      const coversAllAspects = covered_aspects.length === aspects.length && missing_aspects.length === 0;
      const approved = isLongEnough && coversAllAspects;
      let reason = '';
      let suggestions = '';
      if (!isLongEnough) {
        reason = 'Review is too short. Please provide at least 50 characters.';
        suggestions = 'Please provide more details about your experience.';
      } else if (!coversAllAspects) {
        reason = 'Review does not cover all required aspects.';
        suggestions = missing_aspects.length > 0 ? `Please add more details about: ${missing_aspects.join(', ')}` : null;
      }
      console.log('  [Fallback] Covered aspects:', covered_aspects);
      console.log('  [Fallback] Missing aspects:', missing_aspects);
      console.log('  [Fallback] Approved:', approved);
      return {
        approved,
        reason: reason || 'API unavailable, using basic validation',
        sentiment: this.getBasicSentiment(text),
        topics: this.getBasicTopics(text),
        suggestions: suggestions || null,
        covered_aspects,
        missing_aspects,
        confirmation_message: approved
          ? 'Thank you for your detailed review! We appreciate your feedback.'
          : null
      };
    }
  },

  // Fallback methods for when API is unavailable
  getBasicSentiment(text) {
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'fantastic', 'best', 'love', 'perfect', 'recommend'];
    const negativeWords = ['bad', 'poor', 'terrible', 'horrible', 'worst', 'hate', 'disappointed', 'awful', 'slow', 'expensive'];
    
    const lowercaseText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowercaseText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowercaseText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  },

  getBasicTopics(text) {
    const lowercaseText = text.toLowerCase();
    const topics = [];
    
    const topicKeywords = {
      'food': ['food', 'meal', 'dish', 'taste', 'menu', 'breakfast', 'lunch', 'dinner'],
      'service': ['service', 'staff', 'waiter', 'waitress', 'employee', 'server'],
      'atmosphere': ['atmosphere', 'ambiance', 'decor', 'music', 'environment', 'mood'],
      'price': ['price', 'cost', 'expensive', 'cheap', 'value', 'worth'],
      'cleanliness': ['clean', 'dirty', 'hygiene', 'neat', 'tidy', 'mess'],
    };

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      for (const keyword of keywords) {
        if (lowercaseText.includes(keyword)) {
          topics.push(topic);
          break;
        }
      }
    });

    return topics.length > 0 ? topics : ['general'];
  }
};

module.exports = aiService;
