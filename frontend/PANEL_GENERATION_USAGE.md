# Panel Image Generation - Usage Guide 🎨

Visual guide for using the MongoDB-powered panel image generation system.

---

## 🔄 The Complete Flow

```
┌──────────────────────────┐
│   User has therapy       │
│   chat conversation      │
└───────────┬──────────────┘
            │
            ↓
┌──────────────────────────┐
│   User clicks            │
│   "End Chat & Summary"   │
└───────────┬──────────────┘
            │
            ↓
┌──────────────────────────┐
│   System generates       │
│   AI summary             │
└───────────┬──────────────┘
            │
            ↓
┌──────────────────────────┐
│   Memory created in      │
│   MongoDB with panels    │
└───────────┬──────────────┘
            │
            ↓
┌──────────────────────────┐
│   ⚡ AUTO GENERATION ⚡   │
│                          │
│   For each panel:        │
│   1. Read caption        │
│   2. Generate image      │
│   3. Save as PNG         │
│   4. Update MongoDB      │
└───────────┬──────────────┘
            │
            ↓
┌──────────────────────────┐
│   ✅ Memory ready with   │
│   beautiful manga art!   │
└──────────────────────────┘
```

---

## 📝 Step-by-Step Example

### 1. User Has a Chat Session

```
User: "Today was stressful. I had a big exam."
AI: "That sounds challenging. How did you cope?"
User: "I took breaks and talked to friends."
AI: "Great coping strategies! You should feel proud."
```

### 2. System Creates Memory in MongoDB

```javascript
// Memory stored in curemebaby.memories
{
  date: "2025-11-01",
  panels: [
    {
      id: "panel-1",
      caption: "The morning began with anxiety about the exam",
      imgUrl: null  // Not yet generated
    },
    {
      id: "panel-2",
      caption: "Taking breaks helped restore focus",
      imgUrl: null
    }
  ]
}
```

### 3. System Auto-Generates Images

```bash
# Console output:
🚀 Starting image generation for 2 panels...
🎨 Generating image for panel-1...
✅ Generated image for panel-1
💾 Saved image to /path/to/251101_panel-1.png
⏳ Waiting 2 seconds before next generation...
🎨 Generating image for panel-2...
✅ Generated image for panel-2
💾 Saved image to /path/to/251101_panel-2.png
✨ Completed image generation. Success: 2/2
```

### 4. MongoDB Updated with Image URLs

```javascript
// Updated memory in curemebaby.memories
{
  date: "2025-11-01",
  panels: [
    {
      id: "panel-1",
      caption: "The morning began with anxiety about the exam",
      imgUrl: "https://oaidalleapiprodscus.blob.core.windows.net/..." ✅
    },
    {
      id: "panel-2",
      caption: "Taking breaks helped restore focus",
      imgUrl: "https://oaidalleapiprodscus.blob.core.windows.net/..." ✅
    }
  ]
}
```

### 5. Files Saved Locally

```
frontend/public/generated-panels/
├── 251101_panel-1.png  ✅
├── 251101_panel-2.png  ✅
├── 251101_panel-3.png  ✅
└── 251101_panel-4.png  ✅
```

### 6. Display in Frontend

```tsx
// Automatically available in your React components!
function MemoryViewer({ date }) {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    fetch(`/api/memories?date=${date}`)
      .then(res => res.json())
      .then(data => setMemory(data.memory));
  }, [date]);

  if (!memory) return <div>Loading...</div>;

  return (
    <div className="manga-reader">
      {memory.panels.map(panel => (
        <div key={panel.id} className="panel">
          <img
            src={panel.imgUrl}  {/* ✨ Image URL already populated! */}
            alt={panel.altText}
            className="manga-panel-image"
          />
          <p>{panel.caption}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Real Data Example

Based on your sample data structure:

### Input (MongoDB Document)

```json
{
  "date": "2025-11-01",
  "mood": {
    "primary": "calm"
  },
  "panels": [
    {
      "id": "panel-1",
      "order": 0,
      "caption": "Your day began with unexpected academic pressure that left the class rattled, yet you quickly organized a study sprint, turning chaos into clear action",
      "style": "bw",
      "imgUrl": null
    }
  ]
}
```

### Generated Prompt (Sent to DALL-E 3)

```
Create a single manga panel illustration:

