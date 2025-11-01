# Chat to Memory Pipeline Implementation

Complete implementation of the chat conversation → summary → memory pipeline with MongoDB storage.

## Overview

This implementation follows the ETHTokyo pattern but adapted for the modern Next.js frontend with TypeScript and MongoDB. The pipeline automatically:

1. Stores chat conversations with datetime stamps
2. Generates and stores AI summaries
3. Creates memory objects (similar to ethtokyo's manga memories)
4. Pushes everything to MongoDB automatically

---

## Architecture

### Data Flow

```
User Chat (chatme/)
    ↓
[Generate Summary]
    ↓
[Store Chat Session] → MongoDB: chat_sessions
    ↓
[Store Summary] → MongoDB: chat_summaries
    ↓
[Generate Memory] → MongoDB: memories
    ↓
Complete!
```

---

## MongoDB Collections

### 1. `chat_sessions`

Stores complete chat conversations with timestamps.

**Schema:**

```typescript
{
  sessionId: string;           // Unique session identifier
  date: string;                // ISO date string
  timestamp: string;           // Human-readable timestamp
  datetime: Date;              // Full datetime object
  messages: ChatMessage[];     // Array of messages
  messageCount: number;        // Total messages in session
  userId: string;              // User identifier
}
```

### 2. `chat_summaries`

Stores AI-generated summaries with datetime.

**Schema:**

```typescript
{
  sessionId: string; // Links to chat_sessions
  date: string; // YYYY-MM-DD format
  timestamp: string; // Human-readable timestamp
  datetime: Date; // Full datetime object
  summary: string; // AI-generated summary
  userId: string; // User identifier
  createdAt: Date; // Creation timestamp
}
```

### 3. `memories`

Stores memory objects with panels, mood, tags, etc.

**Schema:**

```typescript
{
  id: string;                  // YYYY-MM-DD or unique ID
  date: string;                // YYYY-MM-DD
  datetime: Date;              // Full datetime object
  timestamp: string;           // Human-readable timestamp
  title: string;               // Generated title
  logline: string;             // One-line summary
  tags: string[];              // Generated tags
  mood: MoodMetrics;           // Emotion analysis
  skillsUsed: string[];        // Coping skills identified
  keyMoments: KeyMoment[];     // Timeline of moments
  panels: Panel[];             // Manga-style panels
  status: string;              // draft/generated/edited
  favorite: boolean;           // Favorite flag
  sources: SourceRef[];        // References to chat
  contentWarnings: string[];   // Content warnings
  aiSummary: string;           // The AI summary (REQUIRED)
  userId: string;              // User identifier
  version: number;             // Schema version
  createdAt: Date;             // Creation timestamp
  updatedAt: Date;             // Last update timestamp
}
```

---

## API Routes

### 1. `/api/chat-sessions`

**POST** - Store chat session

```typescript
// Request
{
  sessionId: string;
  messages: ChatMessage[];
  userId?: string;
}

// Response
{
  success: boolean;
  sessionId: string;
  messageCount: number;
  insertedId: string;
}
```

**GET** - Retrieve chat sessions

```
GET /api/chat-sessions?userId=default&limit=100
GET /api/chat-sessions?sessionId=session_123
```

### 2. `/api/chat-summaries`

**POST** - Store AI summary

```typescript
// Request
{
  sessionId: string;
  summary: string;
  userId?: string;
}

// Response
{
  success: boolean;
  sessionId: string;
  insertedId: string;
  summary: ChatSummary;
}
```

**GET** - Retrieve summaries

```
GET /api/chat-summaries?userId=default
GET /api/chat-summaries?sessionId=session_123
GET /api/chat-summaries?date=2025-01-15
```

### 3. `/api/memories`

**POST** - Generate and store memory

```typescript
// Request
{
  sessionId: string;
  date: string;                // YYYY-MM-DD
  datetime: string;            // ISO datetime
  timestamp: string;           // Human-readable
  aiSummary: string;           // Required
  chatMessages: ChatMessage[]; // Chat history
  userId?: string;
  options?: {
    tone?: string;
    panelCount?: number;
    contentSensitivity?: string;
  }
}

// Response
{
  success: boolean;
  memory: Memory;
  operation: "created" | "updated";
}
```

**GET** - Retrieve memories

```
GET /api/memories?userId=default
GET /api/memories?date=2025-01-15
GET /api/memories?month=2025-01
GET /api/memories?favorite=true
GET /api/memories?mood=happy
```

**PUT** - Update memory

```typescript
// Request
{
  date: string;
  userId?: string;
  updates: Partial<Memory>;
}
```

**DELETE** - Delete memory

```
DELETE /api/memories?date=2025-01-15&userId=default
```

---

## Components

### CloudChat Component

**Location:** `/components/cloud-chat.tsx`

The chat component now automatically triggers the full pipeline when "End Chat & Get Summary" is clicked:

1. Generates AI summary
2. Stores chat session
3. Stores summary
4. Generates and stores memory

**Key Function:**

```typescript
const endChat = async () => {
  // 1. Generate summary
  const conversationSummary = await generateSummary(conversationToSummarize);

  // 2. Save chat session
  await fetch('/api/chat-sessions', { ... });

  // 3. Save summary
  await fetch('/api/chat-summaries', { ... });

  // 4. Generate memory
  await fetch('/api/memories', { ... });
};
```

---

## Memory Generation Utility

**Location:** `/utils/memoryGenerator.ts`

Similar to ethtokyo's `lib/memories/generator.js`, this utility:

- Analyzes chat content for emotions and themes
- Generates titles, loglines, and tags
- Creates mood metrics (valence, energy)
- Generates manga-style panels
- Applies safety filtering

**Key Function:**

```typescript
export async function generateMemoryForDate(
  date: string,
  datetime: Date,
  timestamp: string,
  aiSummary: string,
  chatMessages: ChatMessage[],
  userId: string,
  options: GenerationOptions
): Promise<Memory>;
```

---

## Memory Object Structure

### Panel Structure

```typescript
{
  id: "panel-1",
  order: 0,
  caption: "The day begins with quiet contemplation...",
  altText: "Panel 1: A manga-style illustration...",
  imgUrl: undefined,  // For future image generation
  style: "bw"         // Black and white manga style
}
```

### Mood Metrics

```typescript
{
  primary: "happy" | "calm" | "anxious" | "sad" | "angry" | "mixed" | "neutral",
  valence: 0.5,       // -1 to 1 (negative to positive)
  energy: 0.7,        // 0 to 1 (low to high)
  topEmotions: ["happy", "excited"]
}
```

### Key Moments

```typescript
{
  time: "During day",
  note: "Engaged in exercise and meditation"
}
```

---

## Usage Example

### Frontend Integration

```typescript
// In CloudChat component, endChat() is automatically called
// when user clicks "End Chat & Get Summary"

// Manual memory creation
const response = await fetch('/api/memories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session_123',
    date: '2025-01-15',
    datetime: new Date().toISOString(),
    timestamp: new Date().toLocaleString(),
    aiSummary: 'Your day was filled with...',
    chatMessages: [...],
    userId: 'user@example.com',
    options: {
      tone: 'reflective',
      panelCount: 4,
      contentSensitivity: 'medium'
    }
  })
});

const data = await response.json();
console.log(data.memory); // Full memory object
```

### Retrieving Memories

```typescript
// Get all memories
const response = await fetch("/api/memories?userId=user@example.com");
const { memories } = await response.json();

// Get specific memory
const response = await fetch("/api/memories?date=2025-01-15");
const { memory } = await response.json();

// Get memories by mood
const response = await fetch("/api/memories?mood=happy");
const { memories } = await response.json();

// Get favorite memories
const response = await fetch("/api/memories?favorite=true");
const { memories } = await response.json();
```

---

## Environment Variables

Required environment variables (already configured):

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=curemebaby
OPENAI_API_KEY=sk-...
```

---

## Testing

### Test Chat Session Storage

```bash
curl -X POST http://localhost:3000/api/chat-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_1",
    "messages": [
      {"id": "1", "role": "user", "content": "Hello", "timestamp": "2025-01-15T10:00:00Z"},
      {"id": "2", "role": "assistant", "content": "Hi there!", "timestamp": "2025-01-15T10:00:05Z"}
    ],
    "userId": "test_user"
  }'
