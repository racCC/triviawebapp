import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a "Did You Know?" fact using OpenAI 
 * Each question gets a UNIQUE AI-generated fact - NO CACHING
 */
export const generateDidYouKnow = async (question) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Cannot generate fact: No OpenAI API key');
    return getFallbackFact(question);
  }

  try {
    console.log('');
    console.log('========== NEW FACT REQUEST ==========');
    console.log('🔄 Generating AI fact for:', question.correct_answer);
    console.log('Question:', question.question);
    
    // Different prompt variations for variety - SELECT ONE RANDOMLY
    const variations = [
      `Generate a surprising and unusual fact about "${question.correct_answer}"`,
      `What is an interesting and lesser-known detail about "${question.correct_answer}"?`,
      `Share a fascinating and unexpected trivia about "${question.correct_answer}"`,
      `Create an educational and intriguing fun fact about "${question.correct_answer}"`,
      `What is a surprising historical or cultural fact about "${question.correct_answer}"?`,
      `Generate an amazing fact about "${question.correct_answer}" that most people don't know`,
      `What is a unique and interesting perspective on "${question.correct_answer}"?`,
      `Tell me something fascinating and uncommon about "${question.correct_answer}"`,
      `What surprising detail about "${question.correct_answer}" would someone not typically know?`,
      `Generate a remarkable trivia fact specific to "${question.correct_answer}"`
    ];
    
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    console.log('📝 Prompt variation:', randomVariation);
    
    const prompt = `${randomVariation}

Context:
- Question: ${question.question}
- Correct Answer: ${question.correct_answer}
- Category: ${question.category || 'General Knowledge'}

Requirements:
1. Generate a UNIQUE and SPECIFIC fact about "${question.correct_answer}"
2. Make it surprising, unexpected, and educational
3. Keep it to 1-2 sentences maximum
4. Include specific details, numbers, dates, or historical context
5. Be creative and avoid generic statements
6. Make sure this fact is DIFFERENT from common knowledge
7. DO NOT repeat facts about other topics

Respond with ONLY this JSON format, no markdown or code blocks:
{"fact": "your unique and specific fact here", "emoji": "relevant emoji", "source_topic": "${question.correct_answer}"}`;

    console.log('📤 Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 1.0,
        top_p: 0.95,
        max_tokens: 200,
        frequency_penalty: 0.5,  // Penalize repetitive content
        presence_penalty: 0.5    // Encourage new topics
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    
    console.log('📥 Raw response:', text);
    
    // Clean up response
    let cleanedText = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();
    
    console.log('🧹 Cleaned response:', cleanedText);
    
    const factData = JSON.parse(cleanedText);
    
    console.log('✅ AI Fact generated:', factData.fact.substring(0, 80) + '...');
    console.log('=====================================');
    console.log('');

    return factData;
  } catch (error) {
    console.log('');
    console.log('⚠️ AI failed, using fallback:', error.message);
    console.log('=====================================');
    console.log('');
    return getFallbackFact(question);
  }
};

/**
 * Quick fallback facts based on category
 */
const getFallbackFact = (question) => {
  const facts = {
    'Science': [
      {
        fact: `${question.correct_answer} is a key component in scientific research. Did you know that many scientific discoveries were made by accident?`,
        emoji: '🔬'
      },
      {
        fact: `${question.correct_answer} plays a crucial role in scientific understanding. Science constantly evolves with new discoveries and innovations.`,
        emoji: '🧪'
      }
    ],
    'History': [
      {
        fact: `${question.correct_answer} was a pivotal moment in history. History reveals how past events shape our present world.`,
        emoji: '📜'
      },
      {
        fact: `${question.correct_answer} played a significant role in historical events. Learning history helps us understand our modern society.`,
        emoji: '🏛️'
      }
    ],
    'Geography': [
      {
        fact: `${question.correct_answer} is one of Earth's remarkable places. Geography shows us the incredible diversity of our planet.`,
        emoji: '🌍'
      },
      {
        fact: `${question.correct_answer} is a fascinating geographical location. Our world contains amazing natural and cultural landmarks.`,
        emoji: '🗺️'
      }
    ],
    'Entertainment': [
      {
        fact: `${question.correct_answer} has made a lasting impact in entertainment. The entertainment industry continues to evolve and inspire.`,
        emoji: '🎬'
      },
      {
        fact: `${question.correct_answer} is a memorable part of entertainment history. Pop culture reflects our society and values.`,
        emoji: '🎭'
      }
    ],
    'Entertainment: Books': [
      {
        fact: `${question.correct_answer} is a memorable character from literature. Great books inspire imagination and creativity.`,
        emoji: '📚'
      },
      {
        fact: `${question.correct_answer} appears in literary works that have influenced readers. Books connect us through stories and ideas.`,
        emoji: '📖'
      }
    ],
    'Sports & Leisure': [
      {
        fact: `${question.correct_answer} is an important part of sports. Sports bring people together and inspire excellence.`,
        emoji: '⚽'
      },
      {
        fact: `${question.correct_answer} plays a role in athletic competition. Sports celebrate human achievement and dedication.`,
        emoji: '🏆'
      }
    ],
    'Art': [
      {
        fact: `${question.correct_answer} represents artistic expression. Art reflects the creativity and culture of society.`,
        emoji: '🎨'
      },
      {
        fact: `${question.correct_answer} is part of the artistic world. Art allows us to explore human creativity and emotion.`,
        emoji: '🖼️'
      }
    ]
  };

  let categoryFacts = facts[question.category];
  
  if (!categoryFacts) {
    const mainCategory = question.category?.split(':')[0]?.trim();
    categoryFacts = facts[mainCategory] || facts['Science'];
  }
  
  // Return a random fallback fact for variety
  const randomFact = categoryFacts[Math.floor(Math.random() * categoryFacts.length)];
  
  return {
    fact: randomFact.fact,
    emoji: randomFact.emoji,
    source_topic: question.correct_answer
  };
};

/**
 * Generate facts for multiple questions
 */
export const generateFactsForQuiz = async (questions) => {
  const facts = [];
  
  for (let i = 0; i < questions.length; i++) {
    const fact = await generateDidYouKnow(questions[i]);
    facts.push({ questionIndex: i, ...fact });
    
    // Small delay to avoid rate limiting
    if (i < questions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return facts;
};

/**
 * Clear the facts cache (not needed anymore - no caching)
 */
export const clearFactsCache = () => {
  console.log('✅ Cache cleared (no cache in use)');
};