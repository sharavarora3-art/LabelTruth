import annDevice from "@/assets/ann-device.jpg";
import annApi from "@/assets/ann-api.jpg";
import annMethod from "@/assets/ann-method.jpg";
import annSubsidy from "@/assets/ann-subsidy.jpg";
import annClient from "@/assets/ann-client.jpg";

import itemCola from "@/assets/item-cola.png";
import itemNoodles from "@/assets/item-noodles.png";
import itemBar from "@/assets/item-bar.png";
import itemYogurt from "@/assets/item-yogurt.png";
import itemChips from "@/assets/item-chips.png";
import itemCereal from "@/assets/item-cereal.png";

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
  },
  {
    company: "MetricBite Kitchen",
    item: "Instant Noodle Cup",
    image: itemNoodles,
    pc: 0.48,
    trust: 41,
    verdict: "unhealthy",
    note: "\"Wholesome meal\" claim collapses on 1,900mg sodium and refined palm-fried flour.",
  },
  {
    company: "FreshAisle",
    item: "Cocoa Protein Bar",
    image: itemBar,
    pc: 0.86,
    trust: 62,
    verdict: "moderate",
    note: "20g protein is real, but glucose syrup sits second in the ingredient list.",
  },
  {
    company: "OpenPantry Dairy",
    item: "Strawberry Fruit Yogurt",
    image: itemYogurt,
    pc: 1.12,
    trust: 78,
    verdict: "healthy",
    note: "Live cultures and 8g protein deliver slightly more than the pack promises.",
  },
  {
    company: "ClearCart Snacks",
    item: "Salted Potato Chips",
    image: itemChips,
    pc: 0.55,
    trust: 46,
    verdict: "unhealthy",
    note: "\"Only 3 ingredients\" is true, yet a 30g serving hides a 150g bag.",
  },
  {
    company: "NutriPanel Foods",
    item: "Corn Flakes Cereal",
    image: itemCereal,
    pc: 0.71,
    trust: 57,
    verdict: "moderate",
    note: "\"Fortified with 9 vitamins\" distracts from a very high glycemic base.",
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
