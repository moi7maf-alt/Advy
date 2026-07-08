export interface Template {
  id: number;
  name: string;
  category: string;
  dimensions: string;
  image_url?: string | null;
}

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
