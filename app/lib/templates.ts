export interface Template {
  id: number;
  name: string;
  category: string;
  dimensions: string;
}

export const templates: Template[] = [
  { id: 1, name: "Restaurant Menu", category: "Food", dimensions: "1080×1920" },
  { id: 2, name: "Food Delivery App", category: "Food", dimensions: "390×844" },
  { id: 3, name: "iPhone 16 Pro", category: "Phones", dimensions: "1200×800" },
  { id: 4, name: "SUV Showcase", category: "Cars", dimensions: "1920×1080" },
  { id: 5, name: "Storefront Banner", category: "Retail", dimensions: "1200×628" },
  { id: 6, name: "E-book Cover", category: "Digital Books", dimensions: "600×900" },
  { id: 7, name: "Garden Planner", category: "Plants", dimensions: "1080×1080" },
  { id: 8, name: "Pet Adoption", category: "Animals", dimensions: "1080×1350" },
];

export const categories = [
  "All",
  "Food",
  "Phones",
  "Cars",
  "Retail",
  "Digital Books",
  "Plants",
  "Animals",
];
