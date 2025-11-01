import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  // Dynamically determine base URL from request, or use environment variable
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${requestUrl.protocol}//${requestUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  console.log('OAuth callback - Base URL:', baseUrl);
  console.log('OAuth callback - Redirect URI:', redirectUri);

  if (error) {
    console.error('Google OAuth error from callback:', error);
    // Handle specific Google OAuth errors
    if (error === 'redirect_uri_mismatch') {
      return NextResponse.redirect(new URL('/login?error=redirect_uri_mismatch', request.url));
    }
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!clientId || !clientSecret) {
    console.error('Google OAuth credentials not configured');
    console.error('Client ID exists:', !!clientId);
    console.error('Client Secret exists:', !!clientSecret);
    return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url));
  }

  if (!code) {
    console.error('No authorization code received from Google OAuth');
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  const client = new OAuth2Client(clientId, clientSecret, redirectUri);

  try {
    console.log('Exchanging authorization code for tokens...');
    const { tokens } = await client.getToken(code);
    console.log('Tokens received, has ID token:', !!tokens.id_token);
    
    if (!tokens.id_token) {
      console.error('No ID token in response');
      throw new Error('No ID token received');
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Failed to verify token');
    }

    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      id: payload.sub,
    };

    // Redirect to home with success
    const response = NextResponse.redirect(new URL('/?auth=success', request.url));
    
    // Set auth token in cookie
    if (tokens.id_token) {
      response.cookies.set('authToken', tokens.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Also set user data in a non-httpOnly cookie for client-side access
      response.cookies.set('userData', JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'oauth_failed')}`, request.url)
    );
  }
}

