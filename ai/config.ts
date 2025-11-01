/**
 * Configuration for AI APIs (OpenAI and Groq)
 * Make sure to set OPENAI_API_KEY and GROQ_API_KEY in your .env file
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

// Groq API Configuration
export function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Please add it to your .env file.'
    );
  }
  
  return apiKey;
}

export const groqConfig = {
  apiKey: getGroqApiKey(),
};

// Available Groq Models (validated as of Nov 2025)
export const GroqModels = {
  // Llama Models (VALIDATED - Working)
  llama: {
    '8b-instant': 'llama-3.1-8b-instant',        // ✅ Fast, lightweight - WORKING
    '3.3-70b': 'llama-3.3-70b-versatile',        // ✅ Latest version - WORKING
    // 'tool-use-70b': 'llama-3-groq-70b-tool-use', // ⚠️ Specialized for tool use (needs testing)
    // 'tool-use-8b': 'llama-3-groq-8b-tool-use',   // ⚠️ Specialized for tool use (needs testing)
  },
  // Qwen Models (VALIDATED - Working)
  qwen: {
    '3-32b': 'qwen/qwen3-32b',                   // ✅ 32B Qwen model - WORKING
    // '2.5-7b': 'qwen/qwen2.5-7b-instruct',      // ⚠️ Needs testing
    // '2.5-14b': 'qwen/qwen2.5-14b-instruct',    // ⚠️ Needs testing
    // '2.5-32b': 'qwen/qwen2.5-32b-instruct',    // ⚠️ Needs testing
    // '2.5-72b': 'qwen/qwen2.5-72b-instruct',    // ⚠️ Needs testing
  },
  // Mixtral Models (NEEDS TESTING)
  mixtral: {
    // '8x7b': 'mixtral-8x7b-32768',              // ⚠️ Needs testing
    // '8x22b': 'mixtral-8x22b-instruct-32768',   // ⚠️ Needs testing
  },
  // Gemma Models (NEEDS TESTING)
  gemma: {
    // '7b-it': 'gemma-7b-it',                    // ⚠️ Needs testing
    // '2-9b-it': 'gemma2-9b-it',                  // ⚠️ Needs testing
  },
  // OpenAI OSS Models
  openaiOss: {
    '20b': 'openai/gpt-oss-20b',                // ✅ GPT-4 replacement - 20B model (correct format: openai/gpt-oss-20b)
    // '120b': 'openai/gpt-oss-120b',            // ❌ Not available
  },
  // Note: The following models are NOT available:
  // - llama-3.1-70b-versatile (deprecated/decommissioned)
  // - llama-3.1-405b-instruct (may not be available)
  // - DeepSeek models (not available on Groq)
} as const;