```

### Test Summary Storage

```bash
curl -X POST http://localhost:3000/api/chat-summaries \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_1",
    "summary": "Had a good conversation about feelings",
    "userId": "test_user"
  }'
```

### Test Memory Generation

```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_1",
    "date": "2025-01-15",
    "datetime": "2025-01-15T10:00:00Z",
    "timestamp": "January 15, 2025, 10:00:00 AM",
    "aiSummary": "Today was a day of reflection and growth",
    "chatMessages": [
      {"role": "user", "content": "I felt anxious today"},
      {"role": "assistant", "content": "It is okay to feel anxious"}
    ],
    "userId": "test_user"
  }'
```

---

## Comparison with ETHTokyo Implementation

| Feature          | ETHTokyo                        | This Implementation      |
| ---------------- | ------------------------------- | ------------------------ |
| Chat Storage     | `logs/chat_history.json` (file) | MongoDB `chat_sessions`  |
| Summary Storage  | Not stored                      | MongoDB `chat_summaries` |
| Memory Storage   | IndexedDB (client-side)         | MongoDB `memories`       |
| Image Generation | Not implemented                 | Ready for integration    |
| Date/Time Stamps | Basic                           | Full datetime objects    |
| User Management  | Single user                     | Multi-user with userId   |
| API              | Next.js Pages API               | Next.js App Router API   |
| Language         | JavaScript                      | TypeScript               |

---

## Key Improvements

1. **Full DateTime Support**: Both date strings and datetime objects
2. **MongoDB Storage**: Centralized, scalable database
3. **Multi-user**: User identification and isolation
4. **Automatic Pipeline**: Everything triggered by "End Chat"
5. **TypeScript**: Type-safe implementation
6. **RESTful APIs**: Full CRUD operations
7. **Memory Object**: Includes AI summary (required field)

---

## Panel Image Generation (NEW! ✨)

The pipeline now includes **automatic AI image generation** for all manga panels!

### How It Works

When a memory is created:

1. Memory is stored in MongoDB with panel captions
2. **Automatically** generates manga-style images for each panel using DALL-E 3
3. Saves images locally as `YYMMDD_panel-X.png` (e.g., `251101_panel-1.png`)
4. Updates MongoDB with image URLs

### Image Storage

- **Local Path**: `./public/generated-panels/`
- **Format**: `YYMMDD_panel-X.png`
- **Style**: Manga/anime art based on panel captions and mood

### API Endpoints

```bash
# Automatic (happens when creating memory)
POST /api/memories

