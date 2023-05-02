import { generateZebraUrl, generateZebraHeader } from './challenge-resolver';

export interface AntiBotSession {
  rbzid: string | undefined;
  rbzsessionid: string | undefined;
}

const fetchSeed = async (): Promise<string> => {
  const headers = new Headers({
    'accept-language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7,ru;q=0.6',
  });

  const response = await fetch('https://myvisit.com/', { headers, credentials: 'omit' });
  const text = await response.text();

  const match = text.match(/"seed":"([^"]+)"/)?.[1];
  if (!match) {
    throw new Error('Failed to get seed for antibot system');
  }

  return match.replace(/\\\//g, '/');
};

export const refreshAntibotSession = async (): Promise<void> => {
  const seed = await fetchSeed();

  const url = generateZebraUrl();
  const header = generateZebraHeader(seed);
  const headers = new Headers(header);

  // This sets the new antibot cookies
  await fetch(url, { headers, credentials: 'include' });
};
