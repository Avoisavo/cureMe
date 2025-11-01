# Panel Image Generation Pipeline

Complete implementation of the panel image generation system that reads from MongoDB and generates AI images for each manga panel.

## Overview

This pipeline extends the memory generation system by automatically generating AI-powered manga-style images for each panel in a memory. The system:

1. ✅ Reads memory data from MongoDB (`curemebaby.memories` collection)
2. ✅ Extracts panel information (captions, mood, style)
3. ✅ Generates manga-style images using DALL-E 3
4. ✅ Saves images locally as YYMMDD_panel-X.png
5. ✅ Updates MongoDB with image URLs

---

## Data Flow

```
Memory Created (MongoDB)
    ↓
Extract Panels
    ↓
For Each Panel:
  ↓
  Generate AI Image (DALL-E 3)
  ↓
  Download Image Buffer
  ↓
  Save as YYMMDD_panel-X.png
  ↓
  Update Panel imgUrl
    ↓
Update Memory in MongoDB
    ↓
Complete!
```

---

## File Naming Convention

Images are saved with the format: `YYMMDD_panel-X.png`

**Examples:**

- `251101_panel-1.png` - Panel 1 for November 1, 2025
- `251101_panel-2.png` - Panel 2 for November 1, 2025
- `251225_panel-1.png` - Panel 1 for December 25, 2025

**Format Breakdown:**

- `YY` - Last 2 digits of year (25 = 2025)
- `MM` - Month (01-12, zero-padded)
- `DD` - Day (01-31, zero-padded)
- `panel-X` - Panel identifier from memory

---

## MongoDB Collection Structure

The system reads from the `memories` collection in the `curemebaby` database.

### Memory Document (Sample)

```json
{
  "_id": "...",
  "id": "2025-11-01",
  "date": "2025-11-01",
  "title": "Finding strength",
  "mood": {
    "primary": "calm",
    "valence": 0.7,
    "energy": 0.3
  },
  "panels": [
    {
      "id": "panel-1",
      "order": 0,
      "caption": "Your day began with unexpected academic pressure...",
      "altText": "Panel 1: A manga-style illustration depicting calm emotions",
      "style": "bw",
      "imgUrl": null // Will be populated by pipeline
    },
    {
      "id": "panel-2",
      "order": 1,
      "caption": "A coffee spill forced a moment of unplanned reflection...",
      "altText": "Panel 2: A manga-style illustration depicting calm emotions",
      "style": "bw",
      "imgUrl": null
    }
  ],
  "status": "generated",
  "userId": "default"
}
```

---

## API Routes

### 1. Automatic Generation (via Memory Creation)

When a memory is created via `POST /api/memories`, the panel images are **automatically generated**.

```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_123",
    "date": "2025-11-01",
    "datetime": "2025-11-01T10:00:00Z",
    "timestamp": "November 1, 2025, 10:00 AM",
    "aiSummary": "Today was a day of reflection...",
    "chatMessages": [...],
    "userId": "default"
  }'
```

**Response:**

```json
{
  "success": true,
  "memory": {
    "id": "2025-11-01",
    "panels": [
      {
        "id": "panel-1",
        "imgUrl": "https://oaidalleapiprodscus.blob.core.windows.net/..."
      }
    ]
  },
  "operation": "created",
  "panelImagesGenerated": true,
  "panelResults": [
    {
      "panelId": "panel-1",
      "imageUrl": "https://...",
      "localPath": "/path/to/251101_panel-1.png"
    }
  ]
}
```

### 2. Manual Generation

Generate images for an existing memory:

```bash
POST /api/memories/generate-panels
```

**Request:**

```json
{
  "date": "2025-11-01",
  "userId": "default",
  "options": {
    "quality": "standard",
    "size": "1024x1024",
    "saveLocally": true,
    "localPath": "./public/generated-panels"
  }
}
```

**Response:**

