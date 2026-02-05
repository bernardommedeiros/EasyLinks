import { db } from "@/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";

export async function updateSectionStats(
  sectionId: string,
  changes: {
    totalLinks?: number;
    totalTags?: number;
    totalAccesses?: number;
    totalUsers?: number;
  }
) {
  const ref = doc(db, "stats", "sections", "data", sectionId);

  const payload: any = {
    updatedAt: serverTimestamp(),
  };

  if (changes.totalLinks)
    payload.totalLinks = increment(changes.totalLinks);

  if (changes.totalTags)
    payload.totalTags = increment(changes.totalTags);

  if (changes.totalAccesses)
    payload.totalAccesses = increment(changes.totalAccesses);

  if (changes.totalUsers)
    payload.totalUsers = increment(changes.totalUsers);

  await setDoc(ref, payload, { merge: true });
}