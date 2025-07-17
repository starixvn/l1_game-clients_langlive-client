export const getRootDomain = (hostname: string): string => {
  // Handle localhost
  if (hostname === "localhost") {
    return "lumigame.com";
  }

  const parts = hostname.split(".");
  if (parts.length <= 2) {
    return hostname;
  }
  return parts.slice(-2).join(".");
};

export const generateGameUrl = (
  subDomain: string,
  subPath: string,
  gameId: number,
  params: URLSearchParams
): string => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const rootDomain = getRootDomain(hostname);
  const newDomain = `${subDomain ? subDomain + "." : ""}${rootDomain}`;
  return `${protocol}//${newDomain}${subPath}/game-ll-${gameId}/?${params.toString()}`;
};
