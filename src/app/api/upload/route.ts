import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!type || !['funcionarios', 'empresas', 'servicos'].includes(type)) {
      return NextResponse.json({ message: 'Tipo inválido' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const now = new Date()
    const brNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}))
    const day = String(brNow.getDate()).padStart(2, '0')
    const month = String(brNow.getMonth() + 1).padStart(2, '0')
    const year = brNow.getFullYear()
    const dateFolder = `${day}-${month}-${year}`
    
    const hours = String(brNow.getHours()).padStart(2, '0')
    const minutes = String(brNow.getMinutes()).padStart(2, '0')
    const seconds = String(brNow.getSeconds()).padStart(2, '0')
    const timeStr = `${hours}${minutes}${seconds}`
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const originalName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20)
    const filename = `${originalName}_${timeStr}_${randomId}.${extension}`

    const uploadDir = join(process.cwd(), 'public', 'uploads', type, dateFolder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const publicUrl = `/uploads/${type}/${dateFolder}/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    })

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}