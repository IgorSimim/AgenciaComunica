import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { authorizeFuncionario, cargosGestao, cargosServico } from '@/lib/api/funcionario-auth'

export const runtime = 'nodejs'

const allowedTypes = ['funcionarios', 'empresas', 'servicos'] as const
const maxFileSize = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file = data.get('file')
    const type = allowedTypes.find((allowedType) => allowedType === data.get('type'))

    if (!type) {
      return NextResponse.json(
        { message: 'Tipo inválido' },
        { status: 400 })
    }

    const auth = await authorizeFuncionario(type === 'servicos' ? cargosServico : cargosGestao)
    if (auth.response) {
      return auth.response
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { message: 'Nenhum arquivo válido foi enviado' }, 
        { status: 400 })
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { message: 'A imagem deve ter no máximo 5MB' },
        { status: 413 }
      )
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { message: 'Formato de imagem não suportado. Envie JPEG, PNG ou WebP.' },
        { status: 415 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const now = new Date()
    const brNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
    const dateFolder = `${String(brNow.getDate()).padStart(2, '0')}-${String(brNow.getMonth() + 1).padStart(2, '0')}-${brNow.getFullYear()}`
    const fileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `AgenciaComunica/${type}/${dateFolder}`,
          public_id: `${fileName || 'imagem'}_${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result) return reject(new Error('O Cloudinary não retornou o resultado do upload'))
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }, { status: 201 })

  } catch (error) {
    console.error('Erro no upload da imagem:', error)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Formulário de upload inválido' },
        { status: 400 }
      )
    }
    return NextResponse.json({
      message: 'Não foi possível processar o upload agora'
    },
      { status: 500 })
  }
}