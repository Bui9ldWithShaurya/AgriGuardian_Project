// Demo farm data used by the AgriGuardian dashboard views.
export const FARMS = ["Green Valley Farm", "Sunrise Fields", "Blue Ridge Estate"] as const;

export type SensorMetric = {
  key: string;
  label: string;
  value: string;
  unit: string;
  status: "OPTIMAL" | "HIGH" | "LOW";
  pct: number;
};

export const SENSORS: SensorMetric[] = [
  { key: "moisture", label: "Soil Moisture", value: "42", unit: "%", status: "OPTIMAL", pct: 42 },
  { key: "soilTemp", label: "Soil Temp", value: "24", unit: "°C", status: "OPTIMAL", pct: 58 },
  { key: "airTemp", label: "Air Temp", value: "31", unit: "°C", status: "HIGH", pct: 78 },
  { key: "humidity", label: "Humidity", value: "67", unit: "%", status: "OPTIMAL", pct: 67 },
  { key: "ph", label: "Soil pH", value: "6.8", unit: "", status: "OPTIMAL", pct: 68 },
  { key: "light", label: "Light", value: "52,400", unit: "lx", status: "OPTIMAL", pct: 72 },
];

export type CropInfo = {
  key: string;
  name: string;
  scientific: string;
  status: "ACTIVE" | "PLANNING";
  stage: string;
  day: number;
  cycle: number;
  water: string;
  temp: string;
  insight: string;
};

export const CROP_LIBRARY: CropInfo[] = [
  {
    key: "tomato",
    name: "Tomato",
    scientific: "Solanum lycopersicum",
    status: "ACTIVE",
    stage: "Fruiting Stage",
    day: 67,
    cycle: 120,
    water: "Moderate",
    temp: "21-27°C",
    insight:
      "During the Fruiting Stage, the plant requires high potassium to support fruit development. Reduce nitrogen to prevent excessive leaf growth at the expense of fruit. Monitor closely for Early Blight due to dense canopy trapping humidity.",
  },
  {
    key: "wheat",
    name: "Wheat",
    scientific: "Triticum aestivum",
    status: "PLANNING",
    stage: "Tillering Stage",
    day: 24,
    cycle: 145,
    water: "Low",
    temp: "12-22°C",
    insight:
      "Tillering determines final head count. Apply the first split nitrogen dose now and keep soil moisture steady — water stress at this stage permanently reduces tiller survival.",
  },
  {
    key: "rice",
    name: "Rice",
    scientific: "Oryza sativa",
    status: "PLANNING",
    stage: "Vegetative Stage",
    day: 31,
    cycle: 135,
    water: "High",
    temp: "22-32°C",
    insight:
      "Maintain 3-5 cm standing water and watch for stem borer. Zinc deficiency is common on alkaline soils — a foliar spray corrects yellowing within a week.",
  },
  {
    key: "cotton",
    name: "Cotton",
    scientific: "Gossypium hirsutum",
    status: "PLANNING",
    stage: "Squaring Stage",
    day: 48,
    cycle: 180,
    water: "Moderate",
    temp: "25-35°C",
    insight:
      "Square retention drives yield. Scout twice weekly for pink bollworm and avoid excess nitrogen, which pushes rank vegetative growth and delays boll set.",
  },
  {
    key: "maize",
    name: "Maize",
    scientific: "Zea mays",
    status: "PLANNING",
    stage: "Knee-High Stage",
    day: 35,
    cycle: 110,
    water: "Moderate",
    temp: "18-30°C",
    insight:
      "Rapid biomass accumulation begins now. Side-dress nitrogen and ensure no moisture deficit two weeks either side of tasselling — that window sets kernel number.",
  },
  {
    key: "potato",
    name: "Potato",
    scientific: "Solanum tuberosum",
    status: "PLANNING",
    stage: "Tuber Initiation",
    day: 42,
    cycle: 100,
    water: "Moderate",
    temp: "15-22°C",
    insight:
      "Keep soil consistently moist to avoid misshapen tubers. High humidity plus mild temperatures raise Late Blight risk — begin a protectant spray schedule.",
  },
  {
    key: "onion",
    name: "Onion",
    scientific: "Allium cepa",
    status: "PLANNING",
    stage: "Bulb Formation",
    day: 58,
    cycle: 150,
    water: "Low",
    temp: "13-24°C",
    insight:
      "Stop nitrogen application as bulbing starts; late nitrogen causes thick necks and poor storage. Watch for thrips during dry, warm spells.",
  },
];