Scene: Your day began with unexpected academic pressure that left
the class rattled, yet you quickly organized a study sprint,
turning chaos into clear action

Art style: black and white manga style with screen tones and
hatching, Japanese manga/anime aesthetic, expressive character
emotions showing calm mood, clean linework, professional manga
artist quality, dynamic composition, detailed backgrounds.

Note: This is a therapeutic reflection panel, keep tone
respectful and emotionally supportive.
```

### Output (Updated MongoDB)

```json
{
  "date": "2025-11-01",
  "mood": {
    "primary": "calm"
  },
  "panels": [
    {
      "id": "panel-1",
      "order": 0,
      "caption": "Your day began with unexpected academic pressure...",
      "style": "bw",
      "imgUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-..."
    }
  ],
  "status": "generated",
  "updatedAt": "2025-11-01T20:35:00Z"
}
```

### Local File

```
frontend/public/generated-panels/251101_panel-1.png
```

**Accessible at:**

```
http://localhost:3000/generated-panels/251101_panel-1.png
```

---

## 🧪 Testing It Out

### Quick Test (Using Existing Chat)

```bash
# 1. Start your dev server
npm run dev

# 2. Go to the chat page
open http://localhost:3000/chatme

# 3. Have a conversation
# 4. Click "End Chat & Get Summary"
# 5. Wait ~60 seconds for 4 panels to generate
# 6. Check the files:

ls public/generated-panels/
```

### Test with API (Without UI)

```bash
# Create a memory with the API
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_api",
    "date": "2025-11-01",
    "datetime": "2025-11-01T10:00:00Z",
    "timestamp": "November 1, 2025, 10:00 AM",
    "aiSummary": "Today I faced challenges with courage and found peace.",
    "chatMessages": [
      {
        "role": "user",
        "content": "I had a stressful day but managed well"
      }
    ],
    "userId": "default"
  }'

# Wait ~60 seconds for generation...

# Check the result
curl http://localhost:3000/api/memories?date=2025-11-01

# View the images
open http://localhost:3000/generated-panels/251101_panel-1.png
```

---

## 📊 What to Expect

### Timing

| Panels | Time Required |
| ------ | ------------- |
| 1      | ~15 seconds   |
| 2      | ~30 seconds   |
| 4      | ~60 seconds   |
| 6      | ~90 seconds   |

_Includes 2-second delays between generations_

### File Sizes

- Standard quality: ~500KB - 2MB per image
- HD quality: ~1MB - 4MB per image

### Image Quality

**Standard Quality (Default):**

- Good for web display
- Fast generation
- Lower cost ($0.04/image)

**HD Quality (Optional):**

- Higher detail
- Better for printing
- Higher cost ($0.08/image)

---

## 🎨 Image Style Examples

### Black & White (bw)

```
Style: "bw"
→ Traditional manga with screen tones, hatching, high contrast
```

### Halftone

```
Style: "halftone"
→ Manga with halftone dots, newspaper-style shading
```

### Color Accent

```
Style: "colorAccent"
→ Mostly B&W with selective pops of color
```

---

## 🔍 Monitoring Progress

### Check Server Logs

```bash
# You'll see logs like:
📸 Generating images for 4 panels (date: 2025-11-01)...
🚀 Starting image generation for 4 panels...
🎨 Generating image for panel-1...
✅ Generated image for panel-1
💾 Saved image to /path/to/251101_panel-1.png
⏳ Waiting 2 seconds before next generation...
...
✅ Panel images generated and stored for 2025-11-01
```

### Check API Response

```javascript
// Response includes generation status
{
  success: true,
  memory: {...},
  panelImagesGenerated: true,  // ← Check this!
  panelResults: [
    {
      panelId: "panel-1",
      imageUrl: "https://...",
      localPath: "/path/to/251101_panel-1.png"
    }
  ]
}
```

### Check Status Endpoint

```bash
curl http://localhost:3000/api/memories/generate-panels?date=2025-11-01

