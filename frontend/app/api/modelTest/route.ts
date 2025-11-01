import { NextRequest, NextResponse } from 'next/server';

interface ModelConfig {
  name: string;
  endpoint: string;
  model: string;
}

// Configuration for different AI models
const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'openai': {
    name: 'OpenAI GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4'
  },
  'llama-8b': {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
  },
  'llama-70b': {
    name: 'Llama 70B',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-2-70b-chat-hf'
  },
  'qwen': {
    name: 'Qwen 32B',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'Qwen/Qwen2-72B-Instruct'
  }
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { prompt, model } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!model || typeof model !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Model selection is required' },
        { status: 400 }
      );
    }

    // Handle "all models" discussion mode
    if (model === 'all') {
      const result = await handleAllModelsDiscussion(prompt);
      const duration = Date.now() - startTime;
      return NextResponse.json({
        ...result,
        duration
      });
    }

    // Handle single model request
    if (!MODEL_CONFIGS[model]) {
      return NextResponse.json(
        { success: false, error: `Unknown model: ${model}` },
        { status: 400 }
      );
    }

    const response = await callModel(model, prompt);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      response,
      duration
    });

  } catch (error: any) {
    console.error('ModelTest API Error:', error);
    const duration = Date.now() - startTime;
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process request',
        duration
      },
      { status: 500 }
    );
  }
}

async function callModel(modelKey: string, prompt: string): Promise<string> {
  const config = MODEL_CONFIGS[modelKey];
  
  // Get API key based on model
  let apiKey: string | undefined;
  
  switch (modelKey) {
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY;
      break;
    case 'llama-8b':
      apiKey = process.env.DEEPSEEK_API_KEY;
      break;
    case 'llama-70b':
    case 'qwen':
      apiKey = process.env.TOGETHER_API_KEY;
      break;
  }

  if (!apiKey) {
    throw new Error(`API key not configured for ${config.name}. Please add the appropriate API key to .env.local`);
  }

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${config.name} API Error:`, errorText);
      throw new Error(`${config.name} API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response received';
  } catch (error: any) {
    console.error(`Error calling ${config.name}:`, error);
    throw new Error(`Failed to get response from ${config.name}: ${error.message}`);
  }
}

async function handleAllModelsDiscussion(prompt: string): Promise<{
  success: boolean;
  response?: string;
  humanizedResponse?: string;
  initialResponses?: Record<string, string>;
  error?: string;
}> {
  try {
    // Step 1: Get initial responses from all models in parallel
    const modelKeys = Object.keys(MODEL_CONFIGS);
    const initialPromises = modelKeys.map(async (key) => {
      try {
        const response = await callModel(key, prompt);
        return { key, response };
      } catch (error: any) {
        console.error(`Error from ${key}:`, error);
        return { key, response: `Error: ${error.message}` };
      }
    });

    const results = await Promise.all(initialPromises);
    const initialResponses: Record<string, string> = {};
    
    results.forEach(({ key, response }) => {
      initialResponses[MODEL_CONFIGS[key].name] = response;
    });

    // Step 2: Create a discussion summary combining all responses
    const discussionText = results
      .map(({ key, response }) => `${MODEL_CONFIGS[key].name}:\n${response}`)
      .join('\n\n---\n\n');

    const synthesisPrompt = `You are a synthesis assistant. Multiple AI models have responded to the following question:

"${prompt}"

Here are their responses:

${discussionText}

Please synthesize these responses into a comprehensive, coherent answer that:
1. Identifies common themes and agreements
2. Highlights unique insights from each model
3. Resolves any contradictions
4. Provides a balanced, well-rounded conclusion

Keep your synthesis clear, concise, and informative.`;

    // Use OpenAI to synthesize (or fallback to first available model)
    let finalResponse: string;
    try {
      finalResponse = await callModel('openai', synthesisPrompt);
    } catch (error) {
      // Fallback to DeepSeek if OpenAI fails
      try {
        finalResponse = await callModel('llama-8b', synthesisPrompt);
      } catch (fallbackError) {
        // If all synthesis fails, just concatenate responses
        finalResponse = discussionText;
      }
    }

    // Step 3: Create a humanized version
    const humanizePrompt = `Take this technical AI synthesis and rewrite it in a warm, conversational, and human-friendly way. Make it feel like advice from a knowledgeable friend:

${finalResponse}

Rewrite this to be:
- Warm and approachable
- Easy to understand
- Conversational in tone
- Empathetic and supportive
- Free of technical jargon

Humanized version:`;

    let humanizedResponse: string;
    try {
      humanizedResponse = await callModel('openai', humanizePrompt);
    } catch (error) {
      // If humanization fails, use the original synthesis
      humanizedResponse = finalResponse;
    }

    return {
      success: true,
      response: finalResponse,
      humanizedResponse,
      initialResponses
    };

  } catch (error: any) {
    console.error('Error in all models discussion:', error);
    return {
      success: false,
      error: error.message || 'Failed to process multi-model discussion'
    };
  }
}

