export function replaceUrlsWithText(inputString: string) {
  // Regular expression to match URLs
  const urlRegex = /(?:(?:https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\S]*)?|\b[\w.-]+\.[a-zA-Z]{2,}(?:\/[\S]*)?)/gi;

  // Find all URLs in the input string and store their indexes
  const urlsWithIndexes: { [index: number]: string } = {};
  const replacedString = inputString.replace(urlRegex, (url, index) => {
    let modifiedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      modifiedUrl = `http://${url}`;
    }
    urlsWithIndexes[index] = modifiedUrl;
    return `zURL-${index}`;
  });

  return { replacedString, urlsWithIndexes };
}
