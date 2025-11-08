export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

export const formatPokemonName = (name: string): string => {
  return capitalize(name.replace(/-/g, ' '));
};

export const formatStat = (stat: number | undefined): string => {
  if (stat === undefined || stat === null) return 'N/A';
  return stat.toString();
};

export const formatTypes = (types: Array<{ name: string }>): string => {
  return types.map((t) => capitalize(t.name)).join(', ');
};

export const formatId = (id: string | number): string => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) return String(id);
  return `#${String(numId).padStart(3, '0')}`;
};

