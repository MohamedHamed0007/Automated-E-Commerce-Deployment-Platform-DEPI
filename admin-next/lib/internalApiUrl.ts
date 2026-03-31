const INTERNAL_API_BASE =
  process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? "http://localhost:5000/api/v1";

export function buildInternalApiUrl(path: string) {
  return `${INTERNAL_API_BASE}${path}`;
}
