'use client'
import { useState } from 'react'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File, type: 'funcionarios' | 'empresas' | 'servicos'): Promise<{url: string, publicId: string} | null> => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erro no upload')
      }

      return { url: result.url, publicId: result.publicId }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploading, uploadImage, uploadError: error }
}