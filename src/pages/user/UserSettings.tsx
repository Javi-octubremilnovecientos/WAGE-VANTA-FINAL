import { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon, LockClosedIcon, CreditCardIcon, PencilIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectUser, selectUserPremium, logout, patchUser } from '@/features/auth/authSlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';

function UserSettings() {
    const user = useAppSelector(selectUser);
    const isPremium = useAppSelector(selectUserPremium);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [editingName, setEditingName] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');

    const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

    const handleSaveName = async () => {
        try {
            await updateUser({ data: { name: nameValue } }).unwrap();
            dispatch(patchUser({ name: nameValue }));
        } catch { /* error silenciado, el input revierte al valor anterior */ }
        setEditingName(false);
    };

    const handleSaveEmail = async () => {
        try {
            await updateUser({ email: emailValue }).unwrap();
            dispatch(patchUser({ email: emailValue }));
        } catch { /* error silenciado, el input revierte al valor anterior */ }
        setEditingEmail(false);
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
                                value={editingName ? nameValue : (user?.name ?? '')}
                                onChange={(e) => setNameValue(e.target.value)}
                                disabled={!editingName || isUpdatingUser}
                                aria-label="Full name"
                                className="bg-transparent text-gray-300 text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#45d2fd]/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={editingName ? handleSaveName : () => { setNameValue(user?.name ?? ''); setEditingName(true); }}
                            disabled={isUpdatingUser}
                            aria-label={editingName ? 'Save name' : 'Edit name'}
                            className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors shrink-0 disabled:opacity-50"
                        >
                            {editingName
                                ? <ArrowDownOnSquareIcon className="h-4 w-4" />
                                : <PencilIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-xs font-medium text-gray-400">Email Address</p>
                            <input
                                type="email"
                                value={editingEmail ? emailValue : (user?.email ?? '')}
                                onChange={(e) => setEmailValue(e.target.value)}
                                disabled={!editingEmail || isUpdatingUser}
                                aria-label="Email address"
                                className="bg-transparent text-gray-300 text-sm mt-0.5 w-full focus:outline-none disabled:cursor-default enabled:border-b enabled:border-[#45d2fd]/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={editingEmail ? handleSaveEmail : () => { setEmailValue(user?.email ?? ''); setEditingEmail(true); }}
                            disabled={isUpdatingUser}
                            aria-label={editingEmail ? 'Save email' : 'Edit email'}
                            className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors shrink-0 disabled:opacity-50"
                        >
                            {editingEmail
                                ? <ArrowDownOnSquareIcon className="h-4 w-4" />
                                : <PencilIcon className="h-4 w-4" />}
                        </button>
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
                        <div>
                            <p className="text-xs font-medium text-gray-400">Password</p>
                            <p className="text-gray-300 mt-0.5">••••••••</p>
                        </div>
                        <button className="text-[#45d2fd] hover:text-[#22b8d9] transition-colors">
                            <PencilIcon className="h-4 w-4" />
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
