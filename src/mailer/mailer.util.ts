import * as crypto from 'crypto';

export function generateOtp(): string {
  // Generate a random integer between 100000 and 999999 (inclusive)
  const otp = crypto.randomInt(100000, 1000000);

  // Convert to a string with leading zeros if necessary
  return otp.toString().padStart(6, '0');
}
