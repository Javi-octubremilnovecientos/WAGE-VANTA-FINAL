import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-[#96969F] mb-6">
                    Page Not Found
                </h2>
                <p className="text-[#96969F] mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-brand-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
