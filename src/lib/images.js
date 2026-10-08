import { supabase } from "./supabase";

const BUCKET = "product-images";
const MAX_EDGE = 2000;

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const toBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

// shrink + convert in the browser before uploading
async function prepareImage(file) {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  let blob = await toBlob(canvas, "image/webp", 0.85);

  // some browsers can't encode WebP, so fall back to JPEG on white
  if (!blob || blob.type !== "image/webp") {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    blob = await toBlob(canvas, "image/jpeg", 0.88);
  }

  if (!blob) throw new Error("Couldn't process that image.");
  return blob;
}

export async function uploadProductImage(file) {
  let blob;
  try {
    blob = await prepareImage(file);
  } catch {
    throw new Error(`${file.name}: couldn't read this image.`);
  }

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const pathFromUrl = (url) => url.split(`/${BUCKET}/`)[1];

// best effort: a failure here shouldn't block saving
export async function removeImages(urls) {
  const paths = urls.map(pathFromUrl).filter(Boolean);
  if (paths.length === 0) return;
  await supabase.storage.from(BUCKET).remove(paths);
}