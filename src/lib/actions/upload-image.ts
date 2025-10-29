"use server"

import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Server action to upload menu images to /public/menu/
 * Images are saved locally and served via Next.js static files
 */
export async function uploadMenuImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No se proporcionó ningún archivo" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "El archivo debe ser una imagen" }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: "La imagen debe ser menor a 5MB" }
    }

    // Get file extension
    const ext = path.extname(file.name).toLowerCase()
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

    if (!allowedExtensions.includes(ext)) {
      return {
        success: false,
        error: "Formato no permitido. Usa JPG, PNG, GIF o WebP"
      }
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const nameWithoutExt = path.basename(file.name, ext)
    const sanitizedName = nameWithoutExt
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .replace(/-+/g, "-")
    const filename = `${timestamp}-${sanitizedName}${ext}`

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public", "menu")

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = `/menu/${filename}`

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: "Error al subir la imagen. Inténtalo de nuevo.",
    }
  }
}

/**
 * Get all images from /public/menu/ directory
 * Used for image gallery/selector
 *
 * In production (Vercel), imports static JSON file generated at build time
 * In development, reads directory directly for real-time updates
 */
export async function listMenuImages(): Promise<string[]> {
  try {
    // In production, import pre-generated JSON index
    if (process.env.NODE_ENV === "production") {
      try {
        // Import the JSON file that was generated during build
        const images = await import("../../../public/menu/images.json")
        return images.default || []
      } catch (error) {
        console.error("Error importing images.json:", error)
        return []
      }
    }

    // In development, read directory directly for real-time updates
    const { readdir } = await import("fs/promises")
    const menuDir = path.join(process.cwd(), "public", "menu")

    // Create directory if it doesn't exist
    if (!existsSync(menuDir)) {
      await mkdir(menuDir, { recursive: true })
      return []
    }

    const files = await readdir(menuDir)

    // Filter only image files and return public URLs
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })
      .map(file => `/menu/${file}`)
      .sort()
      .reverse() // Most recent first

    return imageFiles
  } catch (error) {
    console.error("Error listing images:", error)
    return []
  }
}

/**
 * Delete an image from /public/menu/ directory
 * Only works in development/localhost
 */
export async function deleteMenuImage(imageUrl: string): Promise<UploadResult> {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return {
        success: false,
        error: "La eliminación de imágenes solo está disponible en localhost"
      }
    }

    // Extract filename from URL
    const filename = path.basename(imageUrl)

    // Validate filename (security check)
    if (!filename || filename.includes("..") || filename.includes("/")) {
      return {
        success: false,
        error: "Nombre de archivo inválido"
      }
    }

    const filePath = path.join(process.cwd(), "public", "menu", filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return {
        success: false,
        error: "La imagen no existe"
      }
    }

    // Delete the file
    const { unlink } = await import("fs/promises")
    await unlink(filePath)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      error: "Error al eliminar la imagen"
    }
  }
}
