export function getAllMatches(str: string, pattern: RegExp): RegExpExecArray[] {
  // Ensure the regex has the global flag
  const globalPattern = new RegExp(
    pattern,
    pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
  );

  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;

  // Use exec in a loop to get all matches
  while ((match = globalPattern.exec(str)) !== null) {
    matches.push(match);
  }

  return matches;
}
