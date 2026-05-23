import { getStorage, readFlag, writeFlag, removeFlag } from "../../shared/services/storage.js";

export class UrgencyBannerService {
  isDismissed(key, mode = "session") {
    const storage = getStorage(mode);
    return readFlag(storage, key);
  }

  setDismissed(key, mode = "session") {
    const storage = getStorage(mode);
    writeFlag(storage, key);
  }

  clearDismissed(key, mode = "session") {
    const storage = getStorage(mode);
    removeFlag(storage, key);
  }
}