```json
{
  "success": true,
  "date": "2025-11-01",
  "panelCount": 4,
  "results": [
    {
      "panelId": "panel-1",
      "imageUrl": "https://...",
      "localPath": "/path/to/251101_panel-1.png",
      "revisedPrompt": "..."
    }
  ]
}
```

### 3. Check Panel Status

Check which panels have images generated:

```bash
GET /api/memories/generate-panels?date=2025-11-01&userId=default
```

**Response:**

```json
{
  "success": true,
  "date": "2025-11-01",
  "totalPanels": 4,
  "panelsWithImages": 4,
  "isComplete": true,
  "panels": [
    {
      "id": "panel-1",
      "hasImage": true,
      "imgUrl": "https://..."
    }
  ]
}
```

---

## Image Generation Details

### Prompt Generation

Each panel is converted into a detailed DALL-E 3 prompt that includes:

- **Scene description** from the panel caption
- **Art style** (black and white manga, halftone, or color accent)
- **Mood context** from the memory's mood data
- **Quality requirements** (professional manga artist quality)

**Example Prompt:**

```
Create a single manga panel illustration:

Scene: Your day began with unexpected academic pressure that left the class rattled, yet you quickly organized a study sprint, turning chaos into clear action

Art style: black and white manga style with screen tones and hatching, Japanese manga/anime aesthetic, expressive character emotions showing calm mood, clean linework, professional manga artist quality, dynamic composition, detailed backgrounds.

Note: This is a therapeutic reflection panel, keep tone respectful and emotionally supportive.
```

### Style Options

- `bw` - Black and white manga with screen tones and hatching
- `halftone` - Manga with halftone dots and dynamic shading
- `colorAccent` - Mostly B&W with selective color accents

### Rate Limiting

The pipeline includes a 2-second delay between panel generations to respect DALL-E 3 rate limits.

---

## Local Storage

Images are saved to: `./public/generated-panels/`

This directory is automatically created if it doesn't exist.

**File Structure:**

```
frontend/
  public/
    generated-panels/
      251101_panel-1.png
      251101_panel-2.png
      251101_panel-3.png
      251101_panel-4.png
      251225_panel-1.png
      ...
```

**Accessing Images:**

Once saved in `public/`, images can be accessed via:

```
http://localhost:3000/generated-panels/251101_panel-1.png
```

---

## Utilities

### `panelImageGeneration.ts`

Main utility for generating panel images.

**Key Functions:**

```typescript
// Generate image for a single panel
generatePanelImage(panel: Panel, mood: string, options: PanelImageOptions)

// Generate images for all panels in a memory
generateImagesForMemory(
  memoryDate: string,
  panels: Panel[],
  mood: string,
  options: PanelImageOptions
)

// Convert date to YYMMDD format
formatDateToYYMMDD("2025-11-01") // Returns "251101"

// Save image buffer locally
saveImageLocally(buffer: Buffer, filename: string, directory: string)

// Download image from URL
downloadImageAsBuffer(imageUrl: string)
```

---

## Error Handling

The pipeline includes robust error handling:

1. **Individual Panel Failures**: If one panel fails, others continue
2. **Graceful Degradation**: Memory is still saved even if image generation fails
3. **Error Reporting**: Detailed error messages in response
4. **Retry Logic**: Images can be regenerated using the manual endpoint

**Example Error Response:**

```json
{
  "success": true,
  "memory": {...},
  "operation": "created",
  "panelImagesGenerated": false,
  "imageGenerationError": "Rate limit exceeded"
}
```

---

## Usage Examples

### Frontend Integration

```typescript
// Automatic (already integrated in cloud-chat.tsx)
const response = await fetch("/api/memories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "session_123",
    date: "2025-11-01",
    datetime: new Date().toISOString(),
    timestamp: new Date().toLocaleString(),
    aiSummary: summary,
    chatMessages: messages,
  }),
});

const data = await response.json();
// data.panelImagesGenerated will be true if successful
// data.panelResults contains image URLs and local paths
```

