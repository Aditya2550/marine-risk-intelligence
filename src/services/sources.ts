
export interface SourceItem {
  id: string;
  source: 'twitter' | 'news' | 'official_alert' | 'citizen_report';
  content: string;
  timestamp: Date;
  location?: string;
  author?: string;
}

const LOCATIONS = [
  'Marina Beach, Chennai', 'Kovalam Beach, Kerala', 'Juhu Beach, Mumbai', 
  'Puri Beach, Odisha', 'Calangute, Goa', 'Rushikonda, Vizag',
  'Deep Ocean', 'Coastal Karnataka', 'Andaman Islands', 'Gulf of Mannar'
];

const HAZARD_KEYWORDS = [
  'tsunami', 'high waves', 'flooding', 'storm surge', 'cyclone', 
  'oil spill', 'dead fish', 'erosion', 'rip current', 'red tide'
];

const NOISE_TEMPLATES = [
  "Just had the best ice cream at {location}!",
  "Traffic is terrible near {location} today.",
  "Looking for recommendations for a good seafood restaurant in {location}.",
  "The sunset was beautiful at {location} yesterday.",
  "Can't wait for the weekend beach trip!",
  "Why is it so hot today? #summer",
  "Check out my new sunglasses!",
  "Anyone want to play volleyball at {location}?"
];

const HAZARD_TEMPLATES = [
  "URGENT: Water levels rising rapidly at {location}. Please evacuate!",
  "Fishermen report unusually high {keyword} near {location}.",
  "Breaking: {keyword} warning issued for {location} coast.",
  "Scary scenes at {location}, looks like a {keyword} is approaching.",
  "Massive {keyword} observed. Authorities suggest staying away from the water.",
  "Report: Several houses inundated due to {keyword} at {location}.",
  "Alert: {keyword} detected 50km off the coast of {location}."
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const generateMockSourceItem = (): SourceItem => {
  const isHazard = Math.random() > 0.7; // 30% chance of being a relevant hazard
  const location = getRandomElement(LOCATIONS);
  const keyword = getRandomElement(HAZARD_KEYWORDS);
  
  let content = "";
  let source: SourceItem['source'] = 'twitter';

  if (isHazard) {
    content = getRandomElement(HAZARD_TEMPLATES)
      .replace('{location}', location)
      .replace('{keyword}', keyword);
    
    const rand = Math.random();
    if (rand > 0.6) source = 'news';
    else if (rand > 0.8) source = 'official_alert';
    else source = 'twitter';
  } else {
    content = getRandomElement(NOISE_TEMPLATES)
      .replace('{location}', location);
    source = Math.random() > 0.5 ? 'twitter' : 'citizen_report';
  }

  return {
    id: Math.random().toString(36).substring(7),
    source,
    content,
    timestamp: new Date(),
    location,
    author: source === 'twitter' ? `@user_${Math.floor(Math.random() * 1000)}` : 'System'
  };
};
