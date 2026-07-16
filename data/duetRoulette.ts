export type SectionId =
  | "hero"
  | "power"
  | "problem"
  | "promise"
  | "logline"
  | "centerpiece"
  | "you-are-in"
  | "roulette"
  | "partnership"
  | "phases"
  | "meet-the-duets"
  | "duet-duels"
  | "fate-of-eight"
  | "host"
  | "creators"
  | "finale";

export type Partner = {
  name: string;
  title: string;
  imageLabel: string;
  accent: string;
};

export type SpinPartner = {
  id: "colbie" | "kylie" | "mya" | "miranda";
  name: string;
  shortName: string;
  firstName: string;
  title: string;
  descriptor: string;
  imageLabel: string;
  imageSrc: string;
  image: string;
  accent: string;
  clue: [string, string];
};

export type DuetOpponent = {
  id: "tim-jojo" | "jenny-michelle" | "tom-chris" | "kevin-justin";
  contestantName: string;
  partnerName: string;
  fullLabel: string;
};

export const sectionOrder: { id: SectionId; menuLabel: string }[] = [
  { id: "hero", menuLabel: "Concept" },
  { id: "problem", menuLabel: "The Problem" },
  { id: "logline", menuLabel: "Logline" },
  { id: "centerpiece", menuLabel: "Centerpiece" },
  { id: "roulette", menuLabel: "Play the Format" },
  { id: "phases", menuLabel: "Series Arc" },
  { id: "host", menuLabel: "Host" },
  { id: "creators", menuLabel: "Creators" },
];

export const hero = {
  eyebrow: "FIGHT FOR THE SPOTLIGHT",
  title: ["DUET", "ROULETTE"],
  creators: "KEVIN LEMAN II & KRIS LYTHGOE",
  cta: "ENTER THE SPOTLIGHT",
  backgroundImage: "/images/duet/slide1bg.png",
};

export const powerPanels = [
  {
    title: "OLD TOWN ROAD",
    subtitle: "Lil Nas X + Billy Ray Cyrus",
    body: "BECAME THE MOST STREAMED SONG ON SPOTIFY.",
    imageLabel: "Old Town Road image",
    imageSrc: "/duetposter.png",
    imagePosition: "center center",
  },
  {
    title: "SUNFLOWER",
    subtitle: "Swae Lee + Post Malone",
    body: "UNTIL ANOTHER DUET TOOK THE CROWN.",
    imageLabel: "Sunflower image",
    imageSrc: "/duetposter1.png",
    imagePosition: "center 22%",
  },
  {
    title: "DIE WITH A SMILE",
    subtitle: "Lady Gaga + Bruno Mars",
    body: "LAST YEARS TOP GLOBAL HIT.",
    imageLabel: "Die With a Smile image",
    imageSrc: "/duetposter2.png",
    imagePosition: "center center",
  },
];

export const partners: Partner[] = [
  {
    name: "Kylie Minogue",
    title: "INTERNATIONAL ICON",
    imageLabel: "Kylie Minogue",
    accent: "var(--accent-pink)",
  },
  {
    name: "Ruben Studdard",
    title: "SOUL POWERHOUSE",
    imageLabel: "Ruben Studdard",
    accent: "var(--accent-cyan)",
  },
  {
    name: "Mya",
    title: "POP-R&B FORCE",
    imageLabel: "M\u00fda",
    accent: "var(--accent-orange)",
  },
  {
    name: "Miranda Lambert",
    title: "GRAMMY-WINNING COUNTRY STAR",
    imageLabel: "Miranda Lambert",
    accent: "var(--accent-purple)",
  },
  {
    name: "Daniel Powter",
    title: "HOOK MACHINE",
    imageLabel: "Daniel Powter",
    accent: "var(--accent-lime)",
  },
  {
    name: "Colbie Caillat",
    title: "MELODY MAKER",
    imageLabel: "Colbie Caillat",
    accent: "var(--accent-cyan)",
  },
];

export const highlightedPartner = partners[0];

