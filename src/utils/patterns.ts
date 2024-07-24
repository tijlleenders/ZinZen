export function replaceUrlsWithText(inputString: string) {
  const urlRegex = /(?:tel:\s*\+?\d{10,}|https?:\/\/[\w.-]+\.[\w]{2,}(?:\/[\S]*)?|\b[\w.-]+\.[\w]{2,}(?:\/[\S]*)?)/gi;

  const urlsWithIndexes: { [key: string]: string } = {};
  const replacedString = inputString.replace(urlRegex, (url, index) => {
    let normalizedUrl = url.trim();
    if (normalizedUrl.startsWith("tel:")) {
      normalizedUrl = normalizedUrl.replace(/\s+/g, "");
    } else if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    urlsWithIndexes[index.toString()] = normalizedUrl;
    return `zURL-${index}`;
  });

  return { replacedString, urlsWithIndexes };
}

export function summarizeUrl(url: string) {
  const domainMatch = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im);

  if (domainMatch) {
    const domain = domainMatch[1];
    const domainParts = domain.split(".");
    const relevantParts = domainParts.filter((part) => !["com", "net", "org", "www"].includes(part));
    return relevantParts.slice(-2).join(".");
  }
  return "";
}

export function isJSONParsable(str: string | null | undefined): boolean {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export const extractLinks = (text: string) => {
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const matches = text.match(urlPattern);
  return matches || [];
};

export const containsLink = (text: string) => {
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  return urlPattern.test(text);
};
