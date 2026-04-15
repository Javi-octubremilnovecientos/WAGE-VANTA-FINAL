import { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon, LockClosedIcon, CreditCardIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectUser, selectUserPremium, logout, patchUser } from '@/features/auth/authSlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import { Save } from '@/assets/icons/Solidicons';

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
        const value = fields[field].value;
        try {
            const updatePayload =
                field === 'email' ? { email: value }
                    : field === 'password' ? { password: value }
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
            // password no se persiste en user_metadata, no actualizar Redux
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

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#45d2fd] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Settings
                </h1>
            </div>

            {/* Profile Information Section */}
            <section className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <Cog6ToothIcon className="h-4 w-4 text-[#45d2fd]" />
                    <h2 className="text-base font-semibold text-white">Profile Information</h2>
                </div>
                <p className="text-gray-400 text-xs font-medium mb-4">
                    Manage your profile details and preferences
                </p>
                <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-xs font-medium text-gray-400">Full Name</p>
                            <input
                                type="text"
                                value={fields.name.editing ? fields.name.value : (user?.name ?? '')}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                disabled={!fields.name.editing || isUpdatingUser}
                                aria-label="Full name"
                                className="bg-transparent text-gray-300 text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#45d2fd]/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={fields.name.editing ? () => handleSaveField('name') : () => handleToggleEdit('name')}
                            disabled={isUpdatingUser}
                            aria-label={fields.name.editing ? 'Save name' : 'Edit name'}
                            className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors shrink-0 disabled:opacity-50"
                        >
                            {fields.name.editing
                                ? <Save />
                                : <PencilIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="pb-3 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 mr-3">
                                <p className="text-xs font-medium text-gray-400">Email Address</p>
                                <input
                                    type="email"
                                    value={fields.email.editing ? fields.email.value : (user?.email ?? '')}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    disabled={!fields.email.editing || isUpdatingUser}
                                    aria-label="Email address"
                                    className="bg-transparent text-gray-300 text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#45d2fd]/60 transition-all"
                                />
                            </div>
                            <button
                                onClick={fields.email.editing ? () => handleSaveField('email') : () => handleToggleEdit('email')}
                                disabled={isUpdatingUser}
                                aria-label={fields.email.editing ? 'Save email' : 'Edit email'}
                                className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors shrink-0 disabled:opacity-50"
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
                </div>
            </section>

            {/* Security Section */}
            <section className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <LockClosedIcon className="h-4 w-4 text-[#45d2fd]" />
                    <h2 className="text-base font-semibold text-white">Security</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-xs font-medium text-gray-400">Password</p>
                            <input
                                type="password"
                                value={fields.password.editing ? fields.password.value : '••••••••'}
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                disabled={!fields.password.editing || isUpdatingUser}
                                aria-label="Password"
                                placeholder="Enter new password"
                                className="bg-transparent text-gray-300 text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#45d2fd]/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={fields.password.editing ? () => handleSaveField('password') : () => handleToggleEdit('password')}
                            disabled={isUpdatingUser}
                            aria-label={fields.password.editing ? 'Save password' : 'Edit password'}
                            className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors shrink-0 disabled:opacity-50"
                        >
                            {fields.password.editing
                                ? <Save />
                                : <PencilIcon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </section>

            {/* Payment Method Section */}
            <section className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCardIcon className="h-4 w-4 text-[#45d2fd]" />
                    <h2 className="text-base font-semibold text-white">Payment Method</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                        <div>
                            <p className="text-xs font-medium text-gray-400">Current Plan</p>
                            <p className="text-gray-300 mt-0.5">{isPremium ? 'Premium Plan' : 'Free Plan'}</p>
                        </div>
                        <Link
                            to="/manage-plan"
                            className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors text-xs font-semibold"
                        >
                            Manage →
                        </Link>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <div>
                            <p className="text-xs font-medium text-gray-400">Saved Card</p>
                            <p className="text-gray-300 mt-0.5">No card on file</p>
                        </div>
                        <button className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors text-xs font-semibold">
                            Add card →
                        </button>
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
