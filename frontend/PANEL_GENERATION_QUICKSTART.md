# Panel Image Generation - Quick Start Guide

Quick reference for the MongoDB-powered panel image generation pipeline.

## Quick Summary

✅ **Automatic**: Images generate when memories are created
✅ **MongoDB**: Reads from `curemebaby.memories` collection  
✅ **AI-Powered**: DALL-E 3 generates manga-style images
✅ **Local Storage**: Saves as `YYMMDD_panel-X.png` in `public/generated-panels/`
✅ **Database Updated**: imgUrl fields populated automatically

---

## How It Works

```
User ends chat → Memory created → Panels stored in MongoDB
                                          ↓
                              Auto-generate images for each panel
                                          ↓
                              Save as 251101_panel-1.png, etc.
                                          ↓
                              Update MongoDB with image URLs
```

---

## Example Memory Structure

```json
{
  "date": "2025-11-01",
  "panels": [
    {
      "id": "panel-1",
      "order": 0,
      "caption": "Your day began with unexpected academic pressure...",
      "style": "bw",
      "imgUrl": "https://oaidalleapiprodscus.blob.core.windows.net/..."
    }
  ]
}
```

---

## File Naming

| Date       | Panel | Filename           |
| ---------- | ----- | ------------------ |
| 2025-11-01 | 1     | 251101_panel-1.png |
| 2025-11-01 | 2     | 251101_panel-2.png |
| 2025-12-25 | 1     | 251225_panel-1.png |

Format: `YYMMDD_panel-X.png`

---

## API Usage

### Automatic (Recommended)

Already integrated! Just create a memory:

```bash
POST /api/memories
{
  "sessionId": "session_123",
  "date": "2025-11-01",
  "aiSummary": "...",
  "chatMessages": [...]
}
```

Images generate automatically!

### Manual Generation

Regenerate for existing memory:

```bash
POST /api/memories/generate-panels
{
  "date": "2025-11-01",
  "userId": "default"
}
```

### Check Status

```bash
GET /api/memories/generate-panels?date=2025-11-01
```

---

## Frontend Usage

```typescript
// Images are automatically in the memory
const response = await fetch("/api/memories?date=2025-11-01");
const { memory } = await response.json();

memory.panels.forEach((panel) => {
  console.log(panel.imgUrl); // Image URL populated!
});
```

### Display in React

```tsx
{
  memory.panels.map((panel) => (
    <div key={panel.id}>
      <img src={panel.imgUrl} alt={panel.altText} />
      <p>{panel.caption}</p>
    </div>
  ));
}
```

---

## Environment Setup

Required `.env` variables:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=curemebaby
OPENAI_API_KEY=sk-...
```

---

## Testing

```bash
# 1. Create a test memory
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_123",
    "date": "2025-11-01",
    "datetime": "2025-11-01T10:00:00Z",
    "timestamp": "November 1, 2025",
    "aiSummary": "A reflective day with calm moments.",
    "chatMessages": [
      {"role": "user", "content": "I feel peaceful today"}
    ]
  }'

# 2. Check the files
ls public/generated-panels/
# Should show: 251101_panel-1.png, 251101_panel-2.png, etc.

# 3. Verify in browser
open http://localhost:3000/generated-panels/251101_panel-1.png
```

---

## Timing

- **Single panel**: ~10-15 seconds
- **4 panels**: ~50-60 seconds (includes rate limit delays)

---

## Cost

**DALL-E 3 Standard Quality**

- $0.04 per image
- 4 panels/day × 30 days = 120 images = ~$5/month

---

## Files

| File                                         | Purpose                           |
| -------------------------------------------- | --------------------------------- |
| `/utils/panelImageGeneration.ts`             | Core image generation logic       |
| `/app/api/memories/route.ts`                 | Auto-generates on memory creation |
| `/app/api/memories/generate-panels/route.ts` | Manual generation endpoint        |
| `/public/generated-panels/`                  | Saved images                      |

---

## Troubleshooting

**Images not generating?**

- Check OPENAI_API_KEY is set
- Check rate limits (wait 2 seconds between panels)
- Check MongoDB connection

**Directory not found?**

- Run: `mkdir -p public/generated-panels`
- Directory auto-creates on first use

**Want to regenerate?**

- Use POST /api/memories/generate-panels
- Or delete memory and recreate

---

## Full Documentation

See [PANEL_IMAGE_GENERATION.md](./PANEL_IMAGE_GENERATION.md) for complete details.

---

**Ready to use! 🎨** The pipeline is fully functional and automatic.
