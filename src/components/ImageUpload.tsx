"use client"

import { useRef, useState } from "react"
import { getUploadSignature } from "@/lib/cloudinary"

interface ImageUploadProps {
  name: string
}

export default function ImageUpload({ name }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const { timestamp, signature, folder, cloudName, apiKey } =
        await getUploadSignature()

      const formData = new FormData()
      formData.append("file", file)
      formData.append("timestamp", String(timestamp))
      formData.append("signature", signature)
      formData.append("folder", folder)
      formData.append("api_key", apiKey)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? "Upload failed")
      setUploadedUrl(data.secure_url)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed")
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {/* Hidden input carries the URL into the server action FormData */}
      <input type="hidden" name={name} value={uploadedUrl} />

      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-48 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-stone-400 transition-colors overflow-hidden bg-stone-50"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-4">
            <p className="text-sm text-stone-500">Click to select an image</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <p className="text-sm text-stone-600 font-medium">Uploading…</p>
          </div>
        )}

        {uploadedUrl && !uploading && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Uploaded
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-stone-400 mt-1">
        JPEG, PNG, or WebP. Uploads directly to Cloudinary.
      </p>
    </div>
  )
}
