const annDevice = "/assets/ann-device.jpg";
const annApi = "/assets/ann-api.jpg";
const annMethod = "/assets/ann-method.jpg";
const annSubsidy = "/assets/ann-subsidy.jpg";
const annClient = "/assets/ann-client.jpg";

const itemCola = "/assets/item-cola.png";
const itemNoodles = "/assets/item-noodles.png";
const itemBar = "/assets/item-bar.png";
const itemYogurt = "/assets/item-yogurt.png";
const itemChips = "/assets/item-chips.png";
const itemCereal = "/assets/item-cereal.png";

export type Announcement = {
  tag: string;
  title: string;
  body: string;
  image: string;
};

export const announcements: Announcement[] = [
  {
    tag: "Partnership",
    title: "LabelTruth partners with an upcoming nutrition tracking device",
    body: "TechForges' wearable nutrition tracker will stream real-time intake data into LabelTruth scoring, pairing what you eat with how the pack was scored.",
    image: annDevice,
  },
  {
    tag: "Platform",
    title: "LabelTruth starts its API Program",
    body: "Any app, retailer or device maker can now send a label image to LabelTruth and receive a verdict, a P:C ratio, a trust score and confidence bands.",
    image: annApi,
  },
  {
    tag: "Research",
    title: "LabelTruth has its own methodology to evaluate facts",
    body: "The Product-to-Claim ratio grades a pack against its own marketing using ingredient order, serving-size tricks, additive load and nutrient density.",
    image: annMethod,
  },
  {
    tag: "First client",
    title: "API Program signs its first company client",
    body: "TechForges' upcoming nutritional device becomes the first commercial integration of the LabelTruth API in a consumer hardware product.",
    image: annClient,
  },
  {
    tag: "Public sector",
    title: "LabelTruth applies for government subsidies",
    body: "An application has been filed for public-health innovation subsidies to keep consumer label scanning free at the point of use.",
    image: annSubsidy,
  },
];

export const partners = [
  { name: "TechForges", note: "Nutrition tracking device (upcoming)" },
  { name: "EcoTruth Group", note: "Stakeholding entity" },
  { name: "NutriPanel Labs", note: "Panel data" },
  { name: "FreshAisle Retail", note: "Retail pilot" },
  { name: "OpenPantry", note: "Data commons" },
  { name: "VeraFoods", note: "Manufacturer client" },
  { name: "ClearCart", note: "Grocery app" },
  { name: "MetricBite", note: "API reseller" },
];

export type TrackedItem = {
  company: string;
  item: string;
  image: string;
  pc: number;
  trust: number;
  verdict: "healthy" | "moderate" | "unhealthy";
  note: string;
  category: string;
};

export const trackedItems: TrackedItem[] = [
  {
    company: "VeraFoods",
    item: "Classic Cola 330ml",
    image: itemCola,
    pc: 0.32,
    trust: 34,
    verdict: "unhealthy",
    note: "\"Refreshing energy\" is 35g of free sugar per can with no other nutrients.",
    category: "Beverages",
  },
  {
    company: "MetricBite Kitchen",
    item: "Instant Noodle Cup",
    image: itemNoodles,
    pc: 0.48,
    trust: 41,
    verdict: "unhealthy",
    note: "\"Wholesome meal\" claim collapses on 1,900mg sodium and refined palm-fried flour.",
    category: "Instant meals",
  },
  {
    company: "FreshAisle",
    item: "Cocoa Protein Bar",
    image: itemBar,
    pc: 0.86,
    trust: 62,
    verdict: "moderate",
    note: "20g protein is real, but glucose syrup sits second in the ingredient list.",
    category: "Bars",
  },
  {
    company: "OpenPantry Dairy",
    item: "Strawberry Fruit Yogurt",
    image: itemYogurt,
    pc: 1.12,
    trust: 78,
    verdict: "healthy",
    note: "Live cultures and 8g protein deliver slightly more than the pack promises.",
    category: "Dairy",
  },
  {
    company: "ClearCart Snacks",
    item: "Salted Potato Chips",
    image: itemChips,
    pc: 0.55,
    trust: 46,
    verdict: "unhealthy",
    note: "\"Only 3 ingredients\" is true, yet a 30g serving hides a 150g bag.",
    category: "Snacks",
  },
  {
    company: "NutriPanel Foods",
    item: "Corn Flakes Cereal",
    image: itemCereal,
    pc: 0.71,
    trust: 57,
    verdict: "moderate",
    note: "\"Fortified with 9 vitamins\" distracts from a very high glycemic base.",
    category: "Cereal",
  },
  {
    company: "VeraFoods",
    item: "Zero Sugar Cola 500ml",
    image: itemCola,
    pc: 0.68,
    trust: 55,
    verdict: "moderate",
    note: "Sugar-free is accurate, but \"healthy hydration\" overstates flavoured acid water.",
    category: "Beverages",
  },
  {
    company: "VeraFoods",
    item: "Orange Nectar Juice 1L",
    image: itemCola,
    pc: 0.44,
    trust: 38,
    verdict: "unhealthy",
    note: "\"100% natural\" hides 12% juice content with the rest sugar and water.",
    category: "Beverages",
  },
  {
    company: "MetricBite Kitchen",
    item: "Masala Ramen Pack",
    image: itemNoodles,
    pc: 0.52,
    trust: 44,
    verdict: "unhealthy",
    note: "\"No added MSG\" is offset by yeast extract carrying the same glutamates.",
    category: "Instant meals",
  },
  {
    company: "MetricBite Kitchen",
    item: "Whole Wheat Noodles",
    image: itemNoodles,
    pc: 0.79,
    trust: 61,
    verdict: "moderate",
    note: "Whole wheat is first, yet fibre lands at only 3.1g per 100g.",
    category: "Instant meals",
  },
  {
    company: "FreshAisle",
    item: "Peanut Butter Crunch Bar",
    image: itemBar,
    pc: 0.74,
    trust: 58,
    verdict: "moderate",
    note: "\"High protein\" at 14g competes with 19g sugar in the same bar.",
    category: "Bars",
  },
  {
    company: "FreshAisle",
    item: "Oat & Date Breakfast Bar",
    image: itemBar,
    pc: 1.05,
    trust: 74,
    verdict: "healthy",
    note: "Dates and oats do the sweetening; no refined sugar found on the panel.",
    category: "Bars",
  },
  {
    company: "OpenPantry Dairy",
    item: "Greek Yogurt Plain 400g",
    image: itemYogurt,
    pc: 1.31,
    trust: 86,
    verdict: "healthy",
    note: "Two ingredients, 10g protein per 100g, and the claim understates the product.",
    category: "Dairy",
  },
  {
    company: "OpenPantry Dairy",
    item: "Mango Drinking Yogurt",
    image: itemYogurt,
    pc: 0.66,
    trust: 52,
    verdict: "moderate",
    note: "\"Real fruit\" is 4% purée; sugar per bottle reaches 21g.",
    category: "Dairy",
  },
  {
    company: "ClearCart Snacks",
    item: "Baked Veggie Crisps",
    image: itemChips,
    pc: 0.63,
    trust: 49,
    verdict: "unhealthy",
    note: "\"Baked, not fried\" is true but potato starch dominates the vegetables.",
    category: "Snacks",
  },
  {
    company: "ClearCart Snacks",
    item: "Sea Salt Popcorn",
    image: itemChips,
    pc: 0.94,
    trust: 68,
    verdict: "moderate",
    note: "Whole-grain corn base is honest; salt load still runs high per bag.",
    category: "Snacks",
  },
  {
    company: "NutriPanel Foods",
    item: "Honey Choco Rings",
    image: itemCereal,
    pc: 0.39,
    trust: 36,
    verdict: "unhealthy",
    note: "\"Part of a balanced breakfast\" sits on 32g sugar per 100g.",
    category: "Cereal",
  },
  {
    company: "NutriPanel Foods",
    item: "High Fibre Bran Flakes",
    image: itemCereal,
    pc: 1.18,
    trust: 81,
    verdict: "healthy",
    note: "14g fibre per 100g genuinely exceeds the front-of-pack fibre claim.",
    category: "Cereal",
  },
];

