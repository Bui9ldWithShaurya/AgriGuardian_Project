// Short, practical treatment steps for each PlantVillage disease class.
// Healthy classes intentionally have no entry (handled as "no treatment needed").
export const TREATMENTS: Record<string, { en: string; hi: string }> = {
  "Apple___Apple_scab": {
    en: "Rake and destroy fallen leaves. Apply a protectant fungicide (e.g. captan or mancozeb) from bud break through early leaf growth.",
    hi: "गिरी हुई पत्तियाँ हटाकर नष्ट करें। कली फूटने से लेकर नई पत्तियों तक फफूंदनाशी (जैसे कैप्टन/मैंकोज़ेब) का छिड़काव करें।",
  },
  "Apple___Black_rot": {
    en: "Prune out cankers and remove mummified fruit. Spray a fungicide during bloom and keep the tree clean of debris.",
    hi: "रोगग्रस्त टहनियाँ और सूखे फल हटा दें। फूल आने के समय फफूंदनाशी छिड़कें और पेड़ के आसपास सफाई रखें।",
  },
  "Apple___Cedar_apple_rust": {
    en: "Remove nearby juniper/cedar hosts if possible. Apply fungicide from bud break until early summer.",
    hi: "यदि संभव हो तो पास के जुनिपर/देवदार पौधे हटाएँ। कली फूटने से गर्मी की शुरुआत तक फफूंदनाशी लगाएँ।",
  },
  "Cherry_(including_sour)___Powdery_mildew": {
    en: "Improve airflow by pruning. Apply sulfur or a suitable fungicide at first signs of white powder.",
    hi: "छँटाई करके हवा का प्रवाह बढ़ाएँ। सफेद पाउडर दिखते ही सल्फर या उपयुक्त फफूंदनाशी का छिड़काव करें।",
  },
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    en: "Rotate crops and plant resistant hybrids. Apply a foliar fungicide if lesions spread rapidly.",
    hi: "फसल चक्र अपनाएँ और रोग-रोधी किस्में लगाएँ। धब्बे तेज़ी से फैलें तो पत्तियों पर फफूंदनाशी छिड़कें।",
  },
  "Corn_(maize)___Common_rust_": {
    en: "Grow resistant hybrids. Apply fungicide only if rust appears early and heavily.",
    hi: "रोग-रोधी किस्में उगाएँ। जंग जल्दी और अधिक दिखे तभी फफूंदनाशी का प्रयोग करें।",
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    en: "Use resistant hybrids and crop rotation. Apply fungicide at the first small lesions.",
    hi: "रोग-रोधी किस्में और फसल चक्र अपनाएँ। शुरुआती छोटे धब्बों पर ही फफूंदनाशी लगाएँ।",
  },
  "Grape___Black_rot": {
    en: "Remove infected berries and leaves. Spray fungicide from bud break through fruit set.",
    hi: "रोगग्रस्त फल और पत्तियाँ हटाएँ। कली फूटने से फल बनने तक फफूंदनाशी छिड़कें।",
  },
  "Grape___Esca_(Black_Measles)": {
    en: "Prune and destroy affected wood. Avoid large pruning wounds and protect cuts.",
    hi: "प्रभावित लकड़ी काटकर नष्ट करें। बड़े कटाव से बचें और कटे भाग को सुरक्षित रखें।",
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    en: "Improve canopy airflow. Apply a copper-based fungicide when spots first appear.",
    hi: "बेल की हवादारी बढ़ाएँ। धब्बे दिखते ही तांबा-आधारित फफूंदनाशी लगाएँ।",
  },
  "Orange___Haunglongbing_(Citrus_greening)": {
    en: "No cure exists. Remove and destroy infected trees and control psyllid insects that spread it.",
    hi: "इसका कोई इलाज नहीं है। संक्रमित पेड़ हटाकर नष्ट करें और फैलाने वाले सिल्लिड कीटों को नियंत्रित करें।",
  },
  "Peach___Bacterial_spot": {
    en: "Plant resistant varieties. Apply copper sprays during dormancy and avoid overhead watering.",
    hi: "रोग-रोधी किस्में लगाएँ। सुप्त अवस्था में तांबा छिड़कें और ऊपर से सिंचाई से बचें।",
  },
  "Pepper,_bell___Bacterial_spot": {
    en: "Use disease-free seed. Apply copper sprays and avoid working with wet plants.",
    hi: "रोगमुक्त बीज का प्रयोग करें। तांबा छिड़कें और गीले पौधों को छूने से बचें।",
  },
  "Potato___Early_blight": {
    en: "Remove lower infected leaves and mulch the soil. Apply mancozeb or chlorothalonil fungicide.",
    hi: "नीचे की रोगग्रस्त पत्तियाँ हटाएँ और मिट्टी पर मल्च डालें। मैंकोज़ेब या क्लोरोथैलोनिल छिड़कें।",
  },
  "Potato___Late_blight": {
    en: "Destroy infected plants quickly. Apply a protectant fungicide and keep foliage dry.",
    hi: "संक्रमित पौधे तुरंत नष्ट करें। सुरक्षात्मक फफूंदनाशी लगाएँ और पत्तियाँ सूखी रखें।",
  },
  "Squash___Powdery_mildew": {
    en: "Space plants for airflow. Spray sulfur or potassium bicarbonate at early signs.",
    hi: "हवादारी के लिए पौधों में दूरी रखें। शुरुआत में ही सल्फर या पोटैशियम बाइकार्बोनेट छिड़कें।",
  },
  "Strawberry___Leaf_scorch": {
    en: "Remove old infected leaves after harvest. Apply fungicide and avoid overhead irrigation.",
    hi: "कटाई के बाद पुरानी रोगग्रस्त पत्तियाँ हटाएँ। फफूंदनाशी लगाएँ और ऊपर से सिंचाई से बचें।",
  },
  "Tomato___Bacterial_spot": {
    en: "Use certified seed. Apply copper sprays and avoid handling plants when wet.",
    hi: "प्रमाणित बीज का प्रयोग करें। तांबा छिड़कें और गीले पौधों को छूने से बचें।",
  },
  "Tomato___Early_blight": {
    en: "Remove affected lower leaves and mulch. Apply chlorothalonil or mancozeb fungicide.",
    hi: "नीचे की प्रभावित पत्तियाँ हटाएँ और मल्च डालें। क्लोरोथैलोनिल या मैंकोज़ेब छिड़कें।",
  },
  "Tomato___Late_blight": {
    en: "Remove and destroy infected plants immediately. Apply a protectant fungicide.",
    hi: "संक्रमित पौधे तुरंत हटाकर नष्ट करें। सुरक्षात्मक फफूंदनाशी का छिड़काव करें।",
  },
  "Tomato___Leaf_Mold": {
    en: "Increase ventilation and lower humidity. Apply a suitable fungicide and space plants.",
    hi: "हवादारी बढ़ाएँ और नमी घटाएँ। उपयुक्त फफूंदनाशी लगाएँ और पौधों में दूरी रखें।",
  },
  "Tomato___Septoria_leaf_spot": {
    en: "Remove infected lower leaves and mulch soil. Apply fungicide and rotate crops.",
    hi: "नीचे की रोगग्रस्त पत्तियाँ हटाएँ और मल्च डालें। फफूंदनाशी लगाएँ और फसल चक्र अपनाएँ।",
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    en: "Spray plants with water or neem oil; use a miticide if severe. Raising humidity helps.",
    hi: "पौधों पर पानी या नीम तेल छिड़कें; अधिक होने पर माइटिसाइड लगाएँ। नमी बढ़ाना भी मदद करता है।",
  },
  "Tomato___Target_Spot": {
    en: "Improve airflow and remove plant debris. Apply a fungicide when spots appear.",
    hi: "हवादारी बढ़ाएँ और पौधों का कचरा हटाएँ। धब्बे दिखने पर फफूंदनाशी छिड़कें।",
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    en: "Control whiteflies that spread it. Remove infected plants and use resistant varieties.",
    hi: "इसे फैलाने वाली सफेद मक्खी को नियंत्रित करें। संक्रमित पौधे हटाएँ और रोग-रोधी किस्में लगाएँ।",
  },
  "Tomato___Tomato_mosaic_virus": {
    en: "Remove infected plants. Disinfect tools and wash hands; plant resistant, certified seed.",
    hi: "संक्रमित पौधे हटाएँ। औज़ार कीटाणुरहित करें और हाथ धोएँ; रोग-रोधी प्रमाणित बीज लगाएँ।",
  },
};

export function getTreatment(className: string, lang: string) {
  const t = TREATMENTS[className];
  if (!t) return null;
  return (t as Record<string, string>)[lang] || t.en;
}
