import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface ChatSummary {
  sessionId: string;
  date: string;
  timestamp: string;
  datetime: Date;
  summary: string;
  userId?: string;
  createdAt: Date;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(process.env.MONGODB_DB_NAME || "curemebaby");

  cachedClient = client;
  cachedDb = db;

  console.log("✅ Connected to MongoDB for chat summaries");
  return db;
}

// POST: Store AI summary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, summary, userId = "default" } = body;

    if (!sessionId || !summary) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: sessionId, summary",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const chatSummary: ChatSummary = {
      sessionId,
      date: now.toISOString().split("T")[0], // YYYY-MM-DD
      timestamp: now.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      datetime: now,
      summary,
      userId,
      createdAt: now,
    };

    const db = await connectToDatabase();
    const collection = db.collection<ChatSummary>("chat_summaries");

    const result = await collection.insertOne(chatSummary);

    console.log(`📝 Stored chat summary for session: ${sessionId}`);

    return NextResponse.json({
      success: true,
      sessionId,
      insertedId: result.insertedId,
      summary: chatSummary,
    });
  } catch (error: any) {
    console.error("Error storing chat summary:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to store chat summary",
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve chat summaries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default";
    const sessionId = searchParams.get("sessionId");
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") || "100");

    const db = await connectToDatabase();
    const collection = db.collection<ChatSummary>("chat_summaries");

    // Get specific summary by session ID
    if (sessionId) {
      const summary = await collection.findOne({ sessionId, userId });
      if (!summary) {
        return NextResponse.json(
          { success: false, error: "Summary not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, summary });
    }

    // Get summaries for specific date
    if (date) {
      const summaries = await collection
        .find({ date, userId })
        .sort({ datetime: -1 })
        .toArray();
      return NextResponse.json({
        success: true,
        summaries,
        count: summaries.length,
      });
    }

    // Get all summaries for user (sorted by date, newest first)
    const summaries = await collection
      .find({ userId })
      .sort({ datetime: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      summaries,
      count: summaries.length,
    });
  } catch (error: any) {
    console.error("Error retrieving chat summaries:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve chat summaries",
      },
      { status: 500 }
    );
  }
}