export const trackedNotice =
  "This product works with all the products, though some are listed only.";

export const categoryShowcase = trackedItems
  .reduce<{ label: string; sublabel: string; image: string; description: string }[]>(
    (acc, item) => {
      if (acc.some((c) => c.label === item.category)) return acc;
      const inCat = trackedItems.filter((t) => t.category === item.category);
      const avg = inCat.reduce((s, t) => s + t.pc, 0) / inCat.length;
      acc.push({
        label: item.category,
        sublabel: `${inCat.length} audited`,
        image: item.image,
        description: `average P:C ${avg.toFixed(2)}`,
      });
      return acc;
    },
    [],
  );

export const testimonials = [
  {
    quote:
      "LabelTruth flagged a 'wholesome' cereal we had shipped for a decade. We reformulated before the regulator ever asked.",
    name: "Anita Raghavan",
    designation: "Head of Product Integrity, NutriPanel Foods",
    src: annMethod,
  },
  {
    quote:
      "Our wearable streams intake data straight into the P:C engine. The verdict lands on the wrist in under two seconds.",
    name: "Daniel Okafor",
    designation: "VP Hardware, TechForges",
    src: annDevice,
  },
  {
    quote:
      "We wired the API Program into checkout. Shoppers see a trust score before the basket closes, and returns dropped.",
    name: "Mira Solberg",
    designation: "Digital Director, FreshAisle Retail",
    src: annApi,
  },
  {
    quote:
      "The confidence band is what sold us. It tells our analysts exactly when a reading deserves a second photograph.",
    name: "Tomás Lindqvist",
    designation: "Data Lead, OpenPantry",
    src: annClient,
  },
  {
    quote:
      "Public-health teams need auditable numbers, not marketing adjectives. The P:C methodology gives us both a score and its workings.",
    name: "Dr. Halima Yusuf",
    designation: "Policy Advisor, EcoTruth Group",
    src: annSubsidy,
  },
];


export const historyMilestones = [
  {
    year: "2023",
    title: "EcoTruth Group forms the label-truth working group",
    body: "A small team of food technologists starts cataloguing the gap between front-of-pack claims and back-of-pack reality.",
  },
  {
    year: "2024",
    title: "The Product-to-Claim (P:C) ratio is defined",
    body: "The first internal scoring sheet turns claim auditing into a single comparable number between 0.00 and 2.00.",
  },
  {
    year: "2025",
    title: "Trust score and confidence bands added",
    body: "Scoring is extended with a 0-100 trust score and an explicit confidence band so shoppers know how sure a reading is.",
  },
  {
    year: "2026",
    title: "LabelTruth opens to consumers, devices and the API Program",
    body: "The scanner ships publicly, the API Program launches, and TechForges signs on as the first hardware client.",
  },
];
