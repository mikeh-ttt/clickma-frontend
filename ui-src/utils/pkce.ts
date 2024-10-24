function generateRandomString(length: number) {
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((byte) => String.fromCharCode(byte))
    .join('');
}

function base64UrlEncode(str: string) {
  return btoa(str)
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=+$/, ''); // Remove trailing '='
}

export const generateCodeVerifier = async (length = 32) => {
  return generateRandomString(length); // Generate a random string of 32 characters
};

export const generateCodeChallenge = async (verifier: string) => {
  // Encode the code verifier to UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  console.log({ c: window.crypto });
  // Hash the code verifier using SHA-256
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashString = hashArray
    .map((byte) => String.fromCharCode(byte))
    .join(''); // Convert byte array to string

  return base64UrlEncode(hashString); // Base64 URL encode the hash
};

export const isCodeVerifierValid = async (
  codeVerifier: string,
  codeChallenge: string
) => (await generateCodeChallenge(codeVerifier)) === codeChallenge;
