import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-6">Wage Comparator</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Choose a country to start comparing
                </p>
                <Link
                    to="/comparison"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Start Comparison
                </Link>
            </div>
        </div>
    );
}

export default Home;
