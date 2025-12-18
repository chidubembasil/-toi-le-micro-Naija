/**
 * Cloudinary upload service
 * Configure with your Cloudinary cloud name
 */

const CLOUDINARY_CLOUD_NAME = "your-cloud-name"; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "atoile_naija"; // Replace with your upload preset

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: string;
  type: string;
  created_at: string;
  original_filename: string;
}

/**
 * Upload a file to Cloudinary
 * @param file - File to upload
 * @param resourceType - Type of resource (image, video, auto)
 * @returns Upload response with file details
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("resource_type", resourceType);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Generate optimized Cloudinary URL
 * @param publicId - Public ID from upload response
 * @param options - Transformation options
 * @returns Optimized URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;

  let url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  if (transforms.length > 0) {
    url += transforms.join(",") + "/";
  }

  url += publicId;

  return url;
}

/**
 * Delete a file from Cloudinary
 * Requires backend API call for security
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch("/api/media/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}
