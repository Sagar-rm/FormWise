// src/lib/mock-firebase.js

// Mock APP
export function initializeApp() {
  return {};
}

// Mock AUTH
const mockUser = {
  uid: "demo-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
  emailVerified: true,
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
};

let authStateListeners = [];
let currentUser = null;

// Load user from localStorage if present
const storedUser = localStorage.getItem("mock_firebase_user");
if (storedUser) {
  currentUser = JSON.parse(storedUser);
}

function notifyAuthState() {
  authStateListeners.forEach(cb => cb(currentUser));
}

export const auth = {
  get currentUser() {
    return currentUser;
  }
};

export function getAuth() {
  return auth;
}

export function onAuthStateChanged(/* authObj */_a, callback) {
  authStateListeners.push(callback);
  // Trigger callback immediately with current user
  setTimeout(() => callback(currentUser), 0);
  return () => {
    authStateListeners = authStateListeners.filter(cb => cb !== callback);
  };
}

// eslint-disable-next-line no-unused-vars
export async function signInWithEmailAndPassword(_a, email, _p) {
  currentUser = {
    uid: "demo-user-123",
    email: email || "demo@example.com",
    displayName: email ? email.split('@')[0] : "Demo User",
    emailVerified: true,
  };
  localStorage.setItem("mock_firebase_user", JSON.stringify(currentUser));
  notifyAuthState();
  return { user: currentUser };
}

// eslint-disable-next-line no-unused-vars
export async function createUserWithEmailAndPassword(_a, email, _p) {
  currentUser = {
    uid: "demo-user-123",
    email: email,
    displayName: email.split('@')[0],
    emailVerified: true,
  };
  localStorage.setItem("mock_firebase_user", JSON.stringify(currentUser));
  notifyAuthState();
  return { user: currentUser };
}

// eslint-disable-next-line no-unused-vars
export async function signInWithPopup(_a, _b) {
  currentUser = mockUser;
  localStorage.setItem("mock_firebase_user", JSON.stringify(currentUser));
  notifyAuthState();
  return { user: currentUser };
}

export class GoogleAuthProvider {
  addScope() {}
}
export class GithubAuthProvider {
  addScope() {}
}

export async function signOut() {
  currentUser = null;
  localStorage.removeItem("mock_firebase_user");
  notifyAuthState();
}

export async function setPersistence() {}
export const browserLocalPersistence = {};
export const browserSessionPersistence = {};

export async function updateProfile(userObj, { displayName, photoURL }) {
  if (currentUser) {
    if (displayName) currentUser.displayName = displayName;
    if (photoURL) currentUser.photoURL = photoURL;
    localStorage.setItem("mock_firebase_user", JSON.stringify(currentUser));
    notifyAuthState();
  }
}

// Mock FIRESTORE
export const db = {};

export function getFirestore() {
  return db;
}

function convertTimestamps(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val && typeof val === 'object' && val.seconds !== undefined) {
        newObj[key] = {
          toDate: () => new Date(val.seconds * 1000),
          seconds: val.seconds,
          nanoseconds: 0
        };
      } else if (val && (key === 'createdAt' || key === 'updatedAt' || key === 'submittedAt' || key === 'lastResponseAt' || key === 'readAt') && typeof val === 'string') {
        const d = new Date(val);
        newObj[key] = {
          toDate: () => d,
          seconds: Math.floor(d.getTime() / 1000),
          nanoseconds: 0
        };
      } else if (typeof val === 'object') {
        newObj[key] = convertTimestamps(val);
      } else {
        newObj[key] = val;
      }
    }
  }
  return newObj;
}

function getCollectionData(collectionName) {
  const data = localStorage.getItem(`mock_firestore_${collectionName}`);
  return data ? JSON.parse(data) : [];
}

function saveCollectionData(collectionName, data) {
  localStorage.setItem(`mock_firestore_${collectionName}`, JSON.stringify(data));
  notifySnapshots(collectionName);
}

let snapshotListeners = [];
function notifySnapshots(collectionName) {
  snapshotListeners.forEach(listener => {
    if (listener.collectionName === collectionName) {
      listener.trigger();
    }
  });
}

export function collection(dbObj, collectionName) {
  return { type: 'collection', name: collectionName };
}

export function doc(dbObj, collectionName, docId) {
  if (typeof dbObj === 'object' && dbObj.type === 'collection') {
    return { type: 'doc', collectionName: dbObj.name, docId };
  }
  return { type: 'doc', collectionName, docId };
}

export async function addDoc(collectionRef, data) {
  const collectionName = collectionRef.name;
  const docs = getCollectionData(collectionName);
  const newId = Math.random().toString(36).substring(2, 15);
  const newDoc = { ...data, id: newId };
  docs.push(newDoc);
  saveCollectionData(collectionName, docs);
  return { id: newId };
}

