// Basic sentiment analysis without external API for now
const aiService = {
  analyzeReview(text) {
    // Simple word-based sentiment analysis
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'fantastic', 'best', 'love', 'perfect', 'recommend'];
    const negativeWords = ['bad', 'poor', 'terrible', 'horrible', 'worst', 'hate', 'disappointed', 'awful', 'slow', 'expensive'];
    
    const lowercaseText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    // Count sentiment words
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowercaseText.match(regex);
      if (matches) {
        positiveCount += matches.length;
      }
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowercaseText.match(regex);
      if (matches) {
        negativeCount += matches.length;
      }
    });

    // Determine sentiment
    let sentiment;
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    // Extract common topics
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

    return {
      sentiment,
      topics: topics.length > 0 ? topics : ['general']
    };
  }
};

module.exports = aiService;
