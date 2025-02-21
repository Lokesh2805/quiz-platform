import { openDB } from "idb";

const DB_NAME = "quizDB";
const STORE_NAME = "quizAttempts";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Save a quiz attempt
export const saveAttempt = async (score, totalQuestions) => {
  const db = await initDB();
  const timestamp = new Date().toLocaleString();
  return db.add(STORE_NAME, { score, totalQuestions, timestamp });
};

// Get all attempts
export const getAttempts = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
