export function getStorage(mode = "session") {
  try {
    return mode === "local" ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

export function readFlag(storage, key) {
  if (!storage) return false;
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeFlag(storage, key) {
  if (!storage) return;
  try {
    storage.setItem(key, "1");
  } catch {}
}

export function removeFlag(storage, key) {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {}
}
