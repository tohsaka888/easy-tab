type RGB = {
  r: number;
  g: number;
  b: number;
};

export type ThemeColors = {
  bg1: string;
  bg2: string;
  bg3: string;
  surface1: string;
  surface2: string;
  surface3: string;
  ink1: string;
  ink2: string;
  accent1: string;
  accent2: string;
  accent1Rgb: string;
  accent2Rgb: string;
  accentInk: string;
  gridLine: string;
  gridLineStrong: string;
  strokeStrong: string;
  stroke: string;
  strokeSoft: string;
  overlayStrong: string;
  overlay: string;
  overlaySoft: string;
  cardSurface: string;
  cardBorder: string;
  cardInk: string;
  cardInkMuted: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const rgbToHsl = ({ r, g, b }: RGB) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      hue = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      hue = (bNorm - rNorm) / delta + 2;
    } else {
      hue = (rNorm - gNorm) / delta + 4;
    }
  }
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: hue,
    s: saturation,
    l: lightness,
  };
};

const hslToRgb = (h: number, s: number, l: number): RGB => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

const toHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join("")}`;

const toRgba = ({ r, g, b }: RGB, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const toRgbString = ({ r, g, b }: RGB) => `${r} ${g} ${b}`;

const mixColors = (colorA: RGB, colorB: RGB, weight: number): RGB => {
  const ratio = clamp(weight, 0, 1);
  return {
    r: Math.round(colorA.r + (colorB.r - colorA.r) * ratio),
    g: Math.round(colorA.g + (colorB.g - colorA.g) * ratio),
    b: Math.round(colorA.b + (colorB.b - colorA.b) * ratio),
  };
};

export const defaultThemeColors: ThemeColors = {
  bg1: "#0f5c58",
  bg2: "#0c4b49",
  bg3: "#0a3d3c",
  surface1: "rgba(255, 255, 255, 0.92)",
  surface2: "rgba(255, 255, 255, 0.85)",
  surface3: "rgba(255, 255, 255, 0.7)",
  ink1: "#0e1b1a",
  ink2: "#24413e",
  accent1: "#f8b547",
  accent2: "#3ba6a6",
  accent1Rgb: "248 181 71",
  accent2Rgb: "59 166 166",
  accentInk: "#1a1202",
  gridLine: "rgba(255, 255, 255, 0.16)",
  gridLineStrong: "rgba(255, 255, 255, 0.22)",
  strokeStrong: "rgba(255, 255, 255, 0.5)",
  stroke: "rgba(255, 255, 255, 0.32)",
  strokeSoft: "rgba(255, 255, 255, 0.16)",
  overlayStrong: "rgba(255, 255, 255, 0.22)",
  overlay: "rgba(255, 255, 255, 0.12)",
  overlaySoft: "rgba(255, 255, 255, 0.06)",
  cardSurface: "rgba(12, 18, 34, 0.78)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  cardInk: "rgba(248, 250, 252, 0.96)",
  cardInkMuted: "rgba(226, 232, 240, 0.75)",
};

const createThemeFromBase = (base: RGB): ThemeColors => {
  const { h, s, l } = rgbToHsl(base);
  const baseS = clamp(s + 0.12, 0.35, 0.85);
  const baseL = clamp(l * 0.7, 0.18, 0.32);
  const bg1 = hslToRgb(h, baseS, baseL);
  const bg2 = hslToRgb(h, baseS, clamp(baseL - 0.06, 0.12, 0.28));
  const bg3 = hslToRgb(h, baseS, clamp(baseL - 0.1, 0.08, 0.24));

  const accent1 = hslToRgb((h + 10) % 360, clamp(baseS + 0.18, 0.4, 0.95), clamp(baseL + 0.4, 0.45, 0.78));
  const accent2 = hslToRgb((h + 40) % 360, clamp(baseS + 0.12, 0.35, 0.9), clamp(baseL + 0.28, 0.38, 0.68));

  const isDark = baseL < 0.28;
  const inkBase = hslToRgb(h, 0.12, isDark ? 0.96 : 0.14);
  const inkMuted = hslToRgb(h, 0.12, isDark ? 0.78 : 0.32);

  const surfaceBase = isDark
    ? mixColors(bg1, { r: 255, g: 255, b: 255 }, 0.82)
    : mixColors(bg1, { r: 0, g: 0, b: 0 }, 0.72);

  const cardBase = isDark
    ? mixColors(bg1, { r: 0, g: 0, b: 0 }, 0.45)
    : mixColors(bg1, { r: 255, g: 255, b: 255 }, 0.2);

  const cardInk = isDark ? hslToRgb(h, 0.2, 0.94) : hslToRgb(h, 0.12, 0.12);
  const cardInkMuted = isDark ? hslToRgb(h, 0.18, 0.78) : hslToRgb(h, 0.1, 0.4);

  const lineBase = isDark ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };

  return {
    bg1: toHex(bg1),
    bg2: toHex(bg2),
    bg3: toHex(bg3),
    surface1: toRgba(surfaceBase, isDark ? 0.88 : 0.82),
    surface2: toRgba(surfaceBase, isDark ? 0.78 : 0.72),
    surface3: toRgba(surfaceBase, isDark ? 0.64 : 0.58),
    ink1: toHex(inkBase),
    ink2: toHex(inkMuted),
    accent1: toHex(accent1),
    accent2: toHex(accent2),
    accent1Rgb: toRgbString(accent1),
    accent2Rgb: toRgbString(accent2),
    accentInk: isDark ? "#1a1202" : "#ffffff",
    gridLine: toRgba(lineBase, isDark ? 0.2 : 0.14),
    gridLineStrong: toRgba(lineBase, isDark ? 0.28 : 0.2),
    strokeStrong: toRgba(lineBase, isDark ? 0.5 : 0.4),
    stroke: toRgba(lineBase, isDark ? 0.3 : 0.22),
    strokeSoft: toRgba(lineBase, isDark ? 0.18 : 0.12),
    overlayStrong: toRgba(lineBase, isDark ? 0.22 : 0.18),
    overlay: toRgba(lineBase, isDark ? 0.14 : 0.12),
    overlaySoft: toRgba(lineBase, isDark ? 0.08 : 0.06),
    cardSurface: toRgba(cardBase, isDark ? 0.78 : 0.86),
    cardBorder: toRgba(lineBase, isDark ? 0.16 : 0.12),
    cardInk: toHex(cardInk),
    cardInkMuted: toHex(cardInkMuted),
  };
};

export const applyThemeToRoot = (theme: ThemeColors, backgroundImage: string | null) => {
  const root = document.documentElement;
  root.style.setProperty("--bg-1", theme.bg1);
  root.style.setProperty("--bg-2", theme.bg2);
  root.style.setProperty("--bg-3", theme.bg3);
  root.style.setProperty("--surface-1", theme.surface1);
  root.style.setProperty("--surface-2", theme.surface2);
  root.style.setProperty("--surface-3", theme.surface3);
  root.style.setProperty("--ink-1", theme.ink1);
  root.style.setProperty("--ink-2", theme.ink2);
  root.style.setProperty("--accent-1", theme.accent1);
  root.style.setProperty("--accent-2", theme.accent2);
  root.style.setProperty("--accent-1-rgb", theme.accent1Rgb);
  root.style.setProperty("--accent-2-rgb", theme.accent2Rgb);
  root.style.setProperty("--accent-ink", theme.accentInk);
  root.style.setProperty("--grid-line", theme.gridLine);
  root.style.setProperty("--grid-line-strong", theme.gridLineStrong);
  root.style.setProperty("--stroke-strong", theme.strokeStrong);
  root.style.setProperty("--stroke", theme.stroke);
  root.style.setProperty("--stroke-soft", theme.strokeSoft);
  root.style.setProperty("--overlay-strong", theme.overlayStrong);
  root.style.setProperty("--overlay", theme.overlay);
  root.style.setProperty("--overlay-soft", theme.overlaySoft);
  root.style.setProperty("--card-surface", theme.cardSurface);
  root.style.setProperty("--card-border", theme.cardBorder);
  root.style.setProperty("--card-ink", theme.cardInk);
  root.style.setProperty("--card-ink-muted", theme.cardInkMuted);
  root.style.setProperty("--bg-image", backgroundImage ? `url(${backgroundImage})` : "none");
};

export const extractThemeFromImage = (dataUrl: string) =>
  new Promise<ThemeColors>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        resolve(defaultThemeColors);
        return;
      }

      const sampleSize = 32;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      context.drawImage(image, 0, 0, sampleSize, sampleSize);
      const data = context.getImageData(0, 0, sampleSize, sampleSize).data;

      let rTotal = 0;
      let gTotal = 0;
      let bTotal = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 10) continue;
        rTotal += data[i];
        gTotal += data[i + 1];
        bTotal += data[i + 2];
        count += 1;
      }

      if (!count) {
        resolve(defaultThemeColors);
        return;
      }

      resolve(
        createThemeFromBase({
          r: Math.round(rTotal / count),
          g: Math.round(gTotal / count),
          b: Math.round(bTotal / count),
        }),
      );
    };
    image.onerror = () => resolve(defaultThemeColors);
    image.src = dataUrl;
  });
