import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    useUploadAvatarMutation,
    useDeleteAvatarMutation,
    useUpdateUserMutation,
    getAvatarPublicUrl,
} from '@/features/auth/authApi';
import {
    validateImageFile,
    compressImage,
    generateAvatarFilename,
    extractPathFromUrl,
    createPreviewUrl,
    SUPPORTED_IMAGE_EXTENSIONS,
    AVATAR_BUCKET_NAME,
} from '@/lib/imageUtils';
import UserAvatar from './UserAvatar';

interface AvatarUploaderProps {
    currentAvatarUrl?: string | null;
    userId: string;
    userName?: string;
    onUploadSuccess: (url: string) => void;
    onUploadError?: (error: string) => void;
    isCompact?: boolean; // Modo compacto para usar en settings
    avatarSize?: 'sm' | 'md' | 'lg'; // Tamaño del avatar (por defecto 'md')
}

type UploadStage = 'idle' | 'validating' | 'compressing' | 'uploading' | 'success' | 'error';

/**
 * Helper para extraer mensaje de error de manera type-safe
 */
function getErrorMessage(error: unknown): string {
    console.log('Raw error object:', error);

    if (error && typeof error === 'object') {
        // RTK Query error format
        if ('data' in error && error.data && typeof error.data === 'object') {
            if ('message' in error.data) {
                return String(error.data.message);
            }
            if ('error' in error.data) {
                return String(error.data.error);
            }
        }
        if ('message' in error) {
            return String(error.message);
        }
        // Intenta serializar el objeto para debugging
        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    }
    return 'An unexpected error occurred';
}

/**
 * Componente para subir y gestionar avatares de usuario
 * 
 * Flujo:
 * 1. Usuario arrastra/selecciona imagen
 * 2. Validación (tipo, tamaño)
 * 3. Preview inmediato
 * 4. Compresión cliente-side
 * 5. Eliminar avatar anterior (si existe)
 * 6. Subir a Supabase Storage
 * 7. Actualizar user_metadata con nueva URL
 * 8. Notificar éxito/error al padre
 * 
 * Features:
 * - Drag & drop
 * - Click para seleccionar
 * - Preview antes de subir
 * - Compresión automática
 * - Loading states con feedback visual
 * - Eliminación de avatar
 * - Validación de formato y tamaño
 * - Manejo de errores
 */
