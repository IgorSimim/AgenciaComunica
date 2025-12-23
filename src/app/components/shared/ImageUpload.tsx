'use client'

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import Image from 'next/image'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (file: File | null) => void
  label: string
  accept?: string
  maxSize?: number // em MB
}

export interface ImageUploadRef {
  clearImage: () => void
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({ 
  currentImage, 
  onImageChange, 
  label, 
  accept = "image/*",
  maxSize = 5 
}, ref) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImage || null)
  }, [currentImage])

  useImperativeHandle(ref, () => ({
    clearImage: () => {
      setPreview(null)
      setError('')
      onImageChange(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }))

  const handleFileChange = (file: File | null) => {
    setError('')

    if (!file) {
      setPreview(null)
      onImageChange(null)
      return
    }

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${maxSize}MB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0] || null
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemove = () => {
    setPreview(null)
    setError('')
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-gray-800">
        {label}
      </label>
      
      {preview ? (
        <div className="relative inline-block">
          <div className="relative group">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-xl object-cover border-2 border-gray-200 shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-200"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 w-full bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
          >
            <FiUpload size={16} />
            Alterar imagem
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragging 
              ? 'border-yellow-400 bg-yellow-50' 
              : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiImage size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Clique para selecionar ou arraste uma imagem
          </p>
          <p className="text-sm text-gray-500">
            Formatos aceitos: JPG, PNG, GIF • Máximo: {maxSize}MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  )
})

ImageUpload.displayName = 'ImageUpload'

export default ImageUpload