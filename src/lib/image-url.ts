export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // Keep absolute URLs intact in case the API already returns a full URL.
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) return path;

  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}
