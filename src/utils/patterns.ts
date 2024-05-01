export function replaceUrlsWithText(inputString: string) {
  const urlRegex =
    /(?:tel:\s*\+?[0-9]{10,15}|(?:https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\S]*)?|\b[\w.-]+\.[a-zA-Z]{2,}(?:\/[\S]*)?)/gi;

  const urlsWithIndexes: { [key: string]: string } = {};
  const replacedString = inputString.replace(urlRegex, (url, index) => {
    let modifiedUrl = url;
    if (url.startsWith("tel:")) {
      modifiedUrl = url.replace(/\s/g, "");
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      modifiedUrl = `https://${url}`;
    }
    urlsWithIndexes[index] = modifiedUrl;
    return `zURL-${index}`;
  });

  return { replacedString, urlsWithIndexes };
}

export function summarizeUrl(url: string) {
  const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im);
  if (match) {
    const domain = match[1];
    const domainParts = domain.split(".");
    if (domainParts.length > 1) {
      const extractedDomain = domainParts[domainParts.length - 2];
      if (extractedDomain.length > 7) {
        const firstPart = extractedDomain.substring(0, 4);
        const lastPart = extractedDomain.slice(-3);
        return `${firstPart}..${lastPart}`;
      }
      return extractedDomain;
    }
    return "";
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
