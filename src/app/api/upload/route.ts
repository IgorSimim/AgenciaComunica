import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

const allowedTypes = ['funcionarios', 'empresas', 'servicos'] as const;
const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const type = data.get('type');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ message: 'Nenhum arquivo válido foi enviado' }, { status: 400 });
    }

    if (file.size > maxFileSize || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'A imagem deve ser válida, ter formato de imagem e no máximo 5MB' },
        { status: 400 }
      );
    }

    if (typeof type !== 'string' || !allowedTypes.includes(type as typeof allowedTypes[number])) {
      return NextResponse.json({ message: 'Tipo inválido' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const now = new Date();
    const brNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const dateFolder = `${String(brNow.getDate()).padStart(2, '0')}-${String(brNow.getMonth() + 1).padStart(2, '0')}-${brNow.getFullYear()}`;
    const fileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `AgenciaComunica/${type}/${dateFolder}`,
          public_id: `${fileName || 'imagem'}_${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('O Cloudinary não retornou o resultado do upload'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Erro no processamento do upload'
    },
      { status: 500 });
  }
}