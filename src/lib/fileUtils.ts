import { promises as fs } from 'fs';
import path from 'path';

export async function deleteImageFile(imagePath: string | null): Promise<void> {
    if (!imagePath) return;
    
    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        await fs.unlink(fullPath);
    } catch (error) {
        console.error(`Erro ao deletar imagem: ${imagePath}`, error);
    }
}