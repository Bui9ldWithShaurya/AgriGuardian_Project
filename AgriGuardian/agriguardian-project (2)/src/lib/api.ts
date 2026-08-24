export const API_BASE = `${import.meta.env["VITE_BACKEND_URL"] ?? ""}/api`;

export type SensorReading = {
  timestamp: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rain_level: number;
  risk_level?: string;
  advice?: string;
};

export type Advisory = {
  risk_level: "urgent" | "caution" | "normal";
  summary: string;
  summary_hi: string;
  details?: { icon: string; message: string; message_hi: string }[];
  forecast_note?: { en: string; hi: string } | null;
};

export type SensorPayload = {
  latest?: SensorReading;
  advisory?: Advisory;
  history?: SensorReading[];
  forecast?: { date: string; precip_prob: number; precip_mm: number }[];
};

export async function fetchSensorData(params: Record<string, string | number>) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const res = await fetch(`${API_BASE}/sensor-data?${qs}`);
  if (!res.ok) throw new Error(`sensor-data ${res.status}`);
  return (await res.json()) as SensorPayload;
}

export async function sendAlert(body: { phone: string; message: string; risk_level?: string }) {
  const res = await fetch(`${API_BASE}/send-alert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`send-alert ${res.status}`);
  return (await res.json()) as { mocked?: boolean };
}
