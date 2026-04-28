import { useNavigate } from 'react-router-dom';

export interface FeatureCardProps {
    title: string;
    description: string;
    to?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconWrapperClassName: string;
    iconClassName: string;
    onClick?: () => void;
}

function FeatureCard({
    title,
    description,
    to,
    icon: Icon,
    iconWrapperClassName,
    iconClassName,
    onClick,
}: FeatureCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group rounded-lg bg-[#121213] backdrop-blur-md p-2 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/5 border border-white/5 hover:border-[#D84124]/30 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] sm:p-3 ${to || onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="flex h-full  gap-3">
                <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex rounded-md p-1.5 icon-shadow ${iconWrapperClassName}`}>
                        <Icon className={iconClassName} />
                    </span>

                </div>

                <div>
                    <h2 className="text-sm font-semibold text-white sm:text-base">
                        {title}
                    </h2>
                    <p className="mt-0.5 max-w-sm text-xs font-normal leading-4 text-[#96969F]">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FeatureCard;
