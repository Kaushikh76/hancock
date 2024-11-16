import { decode, encode } from 'base-64';
import { TextDecoder, TextEncoder } from 'text-encoding';


// Ensure TextEncoder/Decoder exist
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// polyfills.js


// Export something to make TypeScript happy
export default {};