import { ArrowLeftIcon, ChartBarIcon, GlobeEuropeAfricaIcon, ShieldCheckIcon, BoltIcon, CircleStackIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/ui/cards/FeatureCard';

const features = [
    {
        title: 'Statistical Precision',
        description: 'Data and visualizations based on Eurostat-sourced wage distribution data across the EU.',
        icon: ChartBarIcon,
    },
    {
        title: 'Pan-European Coverage',
        description: 'Compare wages across 20+ European countries with data segregated by industry, occupation, and education.',
        icon: GlobeEuropeAfricaIcon,
    },
    {
        title: 'Privacy First',
        description: 'Your personal wage data is never shared. All comparisons are processed securely.',
        icon: ShieldCheckIcon,
    },
    {
        title: 'Real-Time Insights',
        description: 'Dynamic charts update instantly as you input your details, giving immediate visual feedback.',
        icon: BoltIcon,
    },
];

const faqs = [
    {
        question: 'Where does the wage data come from?',
        answer: "Our wage data is sourced from Eurostat's Structure of Earnings Survey (SES), updated quarterly to reflect statistical distributions, broken down by jurisdiction.",
    },
    {
        question: 'How do I manage or cancel my subscription?',
        answer: 'Navigate to "Manage Plan" to cancel your subscription at any time from the Manage Plan page in your Dashboard.',
    },
    {
        question: 'Is my data stored after a session?',
        answer: 'For logged-in users, your explicitly saved templates and comparisons are retained.',
    },
    {
        question: 'What data do you collect?',
        answer: 'We collect only your email and any form data you explicitly choose to save as a template or comparison sheet.',
    },
];

function About() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header */}
            <div>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#ED8B34] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Home
                </Link>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-3">
                    About Wage Comparator
                </h1>
                <p className="text-sm font-medium text-[#96969F] max-w-3xl">
                    Understanding how your salary compares to wage distributions across Europe couldn't be easier or more precise. We make it visual, intuitive, and accessible—whether you're negotiating a raise, planning a move abroad, or just curious.
                </p>
            </div>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.title}
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                        iconWrapperClassName="bg-[#D84124]/20"
                        iconClassName="h-4 w-4 text-[#D84124]"
                    />
                ))}
            </section>

            {/* Data Sources */}
            <section className="rounded-lg border border-white/10 bg-[#121213]/60 backdrop-blur px-5 py-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <CircleStackIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-lg font-semibold text-white">Data Sources</h2>
                </div>
                <p className="text-[#96969F] text-sm font-medium leading-relaxed">
                    Our wage data is sourced from Eurostat's Structure of Earnings Survey (SES) and complementary national statistical office publications. Data is updated quarterly and tied to the most recent pan-European employment reports.
                </p>
            </section>

            {/* Privacy & Support */}
            <section className="rounded-lg border border-white/10 bg-[#121213]/60 backdrop-blur px-5 py-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <LockClosedIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-lg font-semibold text-white">Privacy &amp; Support</h2>
                </div>

                {/* Your Privacy */}
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-white mb-2">Your Privacy</h3>
                    <p className="text-[#96969F] text-sm font-medium leading-relaxed mb-2">
                        We collect only the minimum data necessary to provide the service: your account email (if you register) and any explicit data.
                    </p>
                    <p className="text-[#96969F] text-sm font-medium leading-relaxed mb-2">
                        Your wage inputs are never stored unless you choose to save them as a template or comparison sheet.
                    </p>
                    <p className="text-[#96969F] text-sm font-medium leading-relaxed">
                        We never (re-)sell, re-share your personal data with third parties.
                    </p>
                    <p className="text-[#96969F] text-sm font-medium leading-relaxed mt-2">
                        You have the right to request deletion of your account and all associated data at any time from your account settings.
                    </p>
                </div>

                {/* GDPR Rights */}
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-white mb-2">GDPR Rights</h3>
                    <ul className="space-y-1.5 text-[#96969F] text-sm font-medium">
                        <li>• Right to access your data</li>
                        <li>• Right to have your data erased</li>
                        <li>• Right to erasure ("right to be forgotten")</li>
                        <li>• Right to data portability</li>
                        <li>• Right to object to processing</li>
                    </ul>
                </div>

                {/* FAQ */}
                <div>
                    <h3 className="text-base font-semibold text-white mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-white/10 pb-3 last:border-b-0">
                                <h4 className="text-white text-sm font-semibold mb-1.5">{faq.question}</h4>
                                <p className="text-[#96969F] text-xs font-medium leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="rounded-lg border border-[#D84124]/30 bg-[#D84124]/10 backdrop-blur px-5 py-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <EnvelopeIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-base font-semibold text-white">Contact Support</h2>
                </div>
                <p className="text-[#96969F] text-sm font-medium mb-3">
                    Have a question or need help? We're here for you.
                </p>
                <a
                    href="mailto:support@wagecomparator.eu"
                    className="inline-flex text-[#D84124] font-semibold hover:text-[#ED8B34] transition-colors"
                >
                    support@wagecomparator.eu
                </a>
            </section>
        </div>
    );
}

export default About;