function AvatarUploader({
    currentAvatarUrl,
    userId,
    userName,
    onUploadSuccess,
    onUploadError,
    isCompact = false,
    avatarSize = 'md',
}: AvatarUploaderProps) {
    const [uploadAvatar] = useUploadAvatarMutation();
    const [deleteAvatar] = useDeleteAvatarMutation();
    const [updateUser] = useUpdateUserMutation();

    const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Handler para cuando se seleccionan archivos
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setUploadStage('validating');
            setErrorMessage(null);

            // 1. Validar archivo
            const validation = validateImageFile(file);
            if (!validation.valid) {
                setUploadStage('error');
                setErrorMessage(validation.error || 'Invalid file');
                if (onUploadError) onUploadError(validation.error || 'Invalid file');
                return;
            }

            try {
                // 2. Crear preview
                const preview = await createPreviewUrl(file);
                setPreviewUrl(preview);

                // 3. Comprimir imagen
                setUploadStage('compressing');
                const compressedFile = await compressImage(file);

                // 4. Eliminar avatar anterior si existe
                if (currentAvatarUrl) {
                    const oldPath = extractPathFromUrl(currentAvatarUrl);
                    if (oldPath) {
                        try {
                            await deleteAvatar({ path: oldPath }).unwrap();
                        } catch (deleteError) {
                            // No fatal: continuar con upload aunque falle el delete
                            console.warn('Failed to delete old avatar:', deleteError);
                        }
                    }
                }

                // 5. Generar filename único
                const filename = generateAvatarFilename(userId, compressedFile.name);
                console.log('Upload details:', {
                    bucket: AVATAR_BUCKET_NAME,
                    userId,
                    filename,
                    fileSize: compressedFile.size,
                    fileType: compressedFile.type
                });
                setUploadStage('uploading');
                const uploadResult = await uploadAvatar({
                    userId,
                    filename,
                    file: compressedFile,
                }).unwrap();

                console.log('Upload success:', uploadResult);

                // 7. Construir URL pública
                const publicUrl = getAvatarPublicUrl(userId, filename);
                console.log('Public URL:', publicUrl);

                // 8. Actualizar user_metadata en Supabase
                await updateUser({
                    data: { avatarUrl: publicUrl },
                }).unwrap();

                // 9. Notificar éxito
                setUploadStage('success');
                onUploadSuccess(publicUrl);

                // Reset a idle después de 2 segundos
                setTimeout(() => {
                    setUploadStage('idle');
                    setPreviewUrl(null);
                }, 2000);
            } catch (error: unknown) {
                setUploadStage('error');
                const errorMsg = getErrorMessage(error) || 'Failed to upload avatar';

                // Detectar si es error de token expirado (403 + "exp" claim)
                let displayError = errorMsg;
                if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
                    if (errorMsg.includes('exp')) {
                        displayError = 'Your session expired. Please log in again and try uploading.';
                    } else if (errorMsg.includes('Unauthorized')) {
                        displayError = 'Authorization failed. Please refresh the page and try again.';
                    }
                }

                setErrorMessage(displayError);
                if (onUploadError) onUploadError(displayError);
                console.error('Upload error (status, data):', { status: (error as any)?.status, data: error });
            }
        },
        [
            userId,
            currentAvatarUrl,
            uploadAvatar,
            deleteAvatar,
            updateUser,
            onUploadSuccess,
            onUploadError,
        ]
    );

    // Configuración de Dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': SUPPORTED_IMAGE_EXTENSIONS,
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: uploadStage === 'compressing' || uploadStage === 'uploading',
    });

    // Handler para eliminar avatar
    const handleRemoveAvatar = async () => {
        if (!currentAvatarUrl) return;

        try {
            setUploadStage('uploading');
            setErrorMessage(null);

            // 1. Eliminar del Storage
            const path = extractPathFromUrl(currentAvatarUrl);
            if (path) {
                await deleteAvatar({ path }).unwrap();
            }

            // 2. Actualizar user_metadata
            await updateUser({
                data: { avatarUrl: null },
            }).unwrap();

            // 3. Notificar éxito
            setUploadStage('success');
            onUploadSuccess(''); // Empty string indica eliminación

            setTimeout(() => {
                setUploadStage('idle');
            }, 1000);
        } catch (error: unknown) {
            setUploadStage('error');
            const errorMsg = getErrorMessage(error) || 'Failed to remove avatar';
            setErrorMessage(errorMsg);
            if (onUploadError) onUploadError(errorMsg);
            console.error('Remove error:', error);
        }
    };

    // Determinar qué mostrar según el estado
    const isUploading = uploadStage === 'compressing' || uploadStage === 'uploading';
    const showPreview = previewUrl && uploadStage !== 'idle';

    return (
        <div className={`flex flex-col items-center ${isCompact ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
            {/* Avatar actual o preview */}
            <div className="relative">
                {isCompact ? (
                    // Modo compacto: mostrar avatar con tamaño específico
                    <UserAvatar
                        avatarUrl={showPreview ? previewUrl : currentAvatarUrl}
                        userName={userName}
                        size={avatarSize}
                        className="transition-opacity duration-300"
                    />
                ) : (
                    // Modo normal: responsive
                    <>
                        <UserAvatar
                            avatarUrl={showPreview ? previewUrl : currentAvatarUrl}
                            userName={userName}
                            size="md"
                            className="transition-opacity duration-300 sm:hidden"
                        />
                        <UserAvatar
                            avatarUrl={showPreview ? previewUrl : currentAvatarUrl}
                            userName={userName}
                            size="lg"
                            className="transition-opacity duration-300 hidden sm:block"
                        />
                    </>
                )}

                {/* Loading overlay */}
                {isUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`animate-spin rounded-full ${isCompact ? 'h-6 w-6 border border-white' : 'h-10 w-10 border-b-2 border-white'}`}></div>
                            <span className={`text-white font-medium ${isCompact ? 'text-xs' : 'text-xs'}`}>
                                {uploadStage === 'compressing' ? 'Compressing...' : 'Uploading...'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Success checkmark */}
                {uploadStage === 'success' && (
                    <div className="absolute inset-0 rounded-full bg-green-500/80 flex items-center justify-center">
                        <svg
                            className={`text-white animate-scale-in ${isCompact ? 'w-10 h-10' : 'w-16 h-16'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
          w-full border-2 border-dashed rounded-lg
          transition-all duration-200 cursor-pointer
          ${isCompact ? 'px-2 py-2' : 'px-3 py-2 sm:px-6 sm:py-4'}
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/40'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-gray-800/60'}
        `}
            >
                <input {...getInputProps()} />
                <div className="text-center">
                    <svg
                        className={`mx-auto text-gray-400 ${isCompact ? 'h-5 w-5' : 'h-8 w-8 sm:h-12 sm:w-12'}`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className={`text-gray-300 ${isCompact ? 'mt-1 text-xs' : 'mt-1 sm:mt-2 text-xs sm:text-sm'}`}>
                        {isDragActive ? (
                            <p className="font-semibold text-blue-400">Drop image here</p>
                        ) : (
                            <>
                                <p className="font-semibold">
                                    <span className="text-blue-400">Click to upload</span>
                                    {!isCompact && <span className="hidden sm:inline"> or drag and drop</span>}
                                </p>
                                {!isCompact && <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">PNG, JPG, WEBP up to 5MB</p>}
                                {isCompact && <p className="text-gray-500 text-xs mt-0.5">PNG, JPG, WEBP up to 5MB</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Error message */}
            {uploadStage === 'error' && errorMessage && (
                <div className={`w-full rounded-md bg-red-500/20 border border-red-500/40 text-red-400 ${isCompact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm'}`}>
                    <div className="flex items-center gap-2">
                        <svg className={`flex-shrink-0 fill-current ${isCompact ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5'}`} viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            {/* Remove button */}
            {currentAvatarUrl && uploadStage === 'idle' && (
                <button
                    onClick={handleRemoveAvatar}
                    className={`font-medium text-red-400 bg-red-500/20 rounded-md hover:bg-red-500/30 transition-colors border border-red-500/30 ${isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'}`}
                >
                    Remove Avatar
                </button>
            )}
        </div>
    );
}

export default AvatarUploader;
