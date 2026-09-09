export function formatAppTitle(name: string): string {
  if (!name.trim()) {
    return "UNTITLED";
  }
  return name.trim().toUpperCase();
}
