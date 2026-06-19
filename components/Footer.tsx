import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-stone-900 text-stone-200 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-3">BeforeYouSign</h3>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            Institutional-grade contract analysis powered by AI. Identify material risks, decode complex provisions, and safeguard your commercial interests.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/analyze" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Analyze Contract
                                </Link>
                            </li>
                            <li>
                                <Link href="/templates" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link href="/library" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Legal Library
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/privacy" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/disclaimer" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Legal Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-stone-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-stone-400">
                            © {currentYear} BeforeYouSign. All rights reserved.
                        </p>
                        <p className="text-sm text-stone-500">
                            AI-powered legal analysis. Not legal advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
