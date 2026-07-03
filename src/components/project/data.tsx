import type { ReactNode } from "react";
import type { MediaImage, MediaVideo } from "./media-data";
import {
  LAGOM_MEDIA_PHOTOS,
  LAGOM_MEDIA_VIDEOS,
  LAGOM_MEDIA_PROJECTS,
  UNIQUE_MEDIA_PROJECTS,
} from "./media-data";

export interface DescriptionStat {
  prefix?: string;
  value: string;
  suffix?: ReactNode;
  top?: { prefix: string; value: string };
  name: string;
}

export type GalleryMedia =
  | { kind: "image"; img: MediaImage }
  | { kind: "video"; src: string; srcMob: string };

export interface GalleryRow {
  title: string;
  description: string;
  media: GalleryMedia;
}

export interface MediaTab {
  id: string;
  label: string;
  images?: MediaImage[];
  videos?: MediaVideo[];
}

export interface CharacteristicItem {
  index: string;
  title: string;
  img: MediaImage;
  content: ReactNode;
}

export interface ProjectPageData {
  key: "lagom" | "unique";
  introLogo: ReactNode;
  introTitle: ReactNode;
  heroDesktopSrcSet: string;
  heroAlt: string;
  previewMobileSrcSet: string;
  previewTitle: string;
  descriptionTitle: ReactNode;
  stats: DescriptionStat[];
  videoSrc: string;
  videoSrcMob: string;
  overviewTitle: string;
  gallery: GalleryRow[];
  mediaTitle: ReactNode;
  mediaTabs: MediaTab[];
  characteristics: CharacteristicItem[];
}

const KV_SIZES = ["1024x1001 1024w", "1350x1320 1350w", "1920x1877 1920w", "2560x2503 2560w"];

function kvSrcSet(base: string): string {
  return KV_SIZES.map((v) => `/images/${base}-${v.split(" ")[0]}.webp ${v.split(" ")[1]}`).join(", ");
}

const PREVIEW_VARIANTS = [
  "768x1501 768w", "153x300 153w", "524x1024 524w", "786x1536 786w", "720x1407 720w", "436x852 436w",
  "240x469 240w", "420x820 420w", "760x1485 760w", "360x704 360w", "300x586 300w", "205x400 205w", " 880w",
];

function previewSrcSet(base: string): string {
  return PREVIEW_VARIANTS.map((v) => {
    const [size, w] = v.split(" ").length === 2 ? v.split(" ") : ["", v.trim()];
    return size ? `/images/${base}-${size}.webp ${w}` : `/images/${base}.webp ${w}`;
  }).join(", ");
}

const GALLERY_VARIANTS = [
  "1920x1080 1920w", "300x169 300w", "768x432 768w", "1024x576 1024w", "1536x864 1536w", "2048x1152 2048w",
  "1350x759 1350w", "720x405 720w", "436x245 436w", "240x135 240w", "1080x608 1080w", "760x428 760w",
  "360x203 360w", "600x338 600w", "426x240 426w", "640x360 640w",
];

const GALLERY_SIZES = "(max-width: 1024px) 200vw, (min-width: 1920px) 1920px, 1350px";

function galleryImg(base: string): MediaImage {
  return {
    width: 1920,
    height: 1080,
    src: `/images/${base}-1920x1080.webp`,
    srcSet: GALLERY_VARIANTS.map((v) => `/images/${base}-${v.split(" ")[0]}.webp ${v.split(" ")[1]}`).join(", "),
    sizes: GALLERY_SIZES,
  };
}

const CHAR_SIZES = "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw";

const GALLERY_VIDEO: GalleryMedia = {
  kind: "video",
  src: "/videos/blagoustrij-hd.mp4",
  srcMob: "/videos/blagoustrij-shorts.mp4",
};

/* ------------------------------------------------------------------ */
/* LAGOM wordmark (grey #D7D1C6) — from lagom-intro.html               */
/* ------------------------------------------------------------------ */

