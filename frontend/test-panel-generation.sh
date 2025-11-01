#!/bin/bash

# Test script for panel image generation pipeline
# This tests the complete flow: Memory creation → Panel generation → Local storage

echo "🧪 Testing Panel Image Generation Pipeline"
echo "=========================================="
echo ""

# Configuration
BASE_URL="http://localhost:3000"
TEST_DATE="2025-11-01"
USER_ID="default"

echo "📋 Configuration:"
echo "  - Base URL: $BASE_URL"
echo "  - Test Date: $TEST_DATE"
echo "  - User ID: $USER_ID"
echo ""

# Step 1: Create a test memory
echo "Step 1: Creating test memory..."
echo "-------------------------------"

MEMORY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/memories" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_panel_gen_'$(date +%s)'",
    "date": "'$TEST_DATE'",
    "datetime": "'$TEST_DATE'T10:00:00Z",
    "timestamp": "November 1, 2025, 10:00:00 AM",
    "aiSummary": "Today was a day of reflection and growth. You faced challenges with courage and found moments of peace throughout the day.",
    "chatMessages": [
      {"role": "user", "content": "I had a challenging day but learned a lot"},
      {"role": "assistant", "content": "That sounds like a meaningful experience"}
    ],
    "userId": "'$USER_ID'"
  }')

echo "$MEMORY_RESPONSE" | jq '.' 2>/dev/null || echo "$MEMORY_RESPONSE"

# Check if successful
SUCCESS=$(echo "$MEMORY_RESPONSE" | jq -r '.success' 2>/dev/null)
if [ "$SUCCESS" != "true" ]; then
  echo "❌ Failed to create memory"
  exit 1
fi

echo ""
echo "✅ Memory created successfully!"
echo ""

# Extract panel generation status
PANELS_GENERATED=$(echo "$MEMORY_RESPONSE" | jq -r '.panelImagesGenerated' 2>/dev/null)
if [ "$PANELS_GENERATED" = "true" ]; then
  echo "✅ Panel images were generated automatically!"
else
  echo "⚠️  Panel images not generated (this is expected if it takes time)"
fi

echo ""

# Step 2: Check panel generation status
echo "Step 2: Checking panel generation status..."
echo "-------------------------------------------"

sleep 2  # Wait a bit for generation to complete

STATUS_RESPONSE=$(curl -s "$BASE_URL/api/memories/generate-panels?date=$TEST_DATE&userId=$USER_ID")

echo "$STATUS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATUS_RESPONSE"

TOTAL_PANELS=$(echo "$STATUS_RESPONSE" | jq -r '.totalPanels' 2>/dev/null)
PANELS_WITH_IMAGES=$(echo "$STATUS_RESPONSE" | jq -r '.panelsWithImages' 2>/dev/null)
IS_COMPLETE=$(echo "$STATUS_RESPONSE" | jq -r '.isComplete' 2>/dev/null)

echo ""
echo "📊 Status:"
echo "  - Total panels: $TOTAL_PANELS"
echo "  - Panels with images: $PANELS_WITH_IMAGES"
echo "  - Complete: $IS_COMPLETE"
echo ""

# Step 3: Check local files
echo "Step 3: Checking local files..."
echo "--------------------------------"

DATE_CODE="251101"  # YYMMDD for 2025-11-01
PANELS_DIR="public/generated-panels"

if [ -d "$PANELS_DIR" ]; then
  echo "✅ Panels directory exists"
  
  echo ""
  echo "Files in $PANELS_DIR:"
  ls -lh "$PANELS_DIR/${DATE_CODE}"*.png 2>/dev/null || echo "  (No files matching ${DATE_CODE}_panel-*.png found yet)"
  
  FILE_COUNT=$(ls "$PANELS_DIR/${DATE_CODE}"*.png 2>/dev/null | wc -l)
  echo ""
  echo "📁 Found $FILE_COUNT image files for date $TEST_DATE"
  
else
  echo "⚠️  Panels directory not found: $PANELS_DIR"
  echo "   Creating directory..."
  mkdir -p "$PANELS_DIR"
  echo "✅ Directory created"
fi

echo ""

# Step 4: Retrieve the memory with images
echo "Step 4: Retrieving memory with images..."
echo "----------------------------------------"

MEMORY_GET=$(curl -s "$BASE_URL/api/memories?date=$TEST_DATE&userId=$USER_ID")

echo "$MEMORY_GET" | jq '.memory.panels[] | {id: .id, hasImage: (.imgUrl != null), caption: .caption[:50]}' 2>/dev/null || echo "$MEMORY_GET"

echo ""

# Summary
echo "=========================================="
echo "🎉 Test Complete!"
echo "=========================================="
echo ""

if [ "$IS_COMPLETE" = "true" ]; then
  echo "✅ All panels have images"
  echo ""
  echo "View images at:"
  for i in {1..4}; do
    echo "  - http://localhost:3000/generated-panels/${DATE_CODE}_panel-${i}.png"
  done
else
  echo "⏳ Panel generation may still be in progress"
  echo ""
  echo "If generation is taking time, you can:"
  echo "  1. Wait a few minutes and re-run this script"
  echo "  2. Manually trigger generation:"
  echo "     curl -X POST $BASE_URL/api/memories/generate-panels \\"
  echo "       -H 'Content-Type: application/json' \\"
  echo "       -d '{\"date\": \"$TEST_DATE\", \"userId\": \"$USER_ID\"}'"
fi

echo ""
echo "📚 For more info, see PANEL_IMAGE_GENERATION.md"
echo ""

