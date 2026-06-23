export const formatDateTitle = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
};