# Returns:
{
  "totalPanels": 4,
  "panelsWithImages": 4,
  "isComplete": true  // ← All done!
}
```

---

## 💡 Pro Tips

### Tip 1: Monitor First Generation

```bash
# Watch the logs in real-time
npm run dev | grep -E "🎨|✅|💾"
```

### Tip 2: Regenerate if Needed

```bash
# Don't like a panel? Regenerate all panels:
curl -X POST http://localhost:3000/api/memories/generate-panels \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-01"}'
```

### Tip 3: Use HD for Special Memories

```javascript
// In your code, specify HD quality:
await fetch("/api/memories/generate-panels", {
  method: "POST",
  body: JSON.stringify({
    date: memory.date,
    options: {
      quality: "hd", // Higher quality for special memories
    },
  }),
});
```

### Tip 4: Check Generated Files

```bash
# See all generated images
ls -lh public/generated-panels/

# Find images for specific date
ls public/generated-panels/251101*
```

---

## 🐛 Common Issues

### Issue: "No images generated"

**Check:**

1. Is `OPENAI_API_KEY` set in `.env.local`?
2. Is MongoDB connected?
3. Check server logs for errors

**Quick Fix:**

```bash
# Manually trigger generation
curl -X POST http://localhost:3000/api/memories/generate-panels \
  -d '{"date": "2025-11-01"}'
```

### Issue: "Taking too long"

**This is normal!**

- 4 panels = ~60 seconds
- DALL-E 3 takes 10-15 seconds per image
- 2-second delays between panels

**What to do:**

- Be patient
- Check server logs to see progress
- Images are generated one at a time

### Issue: "Directory not found"

**Quick Fix:**

```bash
mkdir -p frontend/public/generated-panels
```

### Issue: "Rate limit error"

**What it means:**

- Too many requests to DALL-E API
- Need to wait before generating more

**What to do:**

- Wait a few minutes
- Try again
- Consider spreading generation over time

---

## 📱 Frontend Integration Examples

### Simple Gallery

```tsx
function MemoryGallery({ date }) {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    fetch(`/api/memories?date=${date}`)
      .then((r) => r.json())
      .then((d) => setMemory(d.memory));
  }, [date]);

  return (
    <div className="gallery">
      {memory?.panels.map((panel) => (
        <img key={panel.id} src={panel.imgUrl} />
      ))}
    </div>
  );
}
```

### With Loading States

```tsx
function MangaPanel({ panel }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="panel">
      {!loaded && <div className="skeleton">Loading...</div>}
      <img
        src={panel.imgUrl}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? "block" : "none" }}
      />
      <p>{panel.caption}</p>
    </div>
  );
}
```

### Manga Book View

```tsx
function MangaBook({ date }) {
  return (
    <div className="manga-book">
      <div className="left-page">
        <img src={`/generated-panels/${dateCode}_panel-1.png`} />
        <img src={`/generated-panels/${dateCode}_panel-2.png`} />
      </div>
      <div className="right-page">
        <img src={`/generated-panels/${dateCode}_panel-3.png`} />
        <img src={`/generated-panels/${dateCode}_panel-4.png`} />
      </div>
    </div>
  );
}
```

---

## 🎉 You're All Set!

The panel image generation system is ready to use!

**Key Points:**

- ✅ **Automatic**: Runs when memories are created
- ✅ **MongoDB-powered**: Reads from `curemebaby.memories`
- ✅ **DALL-E 3**: Beautiful manga-style art
- ✅ **Local storage**: YYMMDD_panel-X.png format
- ✅ **Easy access**: Available via URL or panel.imgUrl

**Next Steps:**

1. Test it out with a chat session
2. View generated images in browser
3. Integrate into your manga reader component
4. Enjoy beautiful AI-generated memory art! 🎨✨

**Need Help?**

- See `PANEL_IMAGE_GENERATION.md` for technical details
- See `PANEL_GENERATION_QUICKSTART.md` for quick reference
- Run `./test-panel-generation.sh` to test
