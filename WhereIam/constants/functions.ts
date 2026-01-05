export const getReadableTextColor = (hex: string): string => {
  if (!hex || hex.length < 7) return "#111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
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