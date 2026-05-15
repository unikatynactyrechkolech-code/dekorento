import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import crypto from "crypto";

/**
 * Vrací podepsaný payload pro přímý upload do Cloudinary z prohlížeče.
 * Frontend pošle FormData přímo na https://api.cloudinary.com/v1_1/<cloud>/image/upload
 *
 * ENV:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary není nakonfigurované (CLOUDINARY_CLOUD_NAME, _API_KEY, _API_SECRET)" },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "dekorento/products";
  const params = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(params + apiSecret).digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
