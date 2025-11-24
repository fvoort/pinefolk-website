const slugify = require('slugify');

/**
 * Converts human readable tokens into tailwind config friendly ones
 * Supports infinitely nested token structures and token references
 *
 * @param {array} tokens {name: string, value: any, items?: array}
 * @param {string} prefix - Internal parameter for recursion
 * @param {object} tokenMap - Map of all available tokens for reference resolution
 * @return {object} {key, value}
 */
const tokensToTailwind = (tokens, prefix = '', tokenMap = null) => {
  const nameSlug = text => slugify(text, {lower: true});

  // First pass: build the token map if this is the initial call
  if (tokenMap === null) {
    tokenMap = {};
    buildTokenMap(tokens, tokenMap);
  }

  let response = {};

  tokens.forEach(({name, value, items}) => {
    // Build the key, adding prefix if we're in a nested structure
    const key = prefix ? `${prefix}-${nameSlug(name)}` : nameSlug(name);

    // If this token has nested items, recurse into them
    if (items && Array.isArray(items)) {
      // Recursively process nested items with the current key as prefix
      Object.assign(response, tokensToTailwind(items, key, tokenMap));
    }
    // Otherwise, it's a leaf node with a value
    else if (value !== undefined) {
      // Resolve the value if it's a reference to another token
      response[key] = resolveReference(value, tokenMap, key);
    }
  });

  return response;
};

/**
 * Builds a flat map of all tokens for reference lookup
 * Maps human-readable names to their slugified keys
 * @param {array} tokens
 * @param {object} map
 * @param {string} prefix
 */
const buildTokenMap = (tokens, map, prefix = '') => {
  const nameSlug = text => slugify(text, {lower: true});

  tokens.forEach(({name, value, items}) => {
    const key = prefix ? `${prefix}-${nameSlug(name)}` : nameSlug(name);

    if (items && Array.isArray(items)) {
      buildTokenMap(items, map, key);
    } else if (value !== undefined) {
      // Map the human-readable name to the slugified key
      // This allows "White" or "Grey 100" to resolve to "white" or "grey-100"
      const humanReadableName = prefix ? `${prefix} ${name}` : name;
      const lookupKey = slugify(humanReadableName, {lower: true});
      map[lookupKey] = key;
    }
  });
};

/**
 * Resolves a value that might be a reference to another token
 * Returns a CSS variable reference if it's a token reference,
 * otherwise returns the raw value
 * @param {string} value
 * @param {object} tokenMap
 * @param {string} currentKey - The key of the current token (to avoid self-reference)
 * @return {string}
 */
const resolveReference = (value, tokenMap, currentKey) => {
  // If the value is not a string, return as-is
  if (typeof value !== 'string') {
    return value;
  }

  // If the value looks like a direct CSS value, return as-is
  if (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value.startsWith('var(')
  ) {
    return value;
  }

  // Check if it's a reference to another token
  const slugifiedRef = slugify(value, {lower: true});

  if (tokenMap[slugifiedRef] && tokenMap[slugifiedRef] !== currentKey) {
    // Return a CSS variable reference to the referenced token
    const referencedKey = tokenMap[slugifiedRef];
    return `var(--color-${referencedKey})`;
  }

  // If no match found, return the original value
  return value;
};

module.exports = tokensToTailwind;
