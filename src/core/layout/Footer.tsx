
import { FaInstagram, FaXTwitter } from "react-icons/fa6";


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
        <footer className="bg-[#121213] border-t border-white/5">
            <div className="mx-auto max-w-7xl overflow-hidden px-3 py-2 sm:py-3 lg:px-4">
                <div className="mt-1 flex justify-center gap-x-4">
                    {socialLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-[#96969F] hover:text-white transition-colors"
                        >
                            <span className="sr-only">{item.name}</span>
                            <item.icon aria-hidden="true" className="h-3 w-3" />
                        </a>
                    ))}
                </div>
                <p className="mt-1 text-center text-xs text-[#96969F]">
                    &copy; 2026 Wage Vantage, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
