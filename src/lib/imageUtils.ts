import imageCompression from 'browser-image-compression';

/**
 * Nombre del bucket de Supabase Storage para avatares
 * IMPORTANTE: Debe coincidir exactamente con el nombre en Supabase Dashboard (case-sensitive)
 * El bucket en Supabase se llama "Avatars" con mayúscula
 */
export const AVATAR_BUCKET_NAME = 'Avatars';

/**
 * Formatos de imagen soportados para avatares
 */
export const SUPPORTED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
];

/**
 * Extensiones de archivo soportadas
 */
export const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

/**
 * Tamaño máximo de archivo antes de compresión (5MB)
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Tamaño objetivo después de compresión (500KB)
 */
export const TARGET_FILE_SIZE_MB = 0.5; // 500KB

/**
 * Dimensión máxima para imágenes (800px)
 */
export const MAX_IMAGE_DIMENSION = 800;

/**
 * Valida que un archivo sea una imagen soportada y no exceda el tamaño máximo
 * 
 * @param file - Archivo a validar
 * @returns Objeto con resultado de validación y mensaje de error si aplica
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo MIME
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Unsupported format. Please use PNG, JPG, JPEG, or WEBP.`,
        };
    }

    // Validar tamaño (pre-compresión)
    if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            error: `File too large. Maximum size is ${sizeMB}MB.`,
        };
    }

    return { valid: true };
}

/**
 * Comprime una imagen usando browser-image-compression
 * 
 * Target: 500KB máximo, 800px dimensión mayor
 * Usa Web Worker para no bloquear el UI thread
 * 
 * @param file - Archivo de imagen a comprimir
 * @returns Promise con archivo comprimido
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: TARGET_FILE_SIZE_MB,
        maxWidthOrHeight: MAX_IMAGE_DIMENSION,
        useWebWorker: true,
        fileType: file.type,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to compress image. Please try again.');
    }
}

/**
 * Genera un nombre único para el avatar del usuario
 * 
 * Pattern: avatar_{timestamp}.{extension}
 * 
 * @param _userId - ID del usuario (no usado en nombre, solo para referencia)
 * @param originalName - Nombre original del archivo
 * @returns Nombre único para el avatar
 */
export function generateAvatarFilename(_userId: string, originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    return `avatar_${timestamp}.${extension}`;
}

/**
 * Extrae el filename desde una URL pública de Supabase Storage
 * 
 * Pattern: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{userId}/{filename}
 * 
 * @param url - URL pública del avatar
 * @returns Filename o null si no se puede extraer
 */
export function extractFilenameFromUrl(url: string): string | null {
    try {
        // Pattern: /{bucket}/{userId}/{filename}
        const pattern = new RegExp(`\\/${AVATAR_BUCKET_NAME}\\/[^/]+\\/([^?]+)`);
        const match = url.match(pattern);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting filename from URL:', error);
        return null;
    }
}

/**
 * Extrae el path completo (userId/filename) desde una URL pública de Supabase Storage
 * 
 * @param url - URL pública del avatar
 * @returns Path completo (userId/filename) o null si no se puede extraer
 */
export function extractPathFromUrl(url: string): string | null {
    try {
        // Pattern: /{bucket}/{userId}/{filename}
        const pattern = new RegExp(`\\/${AVATAR_BUCKET_NAME}\\/([^?]+)`);
        const match = url.match(pattern);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting path from URL:', error);
        return null;
    }
}

/**
 * Crea una URL de preview para un archivo usando FileReader
 * 
 * @param file - Archivo de imagen
 * @returns Promise con data URL para preview
 */
export function createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                resolve(result);
            } else {
                reject(new Error('Failed to create preview URL'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
