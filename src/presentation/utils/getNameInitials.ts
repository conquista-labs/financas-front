export const getNameInitials = (name: string): string => {
  if (!name || !name.trim()) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  const firstLetter = words[0][0].toUpperCase();
  const lastLetter = words[words.length - 1][0].toUpperCase();

  return `${firstLetter}${lastLetter}`;
};