const LAGOM_LOGO = (
  <svg xmlns="http://www.w3.org/2000/svg" width="1652" height="320" viewBox="0 0 1652 320" fill="none">
    <g clipPath="url(#clip0_6111_2351)">
      <path d="M0 311.679V8.59082H82.3557V233.74H214.558V311.679H0Z" fill="#D7D1C6" />
      <path d="M0 311.679V8.59082H82.3557V233.74H214.558V311.679H0Z" fill="#D7D1C6" />
      <path d="M252.068 311.687L366.933 8.59863H457.958L572.822 311.687H483.965L462.292 246.738H362.598L340.926 311.687H252.068ZM384.271 179.627H440.62L413.312 93.0304H411.578L384.271 179.627Z" fill="#D7D1C6" />
      <path d="M252.068 311.687L366.933 8.59863H457.958L572.822 311.687H483.965L462.292 246.738H362.598L340.926 311.687H252.068ZM384.271 179.627H440.62L413.312 93.0304H411.578L384.271 179.627Z" fill="#D7D1C6" />
      <path d="M755.107 203.443V142.825H885.142V259.729C876.182 270.702 864.912 280.805 851.333 290.039C821.276 310.247 787.758 320.348 750.773 320.348C702.51 320.348 662.274 304.835 630.056 273.802C597.832 242.775 581.727 204.89 581.727 160.144C581.727 115.405 597.832 77.5189 630.056 46.4861C662.274 15.4603 702.51 -0.0595703 750.773 -0.0595703C787.182 -0.0595703 819.691 9.75703 848.299 29.3833C861.011 38.3339 871.848 48.0016 880.808 58.3932L830.961 114.681C824.31 107.469 816.942 100.974 808.855 95.1968C790.068 82.2073 770.711 75.7125 750.773 75.7125C727.075 75.7125 707.062 83.8717 690.74 100.176C674.411 116.487 666.25 136.479 666.25 160.144C666.25 183.816 674.411 203.808 690.74 220.112C707.062 236.422 727.075 244.574 750.773 244.574C766.377 244.574 779.665 241.692 790.65 235.915C795.269 233.608 800.037 230.721 804.954 227.257V203.443H755.107Z" fill="#D7D1C6" />
      <path d="M971.08 273.798C938.855 242.771 922.75 204.887 922.75 160.14C922.75 115.401 938.855 77.515 971.08 46.4822C1003.3 15.4564 1043.53 -0.0634766 1091.8 -0.0634766C1140.05 -0.0634766 1180.29 15.4564 1212.51 46.4822C1244.73 77.515 1260.84 115.401 1260.84 160.14C1260.84 204.887 1244.73 242.771 1212.51 273.798C1180.29 304.831 1140.05 320.344 1091.8 320.344C1043.53 320.344 1003.3 304.831 971.08 273.798ZM1031.76 100.172C1015.43 116.484 1007.27 136.475 1007.27 160.14C1007.27 183.812 1015.43 203.804 1031.76 220.109C1048.09 236.418 1068.1 244.57 1091.8 244.57C1115.49 244.57 1135.5 236.418 1151.83 220.109C1168.15 203.804 1176.32 183.812 1176.32 160.14C1176.32 136.475 1168.15 116.484 1151.83 100.172C1135.5 83.8677 1115.49 75.7086 1091.8 75.7086C1068.1 75.7086 1048.09 83.8677 1031.76 100.172Z" fill="#D7D1C6" />
      <path d="M1318.13 311.691V8.60254H1391.82L1485.01 125.508L1578.2 8.60254H1651.89V311.691H1569.53V132.003L1485.01 238.082L1400.49 132.003V311.691H1318.13Z" fill="#D7D1C6" />
      <path d="M1318.13 311.691V8.60254H1391.82L1485.01 125.508L1578.2 8.60254H1651.89V311.691H1569.53V132.003L1485.01 238.082L1400.49 132.003V311.691H1318.13Z" fill="#D7D1C6" />
    </g>
    <defs>
      <clipPath id="clip0_6111_2351">
        <rect width="1652" height="320" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/* ------------------------------------------------------------------ */
/* UNIQUE wordmark — from unique-intro.html                            */
/* ------------------------------------------------------------------ */

const UNIQUE_LOGO = (
  <svg xmlns="http://www.w3.org/2000/svg" width="1652" height="386" viewBox="0 0 1652 386" fill="none">
    <path d="M134.035 308.715C89.3567 308.715 55.8479 297.674 33.5088 275.593C11.1696 253.512 0 220.531 0 176.651V4.67106H78.0457V177.076C78.0457 198.874 82.5701 215.435 91.6189 226.759C100.668 237.8 114.806 243.32 134.035 243.32C153.264 243.32 167.402 237.8 176.451 226.759C185.5 215.435 190.024 198.874 190.024 177.076V4.67106H267.222V176.651C267.222 220.531 256.194 253.512 234.137 275.593C212.081 297.674 178.713 308.715 134.035 308.715Z" fill="#D7D1C6" />
    <path d="M319.808 304.044V4.67106H377.494L528.92 192.788H516.619V4.67106H589.151V304.044H531.465L380.887 115.927H393.188V304.044H319.808Z" fill="#D7D1C6" />
    <path d="M644.142 304.044V4.67106H722.612V304.044H644.142Z" fill="#D7D1C6" />
    <path d="M1000.2 386C990.299 380.904 980.402 374.252 970.505 366.042C960.891 358.115 951.983 348.915 943.783 338.44C935.582 327.966 928.654 317.208 922.999 306.167L982.381 278.565C989.168 293.003 998.924 306.167 1011.65 318.057C1024.66 330.23 1038.23 339.997 1052.37 347.358L1000.2 386ZM769.876 154.145C769.876 123.005 775.956 95.9692 788.115 73.0385C800.275 49.8247 817.665 31.8482 840.287 19.1089C862.909 6.36964 889.631 0 920.454 0C951.559 0 978.423 6.36964 1001.04 19.1089C1023.67 31.8482 1041.06 49.8247 1053.22 73.0385C1065.66 95.9692 1071.88 123.005 1071.88 154.145C1071.88 185.003 1065.66 212.038 1053.22 235.252C1041.06 258.466 1023.67 276.584 1001.04 289.606C978.423 302.345 951.559 308.715 920.454 308.715C889.631 308.715 862.909 302.345 840.287 289.606C817.948 276.584 800.557 258.466 788.115 235.252C775.956 212.038 769.876 185.003 769.876 154.145ZM851.74 154.145C851.74 182.172 857.395 204.111 868.706 219.965C880.017 235.535 897.266 243.32 920.454 243.32C943.641 243.32 961.032 235.535 972.626 219.965C984.219 204.111 990.016 182.172 990.016 154.145C990.016 126.119 984.219 104.32 972.626 88.7503C961.032 73.18 943.641 65.3949 920.454 65.3949C897.266 65.3949 880.017 73.18 868.706 88.7503C857.395 104.037 851.74 125.836 851.74 154.145Z" fill="#D7D1C6" />
    <path d="M1251.6 308.715C1206.92 308.715 1173.41 297.674 1151.08 275.593C1128.74 253.512 1117.57 220.531 1117.57 176.651V4.67106H1195.61V177.076C1195.61 198.874 1200.14 215.435 1209.19 226.759C1218.23 237.8 1232.37 243.32 1251.6 243.32C1270.83 243.32 1284.97 237.8 1294.02 226.759C1303.07 215.435 1307.59 198.874 1307.59 177.076V4.67106H1384.79V176.651C1384.79 220.531 1373.76 253.512 1351.7 275.593C1329.65 297.674 1296.28 308.715 1251.6 308.715Z" fill="#D7D1C6" />
    <path d="M1437.37 304.044V4.67106H1652V64.5457H1512.45V121.872H1641.82V182.172H1512.45V243.745H1652V304.044H1437.37Z" fill="#D7D1C6" />
  </svg>
);

export const lagomData: ProjectPageData = {
  key: "lagom",
  introLogo: LAGOM_LOGO,
  introTitle: (
    <>
      <strong>Göl Kenarında Villa Kent</strong>
      <br />Doğa ile Şehir Konforunun
      <br />
      Kusursuz Dengesi
    </>
  ),
  heroDesktopSrcSet: kvSrcSet("2026_02_lagom-kv-desktop"),
  heroAlt: "Doğa ile şehir konforunun kusursuz dengesine sahip göl kenarında villa kent",
  previewMobileSrcSet: previewSrcSet("2026_02_lagom-kv-mobile"),
  previewTitle: "Huzura, konfora ve estetiğe değer verenler için bir yaşam alanı",
  descriptionTitle: (
    <>
      <strong>
        7. Etap İnşaatı:
        <br />
      </strong>
      {"370 villadan 140'ı teslim edildi."}
    </>
  ),
  stats: [
    {
      prefix: "min ",
      value: "132",
      suffix: (
        <>
          m
          <strong>
            <sup>2</sup>
          </strong>
        </>
      ),
      top: { prefix: "max ", value: "220" },
      name: "Villa Alanı",
    },
    { prefix: "max ", value: "6", suffix: " ar", name: "Arsa Alanı" },
    {
      prefix: "max ",
      value: "54",
      suffix: (
        <>
          m
          <strong>
            <sup>2</sup>
          </strong>
        </>
      ),
      name: "Hediye",
    },
    { prefix: "", value: "1370", suffix: " $ / m²'den başlayan", name: "Metrekare Fiyatı" },
  ],
  videoSrc: "/videos/lagom-hd.mp4",
  videoSrcMob: "/videos/1j-shorts.v1.2.mp4",
  overviewTitle: "Neden LAGOM'u Seçmelisiniz?",
  gallery: [
    {
      title: "Konum",
      description: "Lviv yakınlarında, göl kenarında ve 3 hektarlık yeşil alana sahip villa kent.",
      media: { kind: "image", img: galleryImg("2025_12_lokacziya_nich_lagom") },
    },
    {
      title: "Güvenlik",
      description:
        "Güvenliğiniz için 7/24 koruma ve modern video gözetim, Face ID erişim kontrolü, Ajax alarm sistemi, plaka tanıma ve otomatik bariyerler.",
      media: { kind: "image", img: galleryImg("2025_12_lokacziya_den_lagom") },
    },
    {
      title: "Sosyal Aktiviteler",
      description:
        "16 hektardan fazla alan, özel sahil şeridi, 5 km bisiklet yolu, çocuk oyun parkları, spor salonu, tenis kortu, basketbol sahası ve workout alanları.",
      media: GALLERY_VIDEO,
    },
  ],
  mediaTitle: (
    <>
      <strong>İlham Veren Yaşam Alanı:</strong>
      <br />
      İskandinav Tarzında Estetik ve Pratiklik
    </>
  ),
  mediaTabs: [
    { id: "tab_0", label: "Fotoğraflar", images: LAGOM_MEDIA_PHOTOS },
    { id: "tab_1", label: "Videolar", videos: LAGOM_MEDIA_VIDEOS },
    { id: "tab_2", label: "Projeler", images: LAGOM_MEDIA_PROJECTS },
  ],
  characteristics: [
    {
      index: "01",
      title: "Altyapı Şebekeleri",
      img: { width: 600, height: 400, src: "/images/2025_12_pexels-pixabay-257736-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          Tüm merkezi altyapı bağlantıları:
          <p>• Su temini ve kanalizasyon;</p>
          <p>• 15 kW elektrik gücü;</p>
          <p>• Doğal gaz bağlantısı;</p>
        </>
      ),
    },
    {
      index: "02",
      title: "İnşaat Teknolojisi",
      img: { width: 600, height: 400, src: "/images/2025_12_at__0805-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          <p>• Isı ve su yalıtımlı monolitik betonarme temel.</p>
          <p>• Tuğla duvarlar. Binalar arasında ilave ses yalıtımı.</p>
          <p>• Alman üretici Arcelor Mittal marka kenetli çatı kaplaması.</p>
        </>
      ),
    },
    {
      index: "03",
      title: "Dış Cephe & Çevre Düzenlemesi",
      img: {
        width: 600,
        height: 400,
        src: "/images/2026_03_ph_romacayman-41-600x400.webp",
        srcSet:
          "/images/2026_03_ph_romacayman-41-600x400.webp 600w, /images/2026_03_ph_romacayman-41-300x200.webp 300w, /images/2026_03_ph_romacayman-41-1024x683.webp 1024w, /images/2026_03_ph_romacayman-41-768x512.webp 768w, /images/2026_03_ph_romacayman-41-1536x1024.webp 1536w, /images/2026_03_ph_romacayman-41-1350x900.webp 1350w, /images/2026_03_ph_romacayman-41-720x480.webp 720w, /images/2026_03_ph_romacayman-41-436x291.webp 436w, /images/2026_03_ph_romacayman-41-240x160.webp 240w, /images/2026_03_ph_romacayman-41-1080x720.webp 1080w, /images/2026_03_ph_romacayman-41-760x507.webp 760w, /images/2026_03_ph_romacayman-41-360x240.webp 360w, /images/2026_03_ph_romacayman-41.webp 1920w",
        sizes: CHAR_SIZES,
      },
      content: (
        <>
          <p>{"• Avrupa'nın önde gelen üreticilerinden (Laminam, Rockwool, STO, Baumit) cephe sistemleri, çevre dostu malzemelerden dekoratif kaplamalar"}</p>
          <p>• Sektörün liderlerinden Luminal marka mimari aydınlatma</p>
          <p>• Çevresi kapalı müstakil arka bahçe. Galvanizli metal çit.</p>
          <p>• Her ev için çim taşı/geogrid parke taşından iki adet eko-otopark.</p>
        </>
      ),
    },
    {
      index: "04",
      title: "Donanım & Ekipmanlar",
      img: { width: 600, height: 400, src: "/images/2025_12_4a5a8007-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          <p>• Premium sınıf REHAU Synego+ panoramik pencereler. 80 mm kalınlığında profil, enerji verimli dolgulu 3 camlı çift katmanlı ısıcam ve 7 odacıklı profil. Hoppe Secustik hırsızlığa karşı korumalı pencere kolları.</p>
          <p>• Reynaers alüminyum profilli, üç contalı, ısı yalıtımlı ve dışı çok işlevli temperli mat camlı giriş kapısı.</p>
          <p>• Her evde şömine kurulumuna uygun havalandırma kanalı mevcuttur.</p>
          <p>• Çift devreli Viessmann yoğuşmalı gaz kazanı.</p>
        </>
      ),
    },
    {
      index: "05",
      title: "Güvenlik (Sığınak)",
      img: { width: 533, height: 400, src: "/images/2025_12_img_7534-scaled-533x400.webp", sizes: CHAR_SIZES },
      content: (
        <p>Her ev, tüm duvarları betonarme olan ve temeli inşaat aşamasında atılan güvenli bir sığınak odası ile donatılmıştır.</p>
      ),
    },
    {
      index: "06",
      title: "LAGOM'dan Hediye",
      img: { width: 600, height: 400, src: "/images/2025_12_ph_romacayman-102-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <p>En cesur tasarım fikirlerinizi hayata geçirmenizi sağlayacak 39-54 m² alana sahip çatı katı katı.</p>
      ),
    },
  ],
};

export const uniqueData: ProjectPageData = {
  key: "unique",
  introLogo: UNIQUE_LOGO,
  introTitle: (
    <>
      <strong>Göl Manzaralı Rezidanslar</strong>
      <br />Huzur ve Özgürlüğün Şekillendirdiği Alan
    </>
  ),
  heroDesktopSrcSet: kvSrcSet("2026_02_unique-kv-desktop"),
  heroAlt: "Huzur ve özgürlüğün şekillendirdiği göl manzaralı rezidanslar",
  previewMobileSrcSet: previewSrcSet("2026_02_unique-kv-mobile"),
  previewTitle: "Taviz vermeyenler için mimari",
  descriptionTitle: (
    <>
      <strong>Gizlilik, alanın temelinde yer alır.</strong>
      <br />
      Proje yapım aşamasındadır.
    </>
  ),
  stats: [
    {
      prefix: "min ",
      value: " 300 ",
      suffix: (
        <strong>
          m<sup>2</sup>
        </strong>
      ),
      top: { prefix: "max ", value: "350" },
      name: "Villa Alanı",
    },
    { value: "8-10", suffix: <strong> ar</strong>, name: "Arsa Alanı" },
    { value: "14", suffix: <strong> rezidans</strong>, name: "Toplam Sayı" },
    { prefix: "", value: "2400 ", suffix: <strong>{"$ / m²'den başlayan"}</strong>, name: "Metrekare Fiyatı" },
  ],
  videoSrc: "/videos/unique-hd.mp4",
  videoSrcMob: "/videos/unique-shorts.mp4",
  overviewTitle: "Neden UNIQUE Rezidanslarını Seçmelisiniz?",
  gallery: [
    {
      title: "Konum",
      description: "Göl kenarında ve 3 hektarlık yeşil alana sahip villa kent.",
      media: { kind: "image", img: galleryImg("2025_05_lokacziya-nich") },
    },
    {
      title: "Güvenlik",
      description:
        "7/24 koruma ve modern video gözetim, alan aydınlatması, Face ID erişim kontrolü, otomatik kapılar and bariyerler.",
      media: { kind: "image", img: galleryImg("2025_05_lokacziya-den") },
    },
    {
      title: "Sosyal Aktiviteler",
      description:
        "16 hektardan fazla alan, özel sahil şeridi, çocuk oyun alanları, spor salonu, tenis kortu, basketbol sahası, bisiklet yolları ve workout alanları.",
      media: GALLERY_VIDEO,
    },
  ],
  mediaTitle: (
    <>
      <strong>İlham Veren Mimari:</strong>
      <br />
      İskandinav Tarzında Estetik ve Pratiklik
    </>
  ),
  mediaTabs: [{ id: "tab_0", label: "Proje", images: UNIQUE_MEDIA_PROJECTS }],
  characteristics: [
    {
      index: "01",
      title: "Altyapı Şebekeleri",
      img: { width: 600, height: 400, src: "/images/2025_12_pexels-pixabay-257736-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          Tüm merkezi altyapı bağlantıları:
          <p>• Su temini ve kanalizasyon;</p>
          <p>• 21 kW elektrik gücü;</p>
          <p>• Doğal gaz bağlantısı;</p>
        </>
      ),
    },
    {
      index: "02",
      title: "İnşaat Teknolojisi",
      img: { width: 600, height: 400, src: "/images/2025_12_at__0805-600x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          <p>• Isı ve su yalıtımlı monolitik betonarme temel.</p>
          <p>• Tuğla duvarlar. Binalar arasında ilave ses yalıtımı.</p>
          <p>• Betonarme döşeme. Sika PVC membran ile su yalıtımı ve eğim şapı üzerine ekstrüde polistiren (XPS) ısı yalıtımı.</p>
        </>
      ),
    },
    {
      index: "03",
      title: "Dış Cephe & Çevre Düzenlemesi",
      img: { width: 600, height: 338, src: "/images/2025_12_typ-a-2-4-6-8-11-13-siryj-cyr-600x338.webp", sizes: CHAR_SIZES },
      content: (
        <>
          <p>• İtalyan büyük ebat porselen seramik ve İspanyol doğal taşından havalandırmalı dış cephe.</p>
          <p>• Sektörün liderlerinden Luminal marka mimari aydınlatma</p>
          <p>• Çevresi kapalı müstakil arka bahçe. Galvanizli metal çit.</p>
          <p>• Özel ahşap/kompozit deck kaplama bahçe terası</p>
          <p>• Müstakil arka bahçede tropikal duş</p>
          <p>• Betonarme taşıyıcılar ve döşeme ile 2 araçlık otopark sundurması.</p>
        </>
      ),
    },
    {
      index: "04",
      title: "Donanım & Ekipmanlar",
      img: { width: 320, height: 400, src: "/images/2025_12_typ-a-2-4-6-8-11-13-siryj-cyr-320x400.webp", sizes: CHAR_SIZES },
      content: (
        <>
          <p>• Premium sınıf Reynaers MasterLine 8 panoramik alüminyum pencereler</p>
          <p>• Reynaers alüminyum profilli, üç contalı ve ısı yalıtımlı giriş kapısı.</p>
          <p>• Her evde şömine kurulumuna uygun havalandırma kanalı mevcuttur.</p>
          <p>• Kat döşeme plağında hazır havalandırma kanalları döşenmiştir.</p>
          <p>• Çift devreli Vaillant yoğuşmalı gaz kazanı.</p>
        </>
      ),
    },
    {
      index: "05",
      title: "Güvenlik (Sığınak)",
      img: { width: 533, height: 400, src: "/images/2025_12_img_7534-scaled-533x400.webp", sizes: CHAR_SIZES },
      content: (
        <p>Her ev, tüm duvarları betonarme olan ve temeli inşaat aşamasında atılan güvenli bir sığınak odası ile donatılmıştır.</p>
      ),
    },
    {
      index: "06",
      title: "Dış Mekan Isıtma",
      img: { width: 600, height: 322, src: "/images/2025_12_14215-oblozhka-600x322.webp", sizes: CHAR_SIZES },
      content: (
        <p>Evinize giden parke taş döşeli yürüyüş yolu, entegre dış mekan ısıtma sistemi sayesinde her zaman kuru ve kardan arınmış kalacaktır.</p>
      ),
    },
  ],
};
