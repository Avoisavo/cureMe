/**
 * Simple Express server for testing AI APIs
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { chatWithOpenAI, chatWithLlama, chatWithQwen, chatWithGPTOSS, discussWithAllModels } from './index';

const app = express();
const PORT = 3001; // Changed to 3001 to avoid conflict with Next.js frontend on 3000

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure chats directory exists
const chatsDir = path.join(__dirname, 'chats');
if (!fs.existsSync(chatsDir)) {
  fs.mkdirSync(chatsDir, { recursive: true });
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Special case: "all" model triggers discussion
    if (model === 'all') {
      const result = await discussWithAllModels(prompt);
      return res.json({
        success: true,
        response: result.finalAnswer,
        humanizedResponse: result.humanizedAnswer,
        duration: result.duration,
        model: 'all',
        initialResponses: result.initialResponses,
        discussion: result.discussion,
      });
    }

    let response: string | null;
    const startTime = Date.now();

    switch (model) {
      case 'openai':
        // Try GPT-OSS-20B via Groq as OpenAI replacement, fallback to Llama 70B
        try {
          response = await chatWithGPTOSS(prompt, '20b');
        } catch (error: any) {
          console.log('GPT-OSS-20B unavailable, falling back to Llama 70B');
          response = await chatWithLlama(prompt, '3.3-70b');
        }
        break;
      case 'llama-8b':
        response = await chatWithLlama(prompt, '8b-instant');
        break;
      case 'llama-70b':
        response = await chatWithLlama(prompt, '3.3-70b');
        break;
      case 'qwen':
        response = await chatWithQwen(prompt, '3-32b');
        break;
      default:
        return res.status(400).json({ error: 'Invalid model. Available: openai, llama-8b, llama-70b, qwen, all' });
    }

    const duration = Date.now() - startTime;

    res.json({
      success: true,
      response,
      duration,
      model,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred',
    });
  }
});

// Save chat history endpoint
app.post('/api/save-chat', async (req, res) => {
  try {
    const { messages, summary, dateTime } = req.body;

    if (!messages || !summary) {
      return res.status(400).json({ error: 'Messages and summary are required' });
    }

    // Format the chat history
    const chatHistory = {
      sessionId: Date.now().toString(),
      dateTime: dateTime || new Date().toISOString(),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
      })),
      summary: summary,
    };

    // Save to JSON file with timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `chat-${timestamp}.json`;
    const filepath = path.join(chatsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(chatHistory, null, 2), 'utf-8');

    console.log(`💾 Chat history saved to ${filename}`);

    res.json({
      success: true,
      filename,
      message: 'Chat history saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save chat history',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Test Server running on http://localhost:${PORT}`);
  console.log(`💾 Chat history will be saved to: ${chatsDir}`);
});

