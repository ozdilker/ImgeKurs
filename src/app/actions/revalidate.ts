"use server";

import { revalidatePath } from "next/cache";

export async function revalidateSiteLayout() {
  revalidatePath("/", "layout");
}

export async function revalidateGururPage() {
  revalidatePath("/basarilarimiz");
}

export async function revalidateProgramPages() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/egitimlerimiz");
  revalidatePath("/egitim-programi");
  revalidatePath("/egitim-detay", "layout");
}

export async function revalidateHakkimizdaPage() {
  revalidatePath("/sayfa/hakkimizda");
}

export async function revalidateGalleryPage() {
  revalidatePath("/galeri");
}
