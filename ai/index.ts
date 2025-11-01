/**
 * Example usage of AI APIs (OpenAI and Groq)
 */

import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getOpenAIApiKey, getGroqApiKey, GroqModels as GroqModelsConfig } from './config';

// Re-export for convenience
export { GroqModelsConfig as GroqModels };

// Initialize OpenAI client (optional - only if API key is set)
let openai: OpenAI | null = null;
const openaiApiKey = getOpenAIApiKey();
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
}

// Initialize Groq client
const groq = new Groq({
  apiKey: getGroqApiKey(),
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
 * Example: Groq chat completion with open-source models
 */
export async function chatWithGroq(
  prompt: string, 
  model: string = 'llama-3.1-8b-instant'
) {
  try {
    const completion = await groq.chat.completions.create({
      model: model,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

/**
 * Chat with Llama models via Groq
 * Available models:
 * - '8b-instant': Fast, lightweight model (recommended for quick responses)
 * - '3.3-70b': More capable 70B model (recommended for complex tasks)
 */
export async function chatWithLlama(
  prompt: string,
  model: '8b-instant' | '3.3-70b' = '8b-instant'
) {
  const modelName = GroqModelsConfig.llama[model];
  return chatWithGroq(prompt, modelName);
}

/**
 * Chat with Llama 3.3 70B for more complex tasks
 */
export async function chatWithLlama70B(prompt: string) {
  return chatWithLlama(prompt, '3.3-70b');
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
 * Chat with Qwen models via Groq
 * Available models:
 * - '3-32b': Qwen 3 32B model (recommended for complex tasks)
 */
export async function chatWithQwen(
  prompt: string,
  model: '3-32b' = '3-32b'
) {
  const modelName = GroqModelsConfig.qwen[model];
  const response = await chatWithGroq(prompt, modelName);
  return cleanQwenResponse(response);
}

/**
 * Chat with OpenAI OSS models via Groq
 * Available models:
 * - '20b': GPT-OSS 20B model (GPT-4 replacement)
 */
export async function chatWithGPTOSS(
  prompt: string,
  model: '20b' = '20b'
): Promise<string | null> {
  const modelName = GroqModelsConfig.openaiOss[model];
  return chatWithGroq(prompt, modelName);
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

  // Step 1: Get initial responses from all models
  console.log('🤖 Step 1: Getting initial responses from all models...');
  
  // Use GPT-OSS-20B via Groq as OpenAI replacement (since user doesn't have OpenAI API key)
  // If real OpenAI is available, use it; otherwise use GPT-OSS-20B, fallback to Llama 70B
  let openaiResp: string | null = null;
  if (openai) {
    try {
      openaiResp = await chatWithOpenAI(initialPrompt, 'gpt-4');
    } catch (error: any) {
      console.log('⚠️ OpenAI unavailable, trying GPT-OSS-20B via Groq');
      try {
        openaiResp = await chatWithGPTOSS(initialPrompt, '20b');
      } catch (ossError: any) {
        console.log('⚠️ GPT-OSS-20B unavailable, falling back to Llama 70B');
        openaiResp = await chatWithLlama(initialPrompt, '3.3-70b').catch(e => `Error: ${e.message}`);
      }
    }
  } else {
    // No OpenAI key, try GPT-OSS-20B, fallback to Llama 70B
    console.log('Trying GPT-OSS-20B via Groq as OpenAI replacement');
    try {
      openaiResp = await chatWithGPTOSS(initialPrompt, '20b');
    } catch (error: any) {
      console.log('⚠️ GPT-OSS-20B unavailable, falling back to Llama 70B');
      openaiResp = await chatWithLlama(initialPrompt, '3.3-70b').catch(e => `Error: ${e.message}`);
    }
  }
  
  const [llama8bResp, llama70bResp, qwenResp] = await Promise.all([
    chatWithLlama(initialPrompt, '8b-instant').catch(e => `Error: ${e.message}`),
    chatWithLlama(initialPrompt, '3.3-70b').catch(e => `Error: ${e.message}`),
    chatWithQwen(initialPrompt, '3-32b').catch(e => `Error: ${e.message}`),
  ]);

  const initialResponses: Record<string, string> = {
    'OpenAI GPT-4': openaiResp || 'No response', // Always include this, using GPT-OSS-120B via Groq if OpenAI unavailable
    'Llama 8B': llama8bResp || 'No response',
    'Llama 70B': llama70bResp || 'No response',
    'Qwen 32B': qwenResp || 'No response',
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

Please analyze all these responses, identify the best points from each, address any disagreements, and provide a single comprehensive final answer that synthesizes the best insights from all models. Be concise but thorough.`;

  console.log('💬 Step 2: Models discussing and reaching consensus...');

  // Step 3: Get the regular final answer
  // Use OpenAI GPT-4 for synthesis if available, otherwise GPT-OSS-20B, fallback to Llama 70B
  const discussion = `Models analyzed each other's responses and discussed key points.`;
  let finalAnswer: string | null;
  
  if (openai) {
    console.log('Using OpenAI GPT-4 for synthesis');
    try {
      finalAnswer = await chatWithOpenAI(discussionPrompt, 'gpt-4');
    } catch (error: any) {
      console.log('OpenAI synthesis failed, trying GPT-OSS-20B via Groq');
      try {
        finalAnswer = await chatWithGPTOSS(discussionPrompt, '20b');
      } catch (ossError: any) {
        console.log('GPT-OSS-20B failed, falling back to Llama 70B');
        finalAnswer = await chatWithLlama(discussionPrompt, '3.3-70b').catch(e => {
          console.error('Error in synthesis:', e);
          return null;
        });
      }
    }
  } else {
    console.log('Trying GPT-OSS-20B for synthesis via Groq');
    try {
      finalAnswer = await chatWithGPTOSS(discussionPrompt, '20b');
    } catch (error: any) {
      console.log('GPT-OSS-20B failed, falling back to Llama 70B');
      finalAnswer = await chatWithLlama(discussionPrompt, '3.3-70b').catch(e => {
        console.error('Error in synthesis:', e);
        return null;
      });
    }
  }

  // Step 4: Generate humanized version
  console.log('❤️ Step 3: Creating humanized version...');
  const humanizePrompt = `Take this answer and rewrite it in a warm, heartfelt, and deeply human manner using simple, everyday words:

Original Answer: "${finalAnswer}"

IMPORTANT FORMAT AND TONE GUIDELINES:
- Write in ESSAY FORM - flowing, connected paragraphs, NOT bullet points or numbered lists
- Keep it CONCISE - aim for approximately 150 words total (about 1-2 short paragraphs)
- Use SIMPLE, EVERYDAY WORDS - write as if talking to a friend in casual conversation
- Avoid fancy, complex, or formal words - use words you'd say in daily life
- DO NOT mention any AI models, open source models, GPT-4, Llama, Qwen, or any technical sources
- DO NOT say things like "GPT-4 suggested" or reference where the information came from
- Write as if the knowledge comes naturally from you, not from AI models or sources
- DO NOT use colons (:) in your response - write naturally without them
- DO NOT use double dashes (--), em dashes, or any dash-like separators in your response
- AVOID listing multiple examples in a row (like "xxx, xxx, and xxx") - this sounds too much like AI
- If you need to give examples, mention only ONE or TWO at most, and weave them naturally into sentences
- Use PROPER PUNCTUATION AND CAPITALIZATION - start sentences with capital letters, avoid starting with lowercase words like "and," "but," or casual words like "hey," unless they're mid-sentence
- Ensure proper sentence structure - each sentence should start with a capital letter and end with proper punctuation
- Write in a warm, human, and heartfelt manner as if you truly care about the person asking
- Use natural, conversational language - like you're explaining something to a friend over coffee
- Show empathy and understanding when appropriate
- Be genuine and authentic - don't use words that sound too academic or sophisticated
- Write as if you're having a thoughtful conversation with a close friend
- Connect ideas smoothly between paragraphs - make it read like a cohesive essay
- Make it feel like it comes from a caring, thoughtful human who genuinely wants to help
- Focus on the most important points and express them simply and clearly, rather than listing everything

Rewrite the answer above as a concise, heartfelt essay using simple, everyday language that anyone can understand. Write like you're talking to a friend, not writing a formal essay. Do not use any dashes (--, —, or -) or colons (:) in your response. Avoid giving multiple examples in lists. DO NOT mention any AI models, GPT-4, or sources - write as if you're sharing your own knowledge naturally. IMPORTANT: Keep it to approximately 150 words - be concise and focus only on the most essential points.`;

  // Use OpenAI GPT-4 for humanization if available, otherwise GPT-OSS-20B, fallback to Llama 70B
  let humanizedAnswer: string | null;
  
  if (openai) {
    console.log('Using OpenAI GPT-4 for humanization');
    try {
      humanizedAnswer = await chatWithOpenAI(humanizePrompt, 'gpt-4');
    } catch (error: any) {
      console.log('OpenAI humanization failed, trying GPT-OSS-20B via Groq');
      try {
        humanizedAnswer = await chatWithGPTOSS(humanizePrompt, '20b');
      } catch (ossError: any) {
        console.log('GPT-OSS-20B failed, falling back to Llama 70B');
        humanizedAnswer = await chatWithLlama(humanizePrompt, '3.3-70b').catch(e => {
          console.error('Error in humanization:', e);
          return null;
        });
      }
    }
  } else {
    console.log('Trying GPT-OSS-20B for humanization via Groq');
    try {
      humanizedAnswer = await chatWithGPTOSS(humanizePrompt, '20b');
    } catch (error: any) {
      console.log('GPT-OSS-20B failed, falling back to Llama 70B');
      humanizedAnswer = await chatWithLlama(humanizePrompt, '3.3-70b').catch(e => {
        console.error('Error in humanization:', e);
        return null;
      });
    }
  }
  
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