export const spinPartners: SpinPartner[] = [
  {
    id: "colbie",
    name: "COLBIE CAILLAT",
    shortName: "COLBIE",
    firstName: "COLBIE",
    title: "TWO-TIME GRAMMY WINNER",
    descriptor: "TWO-TIME GRAMMY WINNER",
    imageLabel: "Colbie Caillat",
    imageSrc: "/colbie.png",
    image: "/colbie.png",
    accent: "var(--accent-cyan)",
    clue: ["SHE’S WON", "TWO GRAMMY AWARDS."],
  },
  {
    id: "kylie",
    name: "KYLIE MINOGUE",
    shortName: "KYLIE",
    firstName: "KYLIE",
    title: "INTERNATIONAL ICON",
    descriptor: "INTERNATIONAL ICON",
    imageLabel: "Kylie Minogue",
    imageSrc: "/kylie.png",
    image: "/kylie.png",
    accent: "var(--accent-pink)",
    clue: ["SHE’S HAD A NUMBER ONE", "IN FOUR DIFFERENT DECADES."],
  },
  {
    id: "mya",
    name: "MÝA",
    shortName: "MÝA",
    firstName: "MÝA",
    title: "GRAMMY-WINNING ARTIST",
    descriptor: "GRAMMY-WINNING ARTIST",
    imageLabel: "MÝA",
    imageSrc: "/mya.png",
    image: "/mya.png",
    accent: "var(--accent-orange)",
    clue: ["SHE’S DUETED BEFORE", "AND WON A GRAMMY."],
  },
  {
    id: "miranda",
    name: "MIRANDA LAMBERT",
    shortName: "MIRANDA",
    firstName: "MIRANDA",
    title: "GRAMMY-WINNING COUNTRY STAR",
    descriptor: "GRAMMY-WINNING COUNTRY STAR",
    imageLabel: "Miranda Lambert",
    imageSrc: "/miranda.png",
    image: "/miranda.png",
    accent: "var(--accent-purple)",
    clue: ["SHE’S A COUNTRY SUPERSTAR", "WITH A GRAMMY ON HER SHELF."],
  },
];

export function getSpinPartnerById(id?: string | null) {
  if (!id) {
    return null;
  }

  return spinPartners.find((partner) => partner.id === id) ?? null;
}

export function getSpinPartnerByName(name?: string | null) {
  if (!name) {
    return null;
  }

  return spinPartners.find((partner) => partner.name === name || partner.shortName === name) ?? null;
}

export function resolveSpinPartner(value?: Partial<SpinPartner> | string | null) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return getSpinPartnerById(value) ?? getSpinPartnerByName(value);
  }

  return getSpinPartnerById(value.id) ?? getSpinPartnerByName(value.name ?? value.shortName ?? null);
}

export const duetGrid = [
  { contestant: "You", partner: "Kylie", accent: "var(--accent-pink)" },
  { contestant: "Ari", partner: "Colbie", accent: "var(--accent-cyan)" },
  { contestant: "Jules", partner: "Ruben", accent: "var(--accent-lime)" },
  { contestant: "Nia", partner: "Miranda", accent: "var(--accent-purple)" },
  { contestant: "Marcus", partner: "Mya", accent: "var(--accent-orange)" },
  { contestant: "Leo", partner: "Daniel", accent: "var(--accent-pink)" },
  { contestant: "Skye", partner: "Kylie", accent: "var(--accent-cyan)" },
  { contestant: "Tori", partner: "Ruben", accent: "var(--accent-lime)" },
];

export const duelOpponents: DuetOpponent[] = [
  { id: "tim-jojo", contestantName: "TIM", partnerName: "JOJO", fullLabel: "TIM + JOJO" },
  {
    id: "jenny-michelle",
    contestantName: "JENNY",
    partnerName: "MICHELLE WILLIAMS",
    fullLabel: "JENNY + MICHELLE WILLIAMS",
  },
  {
    id: "tom-chris",
    contestantName: "TOM",
    partnerName: "CHRIS MARTIN",
    fullLabel: "TOM + CHRIS MARTIN",
  },
  {
    id: "kevin-justin",
    contestantName: "KEVIN",
    partnerName: "JUSTIN",
    fullLabel: "KEVIN + JUSTIN",
  },
];

export const hostReferences = [
  { name: "Charlie Puth", imageLabel: "Charlie Puth", imageSrc: "/host1.png" },
  { name: "P!NK", imageLabel: "P!NK", imageSrc: "/host2.png" },
  { name: "Josh Groban", imageLabel: "Josh Groban", imageSrc: "/host3.png" },
];

export const imageAssets = {
  secretSilhouette: "Secret Superstar silhouette",
  centerpieceStage: "Centerpiece stage",
  duetStage: "Duet Duel stage",
  finalFour: "Final Four",
  reveal: "Secret Superstar reveal",
  host: "Host image",
  duetImage: "Duet image placeholder",
};

export const logline =
  "DUET ROULETTE is a singing showdown where talent and chance collide. Thirty-two undiscovered performers are paired with famous recording artists and battle through unpredictable Duet Duels. Only one will earn a life-changing place beside our Secret Superstar — and record the hit that could change everything.";

export const phaseDescriptions = [
  {
    number: "01",
    title: "SPIN FOR PAIRS, SING AS PAIRS",
    description: "Spin the roulette wheel to reveal the celebrity partnerships.",
  },
  {
    number: "02",
    title: "HEAD TO HEAD DUET",
    description: "Duet Duels: The contestants will be trained all week by their mentor — then they must spin the wheel to see who they sing head-to-head against in duet duels.",
  },
  {
    number: "03",
    title: "THE FATE OF EIGHT",
    description: "The Fate of the Final 8 sing head-to-head with shocking twists and our secret singer is finally revealed.",
  },
];

