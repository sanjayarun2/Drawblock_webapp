import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TextInputArea from '@/components/TextInputArea';
import SampleImages from '@/components/SampleImages';

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <Hero />
            <TextInputArea />
            <SampleImages />

            {/* Footer */}
            <footer className="bg-background-secondary border-t border-background-tertiary py-8 mt-12">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold text-text-primary mb-3">Product</h3>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><a href="/features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="/api" className="hover:text-primary transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary mb-3">Company</h3>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
                                <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary mb-3">Resources</h3>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><a href="/docs" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="/support" className="hover:text-primary transition-colors">Support</a></li>
                                <li><a href="/status" className="hover:text-primary transition-colors">Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary mb-3">Legal</h3>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="/terms" className="hover:text-primary transition-colors">Terms</a></li>
                                <li><a href="/cookies" className="hover:text-primary transition-colors">Cookies</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-background-tertiary text-center text-sm text-text-secondary">
                        <p>&copy; 2026 DrawBlock. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
