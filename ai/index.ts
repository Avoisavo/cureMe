/**
 * Example usage of AI APIs (OpenAI and Phala Cloud AI / RedPill)
 */

import OpenAI from 'openai';
import { getOpenAIApiKey, getPhalaApiKey, phalaConfig, PhalaModels as PhalaModelsConfig } from './config';

// Re-export for convenience
export { PhalaModelsConfig as GroqModels };

// Initialize OpenAI client (optional - only if API key is set)
let openai: OpenAI | null = null;
const openaiApiKey = getOpenAIApiKey();
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
}

// Initialize Phala Cloud AI (RedPill) client - OpenAI-compatible
const phala = new OpenAI({
  apiKey: getPhalaApiKey(),
  baseURL: phalaConfig.baseURL,
});

/**
 * Example: OpenAI chat completion
 */
export async function chatWithOpenAI(prompt: string, model: string = 'gpt-4'): Promise<string | null> {
  if (!openai) {
    throw new Error('OpenAI API key is not set. Please add OPENAI_API_KEY to your .env file.');
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Example: Phala Cloud AI (RedPill) chat completion with open-source models
 */
export async function chatWithPhala(
  prompt: string, 
  model: string = 'openai/gpt-oss-20b'
) {
  try {
    const completion = await phala.chat.completions.create({
      model: model,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Phala Cloud AI API:', error);
    throw error;
  }
}

// Backward compatibility - keep Groq function name
export const chatWithGroq = chatWithPhala;

/**
 * Chat with Llama models - now uses Phala Cloud AI
 * Note: Phala doesn't have Llama models, using GPT OSS 20B as replacement
 */
export async function chatWithLlama(
  prompt: string,
  model: '8b-instant' | '3.3-70b' = '8b-instant'
) {
  // Use GPT OSS 20B as replacement for Llama models
  return chatWithPhala(prompt, PhalaModelsConfig.openaiOss['20b']);
}

/**
 * Chat with Llama 3.3 70B for more complex tasks
 */
export async function chatWithLlama70B(prompt: string) {
  // Use GPT OSS 120B for larger model
  return chatWithPhala(prompt, PhalaModelsConfig.openaiOss['120b']);
}

/**
 * Clean Qwen response by removing reasoning tags
 */
function cleanQwenResponse(response: string | null): string | null {
  if (!response) return response;
  
  // Remove <think> tags and all their content (handles multiline)
  let cleaned = response
    // Primary pattern: <think>...</think>
    .replace(/<think>[\s\S]*?<\/redacted_reasoning>/gi, '')
    // Also handle other potential reasoning tag formats
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    // Clean up multiple consecutive newlines that might be left after removal
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return cleaned || response; // Return original if cleaned is empty
}

/**
 * Chat with Qwen models via Phala Cloud AI
 * Available models:
 * - '2.5-7b': Qwen 2.5 7B Instruct
 * - '2.5-vl-72b': Qwen 2.5 VL 72B Instruct (multimodal)
 * - '3-vl-235b': Qwen3 VL 235B Instruct (multimodal)
 */
export async function chatWithQwen(
  prompt: string,
  model: '2.5-7b' | '2.5-vl-72b' | '3-vl-235b' = '2.5-7b'
) {
  const modelName = PhalaModelsConfig.qwen[model];
  const response = await chatWithPhala(prompt, modelName);
  return cleanQwenResponse(response);
}

/**
 * Chat with OpenAI OSS models via Phala Cloud AI
 * Available models:
 * - '20b': GPT-OSS 20B model (GPT-4 replacement)
 * - '120b': GPT-OSS 120B model (larger GPT-4 replacement)
 */
export async function chatWithGPTOSS(
  prompt: string,
  model: '20b' | '120b' = '20b'
): Promise<string | null> {
  const modelName = PhalaModelsConfig.openaiOss[model];
  return chatWithPhala(prompt, modelName);
}

/**
 * Multi-model discussion: All models discuss and reach consensus
 */
export async function discussWithAllModels(
  initialPrompt: string
): Promise<{
  initialResponses: Record<string, string>;
  discussion: string;
  finalAnswer: string;
  humanizedAnswer: string;
  duration: number;
}> {
  const startTime = Date.now();

  // Step 1: Get initial responses from 3 models only (GPT, DeepSeek, Qwen)
  console.log('🤖 Step 1: Getting initial responses from GPT, DeepSeek, and Qwen...');
  
  // Get GPT response - use OpenAI if available, otherwise GPT-OSS-20B via Phala
  const getGPTResponse = async (): Promise<string | null> => {
    if (openai) {
      try {
        return await chatWithOpenAI(initialPrompt, 'gpt-4');
      } catch (error: any) {
        console.log('⚠️ OpenAI unavailable, trying GPT-OSS-20B via Phala');
        return await chatWithGPTOSS(initialPrompt, '20b').catch(e => `Error: ${e.message}`);
      }
    } else {
      return await chatWithGPTOSS(initialPrompt, '20b').catch(e => `Error: ${e.message}`);
    }
  };

  // Get all 3 responses in parallel
  const [gptResp, deepseekResp, qwenResp] = await Promise.all([
    getGPTResponse(),
    chatWithPhala(initialPrompt, PhalaModelsConfig.deepseek['chat-v3']).catch(e => `Error: ${e.message}`),
    chatWithQwen(initialPrompt, '2.5-7b').catch(e => `Error: ${e.message}`),
  ]);

  const initialResponses: Record<string, string> = {
    'GPT': gptResp || 'No response',
    'DeepSeek': deepseekResp || 'No response',
    'Qwen': qwenResp || 'No response',
  };

  // Step 2: Create discussion prompt with all responses (regular version)
  let responsesText = '';
  for (const [modelName, response] of Object.entries(initialResponses)) {
    responsesText += `- ${modelName}: "${response}"\n`;
  }

  const discussionPrompt = `You are synthesizing responses from a collaborative discussion between different AI models. Here are the initial responses from each model:

User's Question: "${initialPrompt}"

Initial Responses:
${responsesText}

Please analyze all these responses, identify the best points from each, address any disagreements, and provide a single comprehensive final answer that synthesizes the best insights from all models. Be concise - maximum 100 words. IMPORTANT: End your response with a thoughtful, engaging question related to the topic that encourages the user to continue the conversation.`;

  console.log('💬 Step 2: Models discussing and reaching consensus...');

  // Step 3: Get the regular final answer
  // Use OpenAI GPT-4 for synthesis if available, otherwise GPT-OSS-20B, fallback to GPT-OSS-120B
  const discussion = `Models analyzed each other's responses and discussed key points.`;
  console.log('Using GPT-OSS-20B for fast synthesis');
  const finalAnswer = await chatWithGPTOSS(discussionPrompt, '20b').catch(async (e) => {
    console.log('GPT-OSS-20B failed, trying Qwen fallback');
    return await chatWithQwen(discussionPrompt, '2.5-7b').catch(err => {
      console.error('Error in synthesis:', err);
      return null;
    });
  });

  // Step 4: Generate humanized version - simplified prompt for speed
  console.log('❤️ Step 3: Creating humanized version...');
  const humanizePrompt = `Rewrite this answer in a warm, heartfelt manner using simple words (maximum 100 words, flowing paragraphs, no colons or dashes). IMPORTANT: End with a caring question that invites the user to share more:

"${finalAnswer}"`;

  // Use fast GPT-OSS-20B for humanization
  console.log('Using GPT-OSS-20B for fast humanization');
  let humanizedAnswer = await chatWithGPTOSS(humanizePrompt, '20b').catch(async (e) => {
    console.log('GPT-OSS-20B failed, trying Qwen fallback');
    return await chatWithQwen(humanizePrompt, '2.5-7b').catch(err => {
      console.error('Error in humanization:', err);
      return null;
    });
  });
  
  // Clean up any remaining dashes, colons, model mentions, and fix punctuation/capitalization issues
  if (humanizedAnswer) {
    humanizedAnswer = humanizedAnswer
      // Remove any mentions of AI models or sources
      .replace(/GPT-4|gpt-4|GPT4|gpt4/gi, '')
      .replace(/Llama|llama/gi, '')
      .replace(/Qwen|qwen/gi, '')
      .replace(/OpenAI|openai/gi, '')
      .replace(/suggested by|according to|per (GPT|model|AI)/gi, '')
      .replace(/AI (model|suggests|suggested)|model (suggests|suggested)/gi, '')
      // Remove dashes
      .replace(/--/g, ' ')
      .replace(/—/g, ' ')
      // Remove colons
      .replace(/:/g, '')
      // Fix sentence starts - capitalize first letter of sentences that start with lowercase
      .replace(/(?:^|\.\s+)([a-z])/g, (match, letter) => {
        return match.replace(letter, letter.toUpperCase());
      })
      // Fix awkward sentence starts like "And," "But," "Hey," at the beginning
      .replace(/^(And|But|Hey|So|Well),\s+/gi, (match) => {
        // Keep "And" and "But" if they make sense, but remove casual starts like "Hey,"
        if (match.toLowerCase().includes('hey')) {
          return '';
        }
        return match.charAt(0).toUpperCase() + match.slice(1);
      })
      // Fix multiple example patterns (xxx, xxx, and xxx) - keep only first example
      .replace(/(\w+),\s*(\w+)(?:,\s*and\s*\w+)?/g, (match, first, second) => {
        // Only keep the first example if there's a pattern like "x, y, and z"
        return match.includes(' and ') ? first : match;
      })
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      // Ensure proper spacing after periods
      .replace(/\.([a-zA-Z])/g, '. $1')
      .trim();
  }

  const duration = Date.now() - startTime;

  return {
    initialResponses,
    discussion,
    finalAnswer: finalAnswer || 'Unable to generate final answer',
    humanizedAnswer: humanizedAnswer || 'Unable to generate humanized answer',
    duration,
  };
}

/**
 * Generate two different style responses for first message: rational and emotional
 */
export async function generateFirstMessageResponses(
  initialPrompt: string
): Promise<{
  originalResponse: string;
  rationalResponse: string;
  emotionalResponse: string;
  duration: number;
}> {
  const startTime = Date.now();

  // Generate only the original response (Response 1 and 2 are hardcoded)
  console.log('🚀 Generating original response...');

  // Helper to get fast response
  const getFastResponse = async (prompt: string): Promise<string | null> => {
    try {
      // Try GPT-OSS-20B first (fastest model)
      return await chatWithGPTOSS(prompt, '20b');
    } catch (error: any) {
      console.log('GPT-OSS-20B failed, trying fallback:', error.message);
      // Fallback to Qwen (fast alternative)
      return await chatWithQwen(prompt, '2.5-7b').catch(e => {
        console.error('All models failed:', e.message);
        return null;
      });
    }
  };

  // Original response prompt - direct answer
  const originalPrompt = `Answer the following question clearly and comprehensively in around 100 words. Use flowing paragraphs, not bullet points. Do not use colons (:) or dashes (--, —). Write naturally. IMPORTANT: End your response with a thoughtful, engaging question related to the topic that encourages the user to continue the conversation.

${initialPrompt}`;

  // Generate only the original response
  const originalResponse = await getFastResponse(originalPrompt);

  // Hardcoded Response 1 (Rational) - 100 words or less
  const rationalResponse = `I'll approach this analytically, focusing on facts and structured reasoning. I'll break this down systematically, examining evidence and multiple perspectives to identify logical pathways. This approach helps you make informed decisions and understand underlying patterns. What specific aspects would you like to explore in more depth?`;

  // Hardcoded Response 2 (Emotional) - 100 words or less
  const emotionalResponse = `I hear you, and your feelings matter deeply. Whatever you're experiencing is valid, and you're not alone. I'm here to offer support and understanding, to help you navigate through challenges with compassion and care. Your wellbeing is important. How are you feeling about this right now? What would be most helpful for you to share?`;

  // Clean up original response
  const cleanResponse = (response: string | null): string => {
    if (!response) return 'Unable to generate response';
    return response
      .replace(/GPT-4|gpt-4|GPT4|gpt4/gi, '')
      .replace(/Llama|llama/gi, '')
      .replace(/Qwen|qwen/gi, '')
      .replace(/OpenAI|openai/gi, '')
      .replace(/--/g, ' ')
      .replace(/—/g, ' ')
      .replace(/:/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\.([a-zA-Z])/g, '. $1')
      .trim();
  };

  const duration = Date.now() - startTime;

  return {
    originalResponse: cleanResponse(originalResponse),
    rationalResponse: rationalResponse,
    emotionalResponse: emotionalResponse,
    duration,
  };
}

/**
 * Generate response in a specific style (rational or emotional) with conversation context
 */
export async function generateStyledResponse(
  prompt: string,
  style: 'rational' | 'emotional',
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  // Helper function to get fast response with fallback
  async function getResponseWithFallback(prompt: string): Promise<string | null> {
    // Always use GPT-OSS-20B for speed (fastest model)
    try {
      return await chatWithGPTOSS(prompt, '20b');
    } catch (error: any) {
      // Quick fallback to Qwen (fast alternative)
      return await chatWithQwen(prompt, '2.5-7b').catch(e => {
        console.error('Error generating response:', e);
        return null;
      });
    }
  }

  // Helper function to clean response
  function cleanResponse(response: string | null): string {
    if (!response) return 'Unable to generate response';
    return response
      .replace(/GPT-4|gpt-4|GPT4|gpt4/gi, '')
      .replace(/Llama|llama/gi, '')
      .replace(/Qwen|qwen/gi, '')
      .replace(/OpenAI|openai/gi, '')
      .replace(/--/g, ' ')
      .replace(/—/g, ' ')
      .replace(/:/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\.([a-zA-Z])/g, '. $1')
      .trim();
  }

  // Build context from conversation history if provided
  let contextPrompt = '';
  if (conversationHistory && conversationHistory.length > 0) {
    contextPrompt = 'Previous conversation:\n';
    conversationHistory.forEach(msg => {
      contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
    });
    contextPrompt += '\nCurrent question: ';
  }

  const basePrompt = conversationHistory 
    ? `${contextPrompt}"${prompt}"`
    : `"${prompt}"`;

  if (style === 'rational') {
    const rationalPrompt = `Answer the following question in a clear, analytical, and logical manner. Focus on facts, evidence, and structured reasoning:

${basePrompt}

STYLE GUIDELINES:
- Be analytical and logical - present information systematically
- Focus on facts, evidence, and clear reasoning
- Use structured thinking - break down complex topics into clear components
- Be objective and balanced
- Use clear, precise language
- Organize information logically
- Be concise - maximum 100 words
- Write in essay form with flowing paragraphs
- DO NOT mention any AI models or sources
- DO NOT use colons (:) or dashes (--, —)
- IMPORTANT: End your response with a thoughtful, analytical question that invites further discussion or deeper exploration of the topic

Provide your analytical answer with a question at the end:`;

    const response = await getResponseWithFallback(rationalPrompt);
    return cleanResponse(response);
  } else {
    const emotionalPrompt = `Answer the following question in a warm, empathetic, and emotionally supportive manner. Focus on understanding, validation, and emotional connection:

${basePrompt}

STYLE GUIDELINES:
- Be warm and empathetic - acknowledge feelings and emotions
- Show understanding and validation
- Use supportive, caring language
- Focus on emotional well-being and personal growth
- Be encouraging and hopeful
- Use simple, heartfelt words
- Show genuine care and concern
- Be concise - maximum 100 words
- Write in essay form with flowing paragraphs
- DO NOT mention any AI models or sources
- DO NOT use colons (:) or dashes (--, —)
- Use natural, conversational language
- IMPORTANT: End your response with a caring, open-ended question that invites the user to share more about their feelings, thoughts, or experiences

Provide your warm and supportive answer with a question at the end:`;

    const response = await getResponseWithFallback(emotionalPrompt);
    return cleanResponse(response);
  }
}


