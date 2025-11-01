/**
 * Configuration for AI APIs (OpenAI and Phala Cloud AI / RedPill)
 * Make sure to set OPENAI_API_KEY and PHALA_API_KEY in your .env file
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// OpenAI API Configuration (optional - won't fail if key is missing)
export function getOpenAIApiKey(): string | null {
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey || null;
}

export const openAIConfig = {
  apiKey: getOpenAIApiKey(),
};

// Phala Cloud AI (RedPill) API Configuration
export function getPhalaApiKey(): string {
  const apiKey = process.env.PHALA_API_KEY || process.env.CONFIDENTIAL_AI_KEY;
  
  if (!apiKey) {
    throw new Error(
      'PHALA_API_KEY or CONFIDENTIAL_AI_KEY is not set. Please add it to your .env file.'
    );
  }
  
  return apiKey;
}

export const phalaConfig = {
  apiKey: getPhalaApiKey(),
  baseURL: 'https://api.redpill.ai/v1',
};

// Available Phala Cloud AI Models
export const PhalaModels = {
  // OpenAI OSS Models
  openaiOss: {
    '20b': 'openai/gpt-oss-20b',                // ✅ GPT-4 replacement - 20B model
    '120b': 'openai/gpt-oss-120b',              // ✅ GPT-4 replacement - 120B model
  },
  // Qwen Models
  qwen: {
    '2.5-7b': 'qwen/qwen-2.5-7b-instruct',      // ✅ Qwen 2.5 7B Instruct
    '2.5-vl-72b': 'qwen/qwen2.5-vl-72b-instruct', // ✅ Qwen 2.5 VL 72B Instruct
    '3-vl-235b': 'qwen/qwen3-vl-235b-a22b-instruct', // ✅ Qwen3 VL 235B Instruct
  },
  // DeepSeek Models
  deepseek: {
    'chat-v3': 'deepseek/deepseek-chat-v3-0324', // ✅ DeepSeek Chat V3
  },
  // Google Models
  google: {
    'gemma-3-27b': 'google/gemma-3-27b-it',    // ✅ Gemma 3 27B
  },
} as const;

// Backward compatibility - keep GroqModels as alias to PhalaModels
export const GroqModels = PhalaModels;
