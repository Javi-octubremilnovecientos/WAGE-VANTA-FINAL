import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col  bg-gray-900 overflow-hidden">
                 <div className="relative isolate px-6    ">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0  -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40 lg:-top-80 pointer-events-none"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative -top-40  left-25 -z-10 aspect-[1/1] w-[150%] sm:w-[150%] lg:w-[120%] max-w-none rotate-[50deg] bg-gradient-to-tr from-[#230c77] to-[#45d2fd] opacity-30 md:opacity-20"
                    />
                </div>

            </div>
            <Header />
            <main className="flex-grow  ">
                
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
