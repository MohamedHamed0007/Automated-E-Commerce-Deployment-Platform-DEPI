export const getCurrentISODate = (): string => new Date().toISOString();

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const dateDiffInDays = (startDate: Date | string, endDate: Date | string): number =>
  Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

export const formatLocalDate = (date: Date | string, locale: string = "en-US"): string =>
  new Date(date).toLocaleString(locale, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });