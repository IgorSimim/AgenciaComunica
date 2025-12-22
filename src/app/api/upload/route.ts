import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type: string = data.get('type') as string;

    // 1. Validações básicas 
    if (!file) return NextResponse.json({ message: 'Nenhum arquivo' }, { status: 400 });
    if (!['funcionarios', 'empresas', 'servicos'].includes(type)) {
      return NextResponse.json({ message: 'Tipo inválido' }, { status: 400 });
    }

    // 2. Transformar o arquivo em Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Lógica de data para a pasta (Organização)
    const now = new Date();
    const brNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const dateFolder = `${String(brNow.getDate()).padStart(2, '0')}-${String(brNow.getMonth() + 1).padStart(2, '0')}-${brNow.getFullYear()}`;

    // 4. Upload para o Cloudinary usando Stream
    // Usamos Promise para lidar com o comportamento assíncrono do upload_stream
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `AgenciaComunica/${type}/${dateFolder}`,
          // Define um nome amigável ou deixa o Cloudinary gerar um ID único
          public_id: `${file.name.split('.')[0]}_${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // 5. Retorno da URL segura
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    return NextResponse.json({
      message: 'Erro no processamento do upload'
    },
      { status: 500 });
  }
}