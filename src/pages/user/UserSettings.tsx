import { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon, LockClosedIcon, CreditCardIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectUser, selectUserPremium, logout, patchUser } from '@/features/auth/authSlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import { Save } from '@/assets/icons/Solidicons';
import AvatarUploader from '@/components/ui/AvatarUploader';

function UserSettings() {
    const user = useAppSelector(selectUser);
    const isPremium = useAppSelector(selectUserPremium);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [fields, setFields] = useState<Record<string, { value: string; editing: boolean }>>({
        name: { value: '', editing: false },
        email: { value: '', editing: false },
        password: { value: '', editing: false },
    });

    // Estados específicos para cambio de password
    const [passwordFields, setPasswordFields] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Estados para avatar upload
    const [avatarSuccess, setAvatarSuccess] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

    const handleFieldChange = (field: string, value: string) => {
        setFields(prev => ({
            ...prev,
            [field]: { ...prev[field], value }
        }));
    };

    const handleToggleEdit = (field: string) => {
        setFields(prev => {
            const isNowEditing = !prev[field].editing;

            // Reset password fields y errores cuando se activa/desactiva edición de password
            if (field === 'password') {
                setPasswordFields({ current: '', new: '', confirm: '' });
                setPasswordError(null);
                setPasswordSuccess(false);
            }

            return {
                ...prev,
                [field]: {
                    editing: isNowEditing,
                    value: isNowEditing
                        ? field === 'name'
                            ? user?.name ?? ''
                            : field === 'email'
                                ? user?.email ?? ''
                                : ''
                        : prev[field].value,
                }
            };
        });
    };

    const handleSaveField = async (field: string) => {
        // Validación especial para password
        if (field === 'password') {
            setPasswordError(null);
            setPasswordSuccess(false);

            // Validar que todos los campos estén llenos
            if (!passwordFields.current || !passwordFields.new || !passwordFields.confirm) {
                setPasswordError('All password fields are required');
                return;
            }

            // Validar que la nueva password tenga al menos 6 caracteres
            if (passwordFields.new.length < 6) {
                setPasswordError('New password must be at least 6 characters');
                return;
            }

            // Validar que las nuevas passwords coincidan
            if (passwordFields.new !== passwordFields.confirm) {
                setPasswordError('New passwords do not match');
                return;
            }

            try {
                // Supabase requiere current_password para validar que el usuario conoce la contraseña actual
                await updateUser({
                    password: passwordFields.new,
                    current_password: passwordFields.current
                }).unwrap();

                // Mostrar mensaje de éxito
                setPasswordSuccess(true);
                setPasswordFields({ current: '', new: '', confirm: '' });

                // Cerrar modo edición después de 3 segundos
                setTimeout(() => {
                    setFields(prev => ({
                        ...prev,
                        password: { ...prev.password, editing: false }
                    }));
                    setPasswordSuccess(false);
                }, 3000);
            } catch (error: unknown) {
                const err = error as { data?: { error_code?: string; msg?: string } };
                if (err?.data?.error_code === 'current_password_required') {
                    setPasswordError('Current password is required');
                } else if (err?.data?.msg?.includes('Invalid current password')) {
                    setPasswordError('Current password is incorrect');
                } else {
                    setPasswordError('Failed to update password. Please try again.');
                }
            }
            return;
        }

        // Lógica original para name y email
        const value = fields[field].value;
        try {
            const updatePayload =
                field === 'email' ? { email: value }
                    : { data: { name: value } };

            const response = await updateUser(updatePayload).unwrap();

            // IMPORTANTE: Email requiere confirmación. Supabase devuelve 'new_email' en vez de actualizar 'email'.
            // Solo actualizamos Redux con el cambio confirmado.
            if (field === 'email') {
                // Actualizar newEmail en Redux (pendiente de confirmación)
                dispatch(patchUser({ newEmail: response.new_email }));
            } else if (field === 'name') {
                // Name sí se actualiza inmediatamente
                dispatch(patchUser({ name: value }));
            }
        } catch { /* error silenciado, el input revierte al valor anterior */ }

        setFields(prev => ({
            ...prev,
            [field]: { ...prev[field], editing: false }
        }));
    };

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleAvatarUploadSuccess = (url: string) => {
        dispatch(patchUser({ avatarUrl: url || null }));
        setAvatarSuccess(true);
        setAvatarError(null);

        setTimeout(() => {
            setAvatarSuccess(false);
        }, 3000);
    };

    const handleAvatarUploadError = (error: string) => {
        setAvatarError(error);
        setAvatarSuccess(false);
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#D84124] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Settings
                </h1>
            </div>

            {/* Profile Information Section */}
            <section className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <Cog6ToothIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-base font-semibold text-white">Profile Information</h2>
                </div>
                <p className="text-[#96969F] text-xs font-medium mb-4">
                    Manage your profile details and preferences
                </p>

                <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-xs font-medium text-[#96969F]">Full Name</p>
                            <input
                                type="text"
                                value={fields.name.editing ? fields.name.value : (user?.name ?? '')}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                disabled={!fields.name.editing || isUpdatingUser}
                                aria-label="Full name"
                                className="bg-transparent text-[#96969F] text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#D84124]/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={fields.name.editing ? () => handleSaveField('name') : () => handleToggleEdit('name')}
                            disabled={isUpdatingUser}
                            aria-label={fields.name.editing ? 'Save name' : 'Edit name'}
                            className="text-[#D84124] hover:text-[#ED8B34] transition-colors shrink-0 disabled:opacity-50"
                        >
                            {fields.name.editing
                                ? <Save />
                                : <PencilIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="pb-3 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 mr-3">
                                <p className="text-xs font-medium text-[#96969F]">Email Address</p>
                                <input
                                    type="email"
                                    value={fields.email.editing ? fields.email.value : (user?.email ?? '')}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    disabled={!fields.email.editing || isUpdatingUser}
                                    aria-label="Email address"
                                    className="bg-transparent text-[#96969F] text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#D84124]/60 transition-all"
                                />
                            </div>
                            <button
                                onClick={fields.email.editing ? () => handleSaveField('email') : () => handleToggleEdit('email')}
                                disabled={isUpdatingUser}
                                aria-label={fields.email.editing ? 'Save email' : 'Edit email'}
                                className="text-[#D84124] hover:text-[#ED8B34] transition-colors shrink-0 disabled:opacity-50"
                            >
                                {fields.email.editing
                                    ? <Save />
                                    : <PencilIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        {user?.newEmail && (
                            <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                Pending confirmation: {user.newEmail}
                            </p>
                        )}
                    </div>

                    {/* Avatar Upload Section - moved to bottom */}
                    <div className="pt-3 mt-6 border-t border-white/10">
                        <p className="text-xs font-medium text-[#96969F] mb-3">Profile Picture</p>
                        <AvatarUploader
                            currentAvatarUrl={user?.avatarUrl}
                            userId={user?.id ?? ''}
                            userName={user?.name}
                            onUploadSuccess={handleAvatarUploadSuccess}
                            onUploadError={handleAvatarUploadError}
                            isCompact={true}
                            avatarSize="lg"
                        />

                        {avatarSuccess && (
                            <div className="mt-4 rounded-md bg-green-500/10 border border-green-600/50 px-3 py-2 text-xs text-green-300">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <p className="font-semibold">Avatar updated successfully!</p>
                                </div>
                            </div>
                        )}
                        {avatarError && (
                            <div className="mt-4 rounded-md bg-red-500/10 border border-red-600/50 px-3 py-2 text-xs text-red-300 flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                                {avatarError}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <LockClosedIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-base font-semibold text-white">Security</h2>
                </div>
                <div className="space-y-3">
                    {!fields.password.editing ? (
                        /* Vista normal - password oculta */
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex-1 min-w-0 mr-3">
                                <p className="text-xs font-medium text-[#96969F]">Password</p>
                                <p className="text-[#96969F] text-sm mt-0.5">••••••••</p>
                            </div>
                            <button
                                onClick={() => handleToggleEdit('password')}
                                disabled={isUpdatingUser}
                                aria-label="Edit password"
                                className="text-[#D84124] hover:text-[#ED8B34] transition-colors shrink-0 disabled:opacity-50"
                            >
                                <PencilIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        /* Modo edición - tres campos de password */
                        <div className="space-y-3 pb-3 border-b border-white/10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0 mr-3 space-y-3">
                                    {/* Current Password */}
                                    <div>
                                        <label htmlFor="current-password" className="text-xs font-medium text-[#96969F] block mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            id="current-password"
                                            type="password"
                                            value={passwordFields.current}
                                            onChange={(e) => setPasswordFields(prev => ({ ...prev, current: e.target.value }))}
                                            disabled={isUpdatingUser}
                                            placeholder="Enter current password"
                                            className="bg-transparent text-[#96969F] text-sm w-full focus:outline-none border-b border-white/10 focus:border-[#D84124]/60 transition-all pb-1 disabled:opacity-50"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="new-password" className="text-xs font-medium text-[#96969F] block mb-1">
                                            New Password
                                        </label>
                                        <input
                                            id="new-password"
                                            type="password"
                                            value={passwordFields.new}
                                            onChange={(e) => setPasswordFields(prev => ({ ...prev, new: e.target.value }))}
                                            disabled={isUpdatingUser}
                                            placeholder="Enter new password (min 6 characters)"
                                            className="bg-transparent text-[#96969F] text-sm w-full focus:outline-none border-b border-white/10 focus:border-[#D84124]/60 transition-all pb-1 disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label htmlFor="confirm-password" className="text-xs font-medium text-[#96969F] block mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            value={passwordFields.confirm}
                                            onChange={(e) => setPasswordFields(prev => ({ ...prev, confirm: e.target.value }))}
                                            disabled={isUpdatingUser}
                                            placeholder="Re-enter new password"
                                            className="bg-transparent text-[#96969F] text-sm w-full focus:outline-none border-b border-white/10 focus:border-[#D84124]/60 transition-all pb-1 disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={() => handleSaveField('password')}
                                    disabled={isUpdatingUser}
                                    aria-label="Save password"
                                    className="text-[#D84124] hover:text-[#ED8B34] transition-colors shrink-0 disabled:opacity-50 mt-6"
                                >
                                    <Save />
                                </button>
                            </div>

                            {/* Error Message */}
                            {passwordError && (
                                <div className="rounded-md bg-red-500/10 border border-red-600/50 px-3 py-2 text-xs text-red-300 flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {passwordError}
                                </div>
                            )}

                            {/* Success Message */}
                            {passwordSuccess && (
                                <div className="rounded-md bg-green-500/10 border border-green-600/50 px-3 py-2 text-xs text-green-300">
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mt-1" />
                                        <div>
                                            <p className="font-semibold">Password updated successfully!</p>
                                            <p className="text-green-400/80 mt-0.5">Your password has been changed. You can now use it to log in.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cancel Button */}
                            <button
                                onClick={() => handleToggleEdit('password')}
                                disabled={isUpdatingUser}
                                className="text-xs text-[#96969F] hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Payment Method Section */}
            <section className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCardIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-base font-semibold text-white">Payment Method</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div>
                            <p className="text-xs font-medium text-[#96969F]">Current Plan</p>
                            <p className="text-[#96969F] mt-0.5">{isPremium ? 'Premium Plan' : 'Free Plan'}</p>
                        </div>
                        <Link
                            to="/manage-plan"
                            className="text-[#D84124] hover:text-[#ED8B34] transition-colors text-xs font-semibold"
                        >
                            Manage →
                        </Link>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <div>
                            <p className="text-xs font-medium text-[#96969F]">Saved Card</p>
                            <p className="text-[#96969F] mt-0.5">No card on file</p>
                        </div>
                        <Link
                            to="/billing"
                            className="text-[#D84124] hover:text-[#ED8B34] transition-colors text-xs font-semibold"
                        >
                            Add card →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Sign Out Button */}
            <button
                onClick={handleSignOut}
                className="w-full rounded-md bg-red-500/20 text-red-400 py-2 text-sm font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
                Sign Out
            </button>

            {/* Delete Account Button */}
            <button className="w-full rounded-md bg-red-600/20 text-red-400 py-2 text-sm font-semibold hover:bg-red-600/30 transition-colors border border-red-600/40">
                Delete Account
            </button>
        </div>
    );
}

export default UserSettings;