### Manual Regeneration

```typescript
// Regenerate images for an existing memory
const response = await fetch("/api/memories/generate-panels", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    date: "2025-11-01",
    userId: "default",
    options: {
      quality: "hd", // Use HD quality
      size: "1792x1024", // Landscape format
    },
  }),
});
```

### Check Status

```typescript
// Check if all panels have images
const response = await fetch(
  "/api/memories/generate-panels?date=2025-11-01&userId=default"
);
const data = await response.json();

if (data.isComplete) {
  console.log("All panels have images!");
}
```

---

## Environment Variables

Required:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=curemebaby
OPENAI_API_KEY=sk-...
```

---

## Cost Considerations

### DALL-E 3 Pricing (as of 2024)

- **Standard Quality (1024×1024)**: $0.040 per image
- **HD Quality (1024×1024)**: $0.080 per image

**Example Costs:**

- 4 panels/day × 30 days = 120 images/month
- Standard: 120 × $0.040 = **$4.80/month**
- HD: 120 × $0.080 = **$9.60/month**

---

## Performance

### Timing

- Single panel generation: ~10-15 seconds
- 4-panel memory (with delays): ~50-60 seconds
- Rate limit delay: 2 seconds between panels

### Optimization Tips

1. Use `quality: "standard"` for faster, cheaper generation
2. Generate images in the background (already implemented)
3. Cache and reuse images when possible
4. Consider generating only on user request for draft memories

---

## Files Created/Modified

### New Files

- `/utils/panelImageGeneration.ts` - Panel image generation utility
- `/app/api/memories/generate-panels/route.ts` - Manual generation endpoint
- `/PANEL_IMAGE_GENERATION.md` - This documentation

### Modified Files

- `/app/api/memories/route.ts` - Added automatic image generation
- `/utils/memoryGenerator.ts` - Already had Panel interface

---

## Testing

### Test Automatic Generation

```bash
# Create a memory (images will auto-generate)
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session",
    "date": "2025-11-01",
    "datetime": "2025-11-01T10:00:00Z",
    "timestamp": "November 1, 2025",
    "aiSummary": "Today I felt calm and reflective.",
    "chatMessages": [
      {"role": "user", "content": "I feel good today"},
      {"role": "assistant", "content": "That is wonderful"}
    ]
  }'

# Check the public/generated-panels directory
ls public/generated-panels/
# Should show: 251101_panel-1.png, 251101_panel-2.png, etc.
```

### Test Manual Generation

```bash
# Generate images for existing memory
curl -X POST http://localhost:3000/api/memories/generate-panels \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-01",
    "userId": "default"
  }'
```

### Check Status

```bash
curl http://localhost:3000/api/memories/generate-panels?date=2025-11-01
```

---

## Integration with Manga Reader

The generated images can be displayed in the manga reader component:

```tsx
// In MangaReader.tsx or similar
{
  memory.panels.map((panel, index) => (
    <div key={panel.id} className="manga-panel">
      {panel.imgUrl ? (
        <img src={panel.imgUrl} alt={panel.altText} className="panel-image" />
      ) : (
        <div className="panel-placeholder">{panel.caption}</div>
      )}
    </div>
  ));
}
```

---

## Summary

✅ **Automatic pipeline**: Images generate when memory is created
✅ **MongoDB integration**: Reads from `curemebaby.memories` collection
✅ **Proper naming**: YYMMDD_panel-X.png format
✅ **Local storage**: Saves to `./public/generated-panels/`
✅ **DALL-E 3**: High-quality manga-style images
✅ **Error handling**: Graceful degradation and retry support
✅ **Rate limiting**: Built-in delays to respect API limits
✅ **Manual control**: Can regenerate images on demand

The pipeline is fully functional and ready to use! 🎨✨
