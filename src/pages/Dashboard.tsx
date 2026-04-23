import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import FeatureCard from "../components/ui/cards/FeatureCard";
import SavedDataCard from "../components/ui/cards/SavedDataCard";
import type { FeatureCardProps } from "../components/ui/cards/FeatureCard";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { selectUser, selectUserPremium, selectUserComparisons, logout } from "@/features/auth/authSlice";
import { setSelectedCountries, setFormValues, setComputedStats } from "@/features/salaries/salarySlice";
import type { Comparison } from "@/lib/User";
import type { ComparisonFormValues, BoxPlotData } from "@/features/salaries/types";

const shortcuts: FeatureCardProps[] = [
  {
    title: "Saved Comparisons",
    description: "Review your saved wage comprasion charts.",
    to: "/saved-comparisons",
    icon: ChartBarSquareIcon,
    iconWrapperClassName: "bg-[#45d2fd]/20 text-[#45d2fd]",
    iconClassName: "h-6 w-6",
  },
  {
    title: "My Templates",
    description: "Templates to fill out forms with a click",
    to: "/templates",
    icon: DocumentTextIcon,
    iconWrapperClassName: "bg-[#45d2fd]/20 text-[#45d2fd]",
    iconClassName: "h-6 w-6",
  },
  {
    title: "User Settings",
    description: "Update your user info",
    to: "/settings",
    icon: Cog6ToothIcon,
    iconWrapperClassName: "bg-[#45d2fd]/20 text-[#45d2fd]",
    iconClassName: "h-6 w-6",
  },
  {
    title: "Manage Plan",
    description:
      "Track your plan limits and upgrade when you need more features.",
    to: "/manage-plan",
    icon: CreditCardIcon,
    iconWrapperClassName: "bg-[#45d2fd]/20 text-[#45d2fd]",
    iconClassName: "h-6 w-6",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isPremium = useAppSelector(selectUserPremium);
  const comparisons = useAppSelector(selectUserComparisons);

  // Obtener la última comparación (más reciente)
  const lastComparison = comparisons.length > 0
    ? [...comparisons].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0]
    : null;

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLoadComparison = (comparison: Comparison) => {
    dispatch(setSelectedCountries(comparison.selectedCountries));
    dispatch(setFormValues(comparison.formValues as ComparisonFormValues));
    dispatch(setComputedStats(comparison.computedStats as BoxPlotData[]));
    navigate('/comparison');
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-3 sm:px-4 lg:px-6 ">
      <section className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ">
          <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
            {user?.name || 'Usuario'}
          </h1>
        </div>
        <div className="flex flex-row justify-between items-center flex-wrap gap-2">
          <span className={`inline-flex w-fit items-center rounded-full border backdrop-blur px-2.5 py-0.5 text-xs font-medium shadow-sm transition-colors ${isPremium
            ? 'border-yellow-600/50 bg-yellow-500/10 text-yellow-300'
            : 'border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}>
            {isPremium ? '⭐ Premium Plan' : 'Free Plan'}
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1 self-start rounded-md px-1.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors"
          >
            <HomeIcon className="h-3 w-3 md:h-4 md:w-4" />
            Home
          </Link>
        </div>

        {/* Recent Comparisons */}
        {shortcuts.map((shortcut) => (
          <FeatureCard key={shortcut.title} {...shortcut} />
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
            Recent Comparisons
          </h2>
          <Link
            to="/saved-comparisons"
            className="text-xs font-semibold text-[#45d2fd] transition-colors hover:text-[#22b8d9]"
          >
            View all
          </Link>
        </div>

        {!lastComparison ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 backdrop-blur px-3 py-6 text-center shadow-lg sm:px-5">
            <div className="mx-auto flex max-w-md flex-col items-center gap-2">
              <div className="inline-flex rounded-full bg-[#45d2fd]/20 p-1.5 text-[#45d2fd]">
                <ChartBarSquareIcon className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                No comparisons saved yet
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#45d2fd] transition-colors hover:text-[#22b8d9]"
              >
                Start comparing
                <ArrowRightIcon className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        ) : (
          <SavedDataCard
            comparison={lastComparison}
            onView={() => handleLoadComparison(lastComparison)}
            variant="compact"
          />
        )}
      </section>

      {!isPremium && (
        <section>
          <Link
            to="/plans"
            className="group flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50/60 dark:from-gray-900/60 via-[#22b8d9]/20 to-gray-50/60 dark:to-gray-900/60 backdrop-blur px-3 py-3 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:px-4"
          >
            <span className="inline-flex rounded-lg bg-[#45d2fd]/20 p-1.5 text-[#45d2fd]">
              <SparklesIcon className="h-3.5 w-3.5" />
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold tracking-tight text-[#45d2fd]">
                Upgrade to Premium
              </h2>
              <p className="mt-0.5 text-xs leading-4 text-gray-500 dark:text-gray-400">
                Unlock exports, multiple chart views, more templates and extra
                comparisons.
              </p>
            </div>

            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-colors group-hover:text-[#45d2fd]" />
          </Link>
        </section>
      )}

      {/* Sign Out Button */}
      <section>
        <button
          onClick={handleSignOut}
          className="w-full rounded-md bg-red-500/20 text-red-400 py-2 text-sm font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}

export default Dashboard;
