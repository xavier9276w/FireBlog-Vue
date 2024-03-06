import { db } from "./firebaseInit"; // Adjust this path to where you initialize your Firebase app and Firestore

// Function from the previous example to generate a Firebase-friendly ID
function generateFirebaseDocID(inputString) {
  // Replace spaces with underscores (or remove them, depending on your preference)
  let docId = inputString.replace(/\s+/g, "_");

  // Remove or replace other unwanted characters, like slashes, periods, etc.
  // This is a basic set; adjust according to your needs
  docId = docId.replace(/[\.\*\/\[\]]/g, "");

  // Encode to ensure UTF-8 compliance and remove leading/trailing underscores
  docId = encodeURIComponent(docId).replace(/^_+|_+$/g, "");

  // Ensure the docId is under 256 characters
  if (docId.length > 240) {
    docId = docId.substring(0, 240);
  }

  return docId;
}

async function ensureUniqueDocId(baseId) {
  let uniqueId = baseId;
  let exists = true;
  let counter = 0;

  while (exists) {
    const docRef = db.collection("blogPosts").doc(uniqueId);
    const doc = await docRef.get();

    if (doc.exists) {
      console.log(`There is already blog post with the same ID ${baseId}`);
      counter++;
      uniqueId = `${baseId}_${counter}`;
    } else {
      console.log(`There is no blog post with this ID ${baseId}`);
      exists = false;
    }
  }

  return uniqueId;
}

// This is the function you'll call from your components
async function getUniqueDocId(inputData) {
  let baseId = generateFirebaseDocID(inputData);
  const uniqueDocId = await ensureUniqueDocId(baseId);
  return uniqueDocId;
}

export { getUniqueDocId };
