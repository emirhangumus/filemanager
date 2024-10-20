import Link from "next/link";

export const Footer = () => {
    return (
        <div className="py-4 flex items-center justify-between text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-4">
                <span>Made with ❤️ by <Link href="https://profile.intra.42.fr/users/egumus" target="_blank" rel="noreferrer" className="underline hover:text-indigo-500 transition-colors">egumus</Link> && <Link href="https://profile.intra.42.fr/users/soksak" target="_blank" rel="noreferrer" className="underline hover:text-indigo-500 transition-colors">soksak</Link></span>
            </div>
            <div className="flex items-center gap-4">
                <span>© {new Date().getFullYear()} File Manager</span>
            </div>
        </div>
    );
}