# Manual generation
POST /api/memories/generate-panels
{
  "date": "2025-11-01",
  "userId": "default",
  "options": {
    "quality": "standard",
    "size": "1024x1024"
  }
}

# Check status
GET /api/memories/generate-panels?date=2025-11-01
```

### Documentation

See [PANEL_IMAGE_GENERATION.md](./PANEL_IMAGE_GENERATION.md) for complete details.

---

## Future Enhancements

1. ~~**Image Generation**: Integrate DALL-E or Stable Diffusion for panel images~~ ✅ **COMPLETED**
2. **Memory Editing UI**: Build frontend for editing memories
3. **Memory Collection View**: Display all memories in a gallery
4. **Search**: Full-text search across memories
5. **Export**: PDF/PNG export of memories
6. **Filters**: Advanced filtering by tags, mood, date range
7. **Image Caching**: Cache generated images to avoid regeneration
8. **Cloudinary Integration**: Store panel images in Cloudinary for CDN delivery

---

## Files Created

- `/app/api/chat-sessions/route.ts` - Chat session storage API
- `/app/api/chat-summaries/route.ts` - Summary storage API
- `/app/api/memories/route.ts` - Memory CRUD API (with auto image generation)
- `/app/api/memories/generate-panels/route.ts` - Manual panel image generation API
- `/utils/memoryGenerator.ts` - Memory generation utility
- `/utils/panelImageGeneration.ts` - Panel image generation utility (NEW)
- `/components/cloud-chat.tsx` - Updated with pipeline integration
- `/public/generated-panels/` - Directory for storing generated panel images
- `PANEL_IMAGE_GENERATION.md` - Panel image generation documentation

---

## Summary

The complete pipeline is now implemented and functional:

✅ Chat conversations are stored with datetime stamps
✅ AI summaries are generated and stored
✅ Memory objects are automatically created
✅ Everything is pushed to MongoDB
✅ All APIs are RESTful and type-safe
✅ Similar structure to ethtokyo but improved

The pipeline automatically runs when users click "End Chat & Get Summary" in the chat interface at `/chatme`.