export const formatCopy = {
  problemLines: [
    "A MUSICAL SUPERSTAR",
    "HAS A BRAND-NEW HIT",
    "READY TO RECORD...",
    "...BUT SHE NEEDS",
    "SOMEONE TO SING IT",
    "WITH HER.",
  ],
  problemNote: "(BTW: WHO IS SHE?)",
  promiseWords: [
    "UNPREDICTABLE.",
    "EMOTIONAL.",
    "SHOW-STOPPING.",
    "LIFE-CHANGING.",
  ],
  promiseFinale: ["THIS IS", "DUET ROULETTE."],
  centerpieceBody: "THE ROULETTE WHEEL IS THE HEART OF THE SHOW.",
  centerpiecePrompt: "BUT THE BEST WAY TO UNDERSTAND IT IS TO PLAY IT.",
  contestant: {
    eyebrow: "CONGRATULATIONS.",
    title: ["YOU'RE ONE OF", "32 CONTESTANTS."],
    body: "You have the voice. Now chance decides your partner.",
    cta: "SPIN THE WHEEL",
  },
  roulette: {
    intro: "YOUR PARTNER IS...",
    cta: "MEET YOUR DUET",
  },
  partnership: {
    title: ["YOU'VE MET THE STAR.", "NOW FIND THE CHEMISTRY."],
    body: "Every contestant is paired with a famous performer. Together, they rehearse, perform and fight to stay in the competition. The star is a mentor and the contestant’s partner.",
    cta: "TAKE THE STAGE",
  },
  meetTheDuets: {
    episodeLabel: "EPISODES 1–4",
    stats: [
      "EACH EPISODE, 8 CONTESTANTS",
      "SPIN FOR A PROFESSIONAL PARTNER.",
      "ALL 8 DUETS PERFORM.",
      "THE TOP 4 ADVANCE.",
      "BY THE END OF PHASE 1,",
      "16 CONTESTANTS REMAIN.",
    ],
    body: "Across the opening episodes, each celebrity-and-contestant pairing performs together. The audience votes for the duets with the chemistry, star power and vocal impact to continue.",
    highlight: "Tonight, you and Kylie perform for survival.",
    cta: "PERFORM",
    resultTitle: "YOU'RE THROUGH.",
    next: "ENTER THE DUET DUELS",
  },
  duelDuels: {
    eyebrow: "THE WHEEL TURNS AGAIN.",
    episodeLabel: "EPISODES 5–8",
    stats: ["16 DUETS REMAIN.", "NOW THE CONTESTANTS BECOME THE WHEEL."],
    cta: "SPIN FOR YOUR OPPONENT",
    stakes: "ONE SONG. TWO DUETS. ONE SURVIVES.",
    styles: ["POWER BALLAD", "DANCE ANTHEM"],
    body: "The Duet Duels create direct rivalry. Each surviving pair is spun into a head-to-head matchup, turning every performance into an event with immediate stakes.",
    resultTitle: "YOU SURVIVE.",
    next: "FACE THE FINAL EIGHT",
  },
  fateOfEight: {
    episodeLabel: "EPISODES 9–10",
    title: ["KYLIE GOT YOU HERE.", "NOW YOU MUST EARN", "THE FINAL DUET."],
    body: "The celebrity partners guide their singers to the Final Four. In the finale, each contestant must prove they can stand beside the Secret Superstar.",
    statLines: [
      "FOUR FINALISTS.",
      "ONE SECRET SUPERSTAR.",
      "ONE PERFECT MATCH.",
    ],
    cta: "REVEAL THE SUPERSTAR",
  },
  superstar: {
    prompt: "THE SECRET SUPERSTAR IS...",
    name: "SIA",
    question: "BUT DOES SHE CHOOSE YOU?",
    cta: "FIND OUT",
    win: [
      "YOU'VE WON",
      "DUET ROULETTE.",
      "RECORD THE SINGLE.",
      "RELEASE IT TO THE WORLD.",
      "CLAIM THE SIGNING BONUS.",
      "TAKE YOUR PLACE IN THE SPOTLIGHT.",
    ],
  },
  host: {
    title: "HOST VIBES",
    body: "Our host is an enthusiastic, charismatic, quick-witted showman who is also a musician.",
    label: "ILLUSTRATIVE HOST REFERENCES",
  },
  creators: {
    title: "CREATED BY",
    names: ["KEVIN LEMAN II", "&", "KRIS LYTHGOE"],
    body: "Room reserved for future biographies, portraits and format credentials.",
  },
  finale: {
    title: ["THE NEXT GLOBAL HIT", "COULD BEGIN", "WITH A SPIN."],
    subtitle: ["DUET ROULETTE", "FIGHT FOR THE SPOTLIGHT"],
    replay: "REPLAY THE FORMAT",
    deck: "VIEW THE DECK",
    contact: "CONTACT THE CREATORS",
  },
};
