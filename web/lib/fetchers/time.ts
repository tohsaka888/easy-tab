export type TimeResponse = {
  now: string;
};

export async function fetchTime() {
  const response = await fetch("/api/time");
  if (!response.ok) {
    throw new Error("Failed to fetch time");
  }
  return response.json() as Promise<TimeResponse>;
}
