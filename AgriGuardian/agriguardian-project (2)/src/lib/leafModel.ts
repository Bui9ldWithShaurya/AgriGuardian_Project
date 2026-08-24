// Real trained-model integration (EfficientNetB3, ONNX) — logic preserved.
// onnxruntime-web is imported dynamically so it never loads during SSR.
import type * as OrtNS from "onnxruntime-web";

// --- Hugging Face hosted model files ---
const MODEL_URL =
  "https://huggingface.co/assassinloves/onnex-model/resolve/main/leaf_disease_efficientnetb3.onnx";
const CLASS_MAP_URL =
  "https://huggingface.co/assassinloves/onnex-model/resolve/main/class_mapping.json";
// ---------------------------------------------------------------

export type Prediction = {
  classIndex: number;
  className: string;
  confidence: number;
};

let ort: typeof OrtNS | null = null;
let session: OrtNS.InferenceSession | null = null;
let classMapping: Record<number, string> | null = null;

async function getOrt() {
  if (ort) return ort;
  const mod = await import("onnxruntime-web");
  // Serve WASM binaries from the matching CDN version.
  mod.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/";
  ort = mod;
  return ort;
}

export async function loadModel() {
  if (session) return session;

  const o = await getOrt();
  session = await o.InferenceSession.create(MODEL_URL, {
    executionProviders: ["wasm"],
  });
  const response = await fetch(CLASS_MAP_URL);
  classMapping = await response.json();
  return session;
}

function preprocessImage(imageElement: HTMLImageElement, o: typeof OrtNS) {
  const canvas = document.createElement("canvas");
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imageElement, 0, 0, 224, 224);
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const { data } = imageData;
  const floatData = new Float32Array(224 * 224 * 3);
  let pixelIndex = 0;
  for (let i = 0; i < data.length; i += 4) {
    floatData[pixelIndex * 3 + 0] = data[i] ?? 0;
    floatData[pixelIndex * 3 + 1] = data[i + 1] ?? 0;
    floatData[pixelIndex * 3 + 2] = data[i + 2] ?? 0;
    pixelIndex++;
  }
  return new o.Tensor("float32", floatData, [1, 224, 224, 3]);
}

export async function predictLeafDisease(imageElement: HTMLImageElement) {
  const o = await getOrt();

  if (!session) await loadModel();
  const s = session!;
  const inputTensor = preprocessImage(imageElement, o);
  const inputName = s.inputNames[0] as string;
  const feeds = { [inputName]: inputTensor };
  const results = await s.run(feeds);
  const outputName = s.outputNames[0] as string;
  const probabilities = results[outputName]!.data as Float32Array;
  const predictions: Prediction[] = Array.from(probabilities).map((prob, idx) => ({
    classIndex: idx,
    className: classMapping?.[idx] || `Unknown_${idx}`,
    confidence: Number(prob),
  }));
  predictions.sort((a, b) => b.confidence - a.confidence);
  return { topPrediction: predictions[0]!, allPredictions: predictions };
}

export function formatDiseaseResult(prediction: Prediction) {
  const [cropRaw, diseaseRaw] = prediction.className.split("___");
  const crop = (cropRaw ?? prediction.className).replace(/_/g, " ");
  const disease = (diseaseRaw || "").replace(/_/g, " ");
  const confidencePct = (prediction.confidence * 100).toFixed(1);
  if ((diseaseRaw || "").toLowerCase() === "healthy") {
    return {
      headline: `${crop} looks healthy`,
      detail: `No signs of disease detected (${confidencePct}% confidence).`,
      isHealthy: true,
      confidencePct,
      crop,
      disease: "",
    };
  }
  return {
    headline: `${crop}: ${disease}`,
    detail: `Detected with ${confidencePct}% confidence. Consider consulting a local agricultural extension for treatment options.`,
    isHealthy: false,
    confidencePct,
    crop,
    disease,
  };
}
