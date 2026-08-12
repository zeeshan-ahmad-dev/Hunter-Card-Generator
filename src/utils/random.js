import { PFPS } from "../constants/pfps";
import { RANDOM_QUOTES } from "../constants/quotes";
import {
  CLASSES,
  RANDOM_NAMES,
  RANDOM_TITLES,
  RANKS,
} from "../constants/stats";
import { THEMES } from "../constants/themes";

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomDraft() {
  return {
    avatar: randomFrom(PFPS),
    name: randomFrom(RANDOM_NAMES),
    rank: randomFrom(RANKS),
    level: String(Math.floor(Math.random() * 90) + 10),
    title: randomFrom(RANDOM_TITLES),
    date: new Date().toISOString().slice(0, 10),
    quote: randomFrom(RANDOM_QUOTES),
    theme: randomFrom(Object.keys(THEMES)),
    stats: {
      strength: Math.floor(Math.random() * 100),
      agility: Math.floor(Math.random() * 100),
      intelligence: Math.floor(Math.random() * 100),
      vitality: Math.floor(Math.random() * 100),
      perception: Math.floor(Math.random() * 100),
    },
  };
}