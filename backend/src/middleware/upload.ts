import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }
  // In Vercel / serverless environments, /tmp is the only writable directory
  if (process.env.VERCEL) {
    return path.resolve("/tmp/uploads");
  }
  // Fallback to project uploads directory
  const localDefault = path.resolve(process.cwd(), "uploads");
  return localDefault;
}

export const UPLOADS_DIR = getUploadsDir();

// Ensure persistent uploads directory exists
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (_err) {
    // Gracefully ignore directory creation issues in read-only/serverless environments
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, getUploadsDir());
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const randomHex = crypto.randomBytes(8).toString("hex");
      const safeName = `product-${Date.now()}-${randomHex}${ext}`;
      cb(null, safeName);
    }
  });

  const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ]);

  export const uploadMiddleware = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB per image
    },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid image type: ${file.mimetype}. Allowed: JPG, PNG, WEBP, GIF.`));
      }
    }
  });

  /**
   * Persists an uploaded file to storage:
   * 1. If Cloudinary credentials exist (CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET or CLOUDINARY_URL),
   *    uploads to Cloudinary and returns the permanent HTTPS CDN URL.
   * 2. Otherwise returns the persistent volume URL `/uploads/${file.filename}`.
   */
  export async function persistUploadedFile(file: Express.Multer.File): Promise<string> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = `folder=jabour_phone&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

        const fileBuffer = fs.readFileSync(file.path);
        const base64Data = `data:${file.mimetype};base64,${fileBuffer.toString("base64")}`;

        const formData = new URLSearchParams();
        formData.append("file", base64Data);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", "jabour_phone");

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          const result = (await response.json()) as { secure_url?: string };
          if (result.secure_url) {
            // Clean up local temp file once safely uploaded to Cloudinary
            try {
              fs.unlinkSync(file.path);
            } catch {
              // Ignore unlink errors
            }
            return result.secure_url;
          }
        } else {
          const errorText = await response.text();
          console.warn(`[Cloudinary] Upload failed (${response.status}): ${errorText}. Falling back to persistent disk.`);
        }
      } catch (cloudErr) {
        console.warn("[Cloudinary] Upload error, falling back to local persistent disk:", cloudErr);
      }
    }

    // Persistent volume storage URL
    return `/uploads/${file.filename}`;
  }
