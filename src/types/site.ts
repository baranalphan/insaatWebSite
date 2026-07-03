export interface ProjectCard {
  index: string; // "01"
  total: string; // "02"
  title: string;
  subtitle: string;
  location: string;
  pricePerM2: string; // "1370"
  areaFrom: string; // "132"
  installmentYears: string; // "2"
  availableCount: string; // "8"
  slides: string[]; // image paths
  detailsHref: string;
  mapHref: string;
}

export interface LocationCard {
  title: string;
  address: string;
  phone: string;
  phoneHref: string;
  lat: number;
  lng: number;
}

export interface AccordionItem {
  index: string; // "01"
  title: string;
  content: string[];
}

export interface StatCard {
  label: string;
  value: string;
  unit: string;
  description: string;
}

export interface InfrastructureCard {
  value: string;
  unit: string; // "dk yürüyüş" | "dk araçla"
  title: string;
  image?: string;
}

export interface MediaTab {
  id: string;
  label: string;
  type: "photo" | "video" | "project";
  items: { image: string; alt?: string; videoHash?: string }[];
}

export interface CharacteristicRow {
  index: string;
  title: string;
  content?: string;
  image: string;
}
