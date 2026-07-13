/**
 * Google OAuth using Google Identity Services (GIS) — OAuth2 Token Flow.
 * Opens a real Google consent popup window (not One Tap).
 *
 * Requires:
 *   1) <script src="https://accounts.google.com/gsi/client"> in index.html
 *   2) VITE_GOOGLE_CLIENT_ID in .env
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Opens the real Google OAuth consent popup and resolves with { email, name, avatar }.
 */
export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id') {
      return reject(new Error(
        'Google Client ID is not configured. Set VITE_GOOGLE_CLIENT_ID in your .env file.'
      ));
    }

    if (typeof google === 'undefined' || !google.accounts) {
      return reject(new Error(
        'Google Identity Services script not loaded. Check your internet connection.'
      ));
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          return reject(new Error(tokenResponse.error));
        }

        try {
          // Use the access token to fetch user info from Google
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });

          if (!res.ok) {
            return reject(new Error('Failed to fetch Google user info'));
          }

          const userInfo = await res.json();

          resolve({
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture
          });
        } catch (err) {
          reject(new Error('Failed to get user info from Google'));
        }
      },
      error_callback: (err) => {
        if (err.type === 'popup_closed') {
          reject(new Error('Google sign-in was dismissed'));
        } else {
          reject(new Error(err.message || 'Google OAuth error'));
        }
      }
    });

    // This opens the actual Google consent/account picker popup
    tokenClient.requestAccessToken();
  });
}
