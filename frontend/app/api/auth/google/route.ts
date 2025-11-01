import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  // Dynamically determine base URL from request, or use environment variable
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${requestUrl.protocol}//${requestUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  console.log('Environment check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length || 0,
    baseUrl,
    redirectUri,
  });

  if (!clientId || !clientSecret) {
    console.error('Google OAuth credentials not configured');
    console.error('Client ID:', clientId ? 'EXISTS' : 'MISSING');
    console.error('Client Secret:', clientSecret ? 'EXISTS' : 'MISSING');
    return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url));
  }

  const client = new OAuth2Client(clientId, clientSecret, redirectUri);

  // Generate OAuth URL
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    prompt: 'consent',
  });

  return NextResponse.redirect(authUrl);
}