export type AlertSeverity = "critical" | "warning" | "info" | "success";

export type FarmAlert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  time: string;
  plot: string;
  metrics: { label: string; value: string }[];
  action: string;
  read?: boolean;
};

export const ALERTS: FarmAlert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Soil Moisture Critical: 18%",
    detail: "Immediate irrigation required",
    time: "2 min ago",
    plot: "Plot A4",
    metrics: [
      { label: "Soil Moisture", value: "18%" },
      { label: "Threshold", value: "30%" },
      { label: "Soil Temp", value: "27°C" },
    ],
    action: "Trigger Irrigation Now",
  },
  {
    id: "a2",
    severity: "critical",
    title: "Disease Detected: Early Blight",
    detail: "Plot A4 shows symptoms of early blight",
    time: "15 min ago",
    plot: "Plot A4",
    metrics: [
      { label: "Confidence", value: "89.3%" },
      { label: "Affected Area", value: "23%" },
      { label: "Humidity", value: "78%" },
    ],
    action: "Open Disease Detection View",
  },
  {
    id: "a3",
    severity: "warning",
    title: "High Temperature: 38°C",
    detail: "Exceeding safe threshold for current crop",
    time: "1 hr ago",
    plot: "Plot B1",
    metrics: [
      { label: "Air Temp", value: "38°C" },
      { label: "Safe Max", value: "34°C" },
      { label: "Humidity", value: "51%" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a4",
    severity: "warning",
    title: "Water Tank Level: 22%",
    detail: "Refill recommended before next cycle",
    time: "3 hrs ago",
    plot: "Reservoir 1",
    metrics: [
      { label: "Tank Level", value: "22%" },
      { label: "Capacity", value: "12,000 L" },
      { label: "Next Cycle", value: "In 9 hrs" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a5",
    severity: "warning",
    title: "Pest Risk Elevated",
    detail: "Aphid activity detected in nearby regions",
    time: "5 hrs ago",
    plot: "Plot C2",
    metrics: [
      { label: "Regional Risk", value: "High" },
      { label: "Trap Count", value: "34 / week" },
      { label: "Wind", value: "8 km/h" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a6",
    severity: "info",
    title: "Rain Expected: 12mm",
    detail: "In 36 hours — Adjust irrigation schedule",
    time: "2 hrs ago",
    plot: "Whole farm",
    metrics: [
      { label: "Probability", value: "90%" },
      { label: "Volume", value: "12 mm" },
      { label: "Window", value: "Thu 04:00" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a7",
    severity: "info",
    title: "AI Recommendation",
    detail: "New fertilizer schedule available",
    time: "6 hrs ago",
    plot: "Plot A4",
    metrics: [
      { label: "Formula", value: "NPK 10-26-26" },
      { label: "Confidence", value: "92%" },
      { label: "Window", value: "48 hrs" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a8",
    severity: "info",
    title: "Harvest Window",
    detail: "Tomatoes approaching optimal harvest",
    time: "1 day ago",
    plot: "Plot A4",
    metrics: [
      { label: "Days to Harvest", value: "53" },
      { label: "Brix Estimate", value: "4.8" },
      { label: "Yield Forecast", value: "4.2 t/ha" },
    ],
    action: "Apply AI Recommendation",
  },
  {
    id: "a9",
    severity: "success",
    title: "Irrigation Completed",
    detail: "Plot B2 — 28L/m² applied",
    time: "4 hrs ago",
    plot: "Plot B2",
    metrics: [
      { label: "Applied", value: "28 L/m²" },
      { label: "Duration", value: "42 min" },
      { label: "Moisture After", value: "44%" },
    ],
    action: "Trigger Irrigation Now",
  },
  {
    id: "a10",
    severity: "success",
    title: "Disease Treatment Applied",
    detail: "Fungicide schedule active",
    time: "8 hrs ago",
    plot: "Plot A4",
    metrics: [
      { label: "Product", value: "Copper oxychloride" },
      { label: "Cycle", value: "1 of 3" },
      { label: "Next Spray", value: "In 7 days" },
    ],
    action: "Open Disease Detection View",
  },
];
