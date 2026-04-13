import { ArrowLeftIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function MyTemplates() {
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

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        My Templates
                    </h1>
                    <p className="text-sm font-medium text-gray-400">
                        Your saved comparison templates for quick setup
                    </p>
                </div>
            </div>

            {/* Empty State */}
            <section>
                <div className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-14 text-center shadow-lg sm:px-6">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                        <div className="inline-flex rounded-full bg-[#45d2fd]/20 p-2 text-[#45d2fd]">
                            <DocumentTextIcon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-300">
                            No templates saved yet
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#45d2fd] transition-colors hover:text-[#22b8d9] mt-1"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Create template
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MyTemplates;
