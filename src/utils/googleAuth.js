/**
 * Google OAuth using Google Identity Services (GIS).
 * No Firebase required — uses the official google.accounts.oauth2 API.
 *
 * Requires:
 *   1) <script src="https://accounts.google.com/gsi/client"> in index.html
 *   2) VITE_GOOGLE_CLIENT_ID in .env
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Decode a JWT ID-token payload (base64url → JSON).
 */
function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * Opens the real Google sign-in popup and resolves with { email, name, avatar }.
 * Returns a Promise so callers can simply `await signInWithGoogle()`.
 */
export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id') {
      return reject(new Error(
        'Google Client ID is not configured. ' +
        'Please set VITE_GOOGLE_CLIENT_ID in your .env file. ' +
        'Get one from https://console.cloud.google.com/apis/credentials'
      ));
    }

    if (typeof google === 'undefined' || !google.accounts) {
      return reject(new Error(
        'Google Identity Services script not loaded. Check your internet connection.'
      ));
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        try {
          const payload = decodeJwtPayload(response.credential);
          resolve({
            email: payload.email,
            name: payload.name,
            avatar: payload.picture
          });
        } catch (err) {
          reject(new Error('Failed to decode Google credential'));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Show the One-Tap / account picker popup
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // Fallback: if One-Tap is blocked (e.g. incognito), use the button-based flow
        const tempBtn = document.createElement('div');
        tempBtn.id = '__google_signin_temp';
        tempBtn.style.position = 'fixed';
        tempBtn.style.top = '50%';
        tempBtn.style.left = '50%';
        tempBtn.style.transform = 'translate(-50%, -50%)';
        tempBtn.style.zIndex = '9999';
        document.body.appendChild(tempBtn);

        google.accounts.id.renderButton(tempBtn, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300
        });

        // Auto-click the rendered button
        setTimeout(() => {
          const btn = tempBtn.querySelector('[role="button"]') || tempBtn.querySelector('div[role="button"]');
          if (btn) btn.click();
        }, 100);

        // Clean up after a timeout
        setTimeout(() => {
          const el = document.getElementById('__google_signin_temp');
          if (el) el.remove();
        }, 60000);
      }

      if (notification.isSkippedMoment()) {
        // User dismissed the popup
        reject(new Error('Google sign-in was dismissed'));
      }
    });
  });
}
