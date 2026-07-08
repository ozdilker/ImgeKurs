import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getClientStorage, isFirebaseConfigured } from "./client";

export async function uploadImage(
  file: File,
  folder = "uploads"
): Promise<string> {
  const storage = getClientStorage();

  if (storage && isFirebaseConfigured()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Yükleme başarısız");
  }
  const data = await res.json();
  return data.url as string;
}
