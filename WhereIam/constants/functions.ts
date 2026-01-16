export const getReadableTextColor = (hex: string): string => {
  if (!hex || hex.length < 7) return "#111";
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export const shortenLink = (url: string, max = 60) => {
  if (!url) return "";
  if (url.length <= max) return url;
  const headLen = Math.ceil(max * 0.6);
  const tailLen = max - headLen;
  return `${url.slice(0, headLen)}...${url.slice(-tailLen)}`;
};

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function averageColors(colors: string[]): string {
  const total = colors.length;
  const sum = colors.reduce(
    (acc, hex) => {
      const [r, g, b] = hexToRgb(hex);
      return [acc[0] + r, acc[1] + g, acc[2] + b];
    },
    [0, 0, 0]
  );

  const avg = sum.map((val) => Math.round(val / total)) as [
    number,
    number,
    number
  ];
  return rgbToHex(avg);
}