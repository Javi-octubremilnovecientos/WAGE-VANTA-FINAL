import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Pages - Level 1
import Home from '../../pages/Home';
import Dashboard from '../../pages/Dashboard';
import About from '../../pages/About';
import Plans from '../../pages/Plans';
import NotFound from '../../pages/404';

// Pages - Level 2 - Comparison
import ComparisonSheet from '../../pages/comparison/ComparisonSheet';
import MyTemplates from '../../pages/comparison/MyTemplates';
import SavedComparisons from '../../pages/comparison/SavedComparisons';

// Pages - Level 3 - User Settings
import UserSettings from '../../pages/user/UserSettings';
import UserData from '../../pages/user/UserData';
import ManagePlan from '../../pages/user/ManagePlan';
import BillingAndPayment from '../../pages/user/BillingAndPayment';
import PasswordRecovery from '../../pages/user/PasswordRecovery';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'comparison',
                element: <ComparisonSheet />,
            },
            {
                path: 'templates',
                element: <MyTemplates />,
            },
            {
                path: 'saved-comparisons',
                element: <SavedComparisons />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'plans',
                element: <Plans />,
            },
            {
                path: 'settings',
                element: <UserSettings />,
            },
            {
                path: 'user-data',
                element: <UserData />,
            },
            {
                path: 'manage-plan',
                element: <ManagePlan />,
            },
            {
                path: 'billing',
                element: <BillingAndPayment />,
            },
            {
                path: 'password-recovery',
                element: <PasswordRecovery />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
];
