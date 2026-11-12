const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Small counts as words ("seven"), larger ones as digits, for headings that read like prose. */
export function inWords(n: number, capitalise = false): string {
  const word = NUMBER_WORDS[n] ?? String(n);
  return capitalise ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}