export async function updateDoc(docRef, updates) {
  const { collectionName, docId } = docRef;
  const docs = getCollectionData(collectionName);
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    const updated = { ...docs[index] };
    Object.keys(updates).forEach(key => {
      const val = updates[key];
      if (val && typeof val === 'object' && val.__type === 'increment') {
        updated[key] = (updated[key] || 0) + val.value;
      } else if (val && typeof val === 'object' && val.__type === 'arrayUnion') {
        const currentArr = Array.isArray(updated[key]) ? updated[key] : [];
        const toAdd = val.elements.filter(el => !currentArr.includes(el));
        updated[key] = [...currentArr, ...toAdd];
      } else if (val && typeof val === 'object' && val.__type === 'arrayRemove') {
        const currentArr = Array.isArray(updated[key]) ? updated[key] : [];
        updated[key] = currentArr.filter(el => !val.elements.includes(el));
      } else {
        updated[key] = val;
      }
    });
    docs[index] = updated;
    saveCollectionData(collectionName, docs);
  }
}

export async function setDoc(docRef, data, options) {
  const { collectionName, docId } = docRef;
  const docs = getCollectionData(collectionName);
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    if (options && options.merge) {
      const updated = { ...docs[index] };
      Object.keys(data).forEach(key => {
        const val = data[key];
        if (val && typeof val === 'object' && val.__type === 'increment') {
          updated[key] = (updated[key] || 0) + val.value;
        } else if (val && typeof val === 'object' && val.__type === 'arrayUnion') {
          const currentArr = Array.isArray(updated[key]) ? updated[key] : [];
          const toAdd = val.elements.filter(el => !currentArr.includes(el));
          updated[key] = [...currentArr, ...toAdd];
        } else if (val && typeof val === 'object' && val.__type === 'arrayRemove') {
          const currentArr = Array.isArray(updated[key]) ? updated[key] : [];
          updated[key] = currentArr.filter(el => !val.elements.includes(el));
        } else {
          updated[key] = val;
        }
      });
      docs[index] = updated;
    } else {
      docs[index] = { ...data, id: docId };
    }
  } else {
    docs.push({ ...data, id: docId });
  }
  saveCollectionData(collectionName, docs);
}

export async function deleteDoc(docRef) {
  const { collectionName, docId } = docRef;
  const docs = getCollectionData(collectionName);
  const filtered = docs.filter(d => d.id !== docId);
  saveCollectionData(collectionName, filtered);
}

export async function getDoc(docRef) {
  const { collectionName, docId } = docRef;
  const docs = getCollectionData(collectionName);
  const found = docs.find(d => d.id === docId);
  return {
    exists: () => !!found,
    id: docId,
    data: () => convertTimestamps(found),
  };
}

export async function getDocs(queryObj) {
  const collectionName = queryObj.collectionName || queryObj.name;
  let docs = getCollectionData(collectionName);

  if (queryObj.constraints) {
    queryObj.constraints.forEach(c => {
      if (c.type === 'where') {
        const { field, op, value } = c;
        if (op === '==') {
          docs = docs.filter(d => d[field] === value);
        } else if (op === 'in') {
          docs = docs.filter(d => Array.isArray(value) && value.includes(d[field]));
        }
      }
    });
  }

  return {
    docs: docs.map(d => ({
      id: d.id,
      data: () => convertTimestamps(d),
    })),
  };
}

export function query(collectionRef, ...constraints) {
  return {
    type: 'query',
    collectionName: collectionRef.name,
    constraints: constraints.filter(c => c),
  };
}

export function where(field, op, value) {
  return { type: 'where', field, op, value };
}

export function orderBy(field, direction = 'asc') {
  return { type: 'orderBy', field, direction };
}

export function limit(n) {
  return { type: 'limit', value: n };
}

// eslint-disable-next-line no-unused-vars
export function onSnapshot(queryObj, onNext, _onError) {
  const collectionName = queryObj.collectionName || queryObj.name;
  
  const trigger = () => {
    let docs = getCollectionData(collectionName);
    
    if (queryObj.constraints) {
      queryObj.constraints.forEach(c => {
        if (c.type === 'where') {
          const { field, op, value } = c;
          if (op === '==') {
            docs = docs.filter(d => d[field] === value);
          } else if (op === 'in') {
            docs = docs.filter(d => Array.isArray(value) && value.includes(d[field]));
          }
        }
      });
    }

    onNext({
      docs: docs.map(d => ({
        id: d.id,
        data: () => convertTimestamps(d),
      })),
    });
  };

  setTimeout(trigger, 0);

  const listener = { collectionName, trigger };
  snapshotListeners.push(listener);

  return () => {
    snapshotListeners = snapshotListeners.filter(l => l !== listener);
  };
}

export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
  }),
};

export function increment(n) {
  return { __type: 'increment', value: n };
}

export function serverTimestamp() {
  return Timestamp.now();
}

export function arrayUnion(...elements) {
  return { __type: 'arrayUnion', elements };
}

export function arrayRemove(...elements) {
  return { __type: 'arrayRemove', elements };
}

// Mock STORAGE & ANALYTICS
export function getStorage() {
  return {};
}

export function getAnalytics() {
  return {};
}
