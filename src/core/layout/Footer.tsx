
import { FaFacebook, FaInstagram, FaXTwitter, FaGithub, FaYoutube } from "react-icons/fa6";


const socialLinks = [
    {
        name: "Instagram",
        href: "#",
        icon: FaInstagram,
    },
    {
        name: "X",
        href: "#",
        icon: FaXTwitter,
    },
]
export default function Footer() {
    return (
        <footer className="bg-gray-900">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-5 sm:py-6 lg:px-8">

                <div className="mt-4 flex justify-center gap-x-10">
                    {socialLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-500 hover:text-gray-400 transition-colors"
                        >
                            <span className="sr-only">{item.name}</span>
                            <item.icon aria-hidden="true" className="h-6 w-6" />
                        </a>
                    ))}
                </div>
                <p className="mt-2.5 text-center text-sm/6 text-gray-500">
                    &copy; 2026 Wage Vantage, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
