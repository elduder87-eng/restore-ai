// api/chat.js

import { Redis } from "@upstash/redis";

/*
-----------------------------------
UPSTASH REDIS CONNECTION
(Vercel auto-injects env variables)
-----------------------------------
*/
const redis = Redis.fromEnv();

/*
-----------------------------------
DEFAULT STUDENT MEMORY
-----------------------------------
*/
const DEFAULT_MEMORY = {
  name: "Student",
  preferences: {
    style: "guided", // guided | direct
    difficulty: "medium",
  },
  history: [],
  insights: {
    prefersDirectAnswers: false,
    oftenConfused: false,
    curiosityLevel: 5,
  },
};

/*
-----------------------------------
LOAD MEMORY
-----------------------------------
*/
async function loadMemory(id = "default") {
  const data = await redis.get(`student:${id}`);
  return data || DEFAULT_MEMORY;
}

/*
-----------------------------------
SAVE MEMORY
-----------------------------------
*/
async function saveMemory
