/**
 * Utility generator ID ber-prefix (ala Stripe/Better-Auth)
 * Menggunakan Web Crypto bawaan Node.js 18+ / browser (0 dependency).
 *
 * Contoh:
 *   createId('prg') => 'prg_a9c1f2e3b4d5'
 *   createId('dsb') => 'dsb_8f0e1d2c3b4a'
 */
export type IdPrefix = 'prg' | 'dsb' | 'tx' | 'cert';

export function createId(prefix: IdPrefix, length = 12): string {
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, length);
  return `${prefix}_${rand}`;
}
