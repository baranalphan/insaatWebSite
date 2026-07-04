export interface FlatProperty {
  id: string;
  property_id: string;
  property_flat: string;
  property_name?: string;
  property_level?: string;
  [key: string]: string | undefined;
}

export interface FlatImages {
  without?: { "3d"?: string; "2d"?: string };
  [key: string]: unknown;
}

export interface FlatUnit {
  id: string;
  build: string;
  build_name: string;
  section: string;
  floor: string;
  rooms: string;
  type: string;
  area: string;
  area_land: string;
  number: string;
  sale: string;
  img: string;
  img_big?: string;
  price: string;
  _price: string;
  price_m2: string;
  level: string;
  images?: FlatImages;
  flat_levels_photo?: Record<string, { without?: string; [key: string]: unknown }>;
  properties?: Record<string, FlatProperty> | FlatProperty[];
  title?: string;
  description?: string;
  bathrooms?: string;
  bedrooms?: string;
  mansarda?: string;
  custom_field_3?: string;
  fund?: string;
  project_deadline?: string;
  deferral_period?: string;
  [key: string]: unknown;
}

export type GenplanView =
  | { type: "genplan" }
  | { type: "flyby"; flyby: string; side: string }
  | { type: "flat"; id: string };

export const CONTROL_FRAMES = [1, 31, 61, 91];
export const FRAME_COUNT = 120;

export type FrameVerticalAlign = "top" | "bottom" | "center";

export interface FlybyViewConfig {
  /** frame directory under /genplan/flyby/ */
  frameSet: string;
  /** control frame shown when the view opens without ?controlPoint */
  defaultFrame: number;
  /** frame img crop — must match the overlay SVG preserveAspectRatio */
  verticalAlign: FrameVerticalAlign;
  /** Turkish display name (header dropdown title + controller title) */
  displayName: string;
}

/** The three real flyby views, keyed "flyby/side". Anything else → unavailable popup. */
export const FLYBY_VIEWS: Record<string, FlybyViewConfig> = {
  "1/outside": { frameSet: "1_outside", defaultFrame: 91, verticalAlign: "top", displayName: "6. Etap" },
  "1/inside": { frameSet: "1_inside", defaultFrame: 1, verticalAlign: "bottom", displayName: "Lagom UNIQUE" },
  "2/outside": { frameSet: "2_outside", defaultFrame: 31, verticalAlign: "top", displayName: "7. Etap" },
};

export function nearestControlFrame(frame: number): number {
  let best = CONTROL_FRAMES[0];
  let bestDist = FRAME_COUNT;
  for (const cf of CONTROL_FRAMES) {
    const d = Math.min(Math.abs(frame - cf), FRAME_COUNT - Math.abs(frame - cf));
    if (d < bestDist) {
      bestDist = d;
      best = cf;
    }
  }
  return best;
}
