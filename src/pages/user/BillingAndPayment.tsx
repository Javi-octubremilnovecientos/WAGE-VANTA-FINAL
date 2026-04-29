import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { formSteps } from '@/features/salaries/salaryConstants';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { updatePayData, selectUserPayData } from '@/features/auth/authSlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import type { CardData, PaymentCharge } from '@/lib/User';

// Validación Luhn para número de tarjeta
const luhnCheck = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\s/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

const paymentSchema = z.object({
    cardholderName: z.string()
        .min(3, 'Cardholder name must be at least 3 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
    cardNumber: z.string()
        .refine((val) => {
            const digits = val.replace(/\s/g, '');
            return /^\d{13,19}$/.test(digits);
        }, 'Card number must be 13-19 digits')
        .refine((val) => luhnCheck(val), 'Invalid card number'),
    expiryMonth: z.string()
        .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month (01-12)'),
    expiryYear: z.string()
        .regex(/^\d{2}$/, 'Invalid year (YY format)')
        .refine((val) => {
            const year = parseInt(`20${val}`, 10);
            const currentYear = new Date().getFullYear();
            return year >= currentYear && year <= currentYear + 20;
        }, 'Card expired or invalid year'),
    cvv: z.string()
        .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    country: z.string()
        .min(2, 'Please select a country'),
    postalCode: z.string()
        .min(3, 'Postal code must be at least 3 characters')
        .max(10, 'Postal code must be at most 10 characters'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

function BillingAndPayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentPayData = useAppSelector(selectUserPayData);
    const [updateUser] = useUpdateUserMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Obtener países del formSteps
    const countryOptions = formSteps[0].fields[0].options ?? [];

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            cardholderName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            country: '',
            postalCode: '',
        },
    });

    const selectedCountry = watch('country');

    // Formatear número de tarjeta mientras se escribe (grupos de 4)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setValue('cardNumber', formatted, { shouldValidate: false });
    };

    const onSubmit = async (data: PaymentFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Construir CardData a partir del formulario
            const cardData: CardData = {
                cardNumber: data.cardNumber.replace(/\s/g, '').slice(-4), // Solo últimos 4 dígitos
                cardName: data.cardholderName,
                expires: `${data.expiryMonth}/${data.expiryYear}`,
            };

            // Construir nuevo registro de cargo en historial
            const newCharge: PaymentCharge = {
                id: Date.now(),
                cardFourDigits: cardData.cardNumber,
                state: 'pending',
                chargeDate: new Date().toISOString(),
            };

            // Construir el nuevo payData preservando el historial existente
            const newPayData = {
                card: cardData,
                history: [...(currentPayData?.history ?? []), newCharge],
            };

            // Persistir en Supabase: se guarda en user_metadata.payData
            await updateUser({ data: { payData: newPayData } }).unwrap();

            // Actualizar Redux con el nuevo payData
            dispatch(updatePayData(newPayData));

            setSubmitSuccess(true);

            // Redirigir al dashboard después de 3 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setSubmitError('Failed to save payment method. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#D84124] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Add Payment Method
                </h1>
                <p className="text-sm text-[#96969F] mt-2">
                    Enter your card details to subscribe to Premium
                </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
                <div className="rounded-lg border border-green-600/50 bg-green-500/10 p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-400 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-green-400">
                                Payment method added successfully!
                            </p>
                            <p className="text-xs text-green-300/80 mt-1">
                                Redirecting to dashboard...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="rounded-lg border border-red-600/50 bg-red-500/10 p-4">
                    <p className="text-sm text-red-400">{submitError}</p>
                </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Card Information Section */}
                <section className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCardIcon className="h-4 w-4 text-[#D84124]" />
                        <h2 className="text-base font-semibold text-white">Card Information</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Cardholder Name */}
                        <div>
                            <label
                                htmlFor="cardholderName"
                                className="block text-xs font-medium text-[#96969F] mb-1.5"
                            >
                                Cardholder Name
                            </label>
                            <input
                                id="cardholderName"
                                type="text"
                                {...register('cardholderName')}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                            />
                            {errors.cardholderName && (
                                <p className="mt-1 text-xs text-red-400">{errors.cardholderName.message}</p>
                            )}
                        </div>

                        {/* Card Number */}
                        <div>
                            <label
                                htmlFor="cardNumber"
                                className="block text-xs font-medium text-[#96969F] mb-1.5"
                            >
                                Card Number
                            </label>
                            <div className="relative">
                                <input
                                    id="cardNumber"
                                    type="text"
                                    {...register('cardNumber')}
                                    onChange={handleCardNumberChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                                />
                            </div>
                            {errors.cardNumber && (
                                <p className="mt-1 text-xs text-red-400">{errors.cardNumber.message}</p>
                            )}
                        </div>

                        {/* Expiry Date and CVV - Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Expiry Date */}
                            <div>
                                <label
                                    htmlFor="expiryMonth"
                                    className="block text-xs font-medium text-[#96969F] mb-1.5"
                                >
                                    Expiry Date
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        id="expiryMonth"
                                        type="text"
                                        {...register('expiryMonth')}
                                        placeholder="MM"
                                        maxLength={2}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                                    />
                                    <input
                                        id="expiryYear"
                                        type="text"
                                        {...register('expiryYear')}
                                        placeholder="YY"
                                        maxLength={2}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                                    />
                                </div>
                                {(errors.expiryMonth || errors.expiryYear) && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.expiryMonth?.message || errors.expiryYear?.message}
                                    </p>
                                )}
                            </div>

                            {/* CVV */}
                            <div>
                                <label
                                    htmlFor="cvv"
                                    className="block text-xs font-medium text-[#96969F] mb-1.5"
                                >
                                    CVV
                                </label>
                                <input
                                    id="cvv"
                                    type="text"
                                    {...register('cvv')}
                                    placeholder="123"
                                    maxLength={4}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                                />
                                {errors.cvv && (
                                    <p className="mt-1 text-xs text-red-400">{errors.cvv.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Billing Address Section */}
                <section className="rounded-lg border border-white/10 bg-[#121213]/40 backdrop-blur px-4 py-5 shadow-lg sm:px-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Billing Address</h3>

                    <div className="space-y-4">
                        {/* Country */}
                        <div>
                            <label className="block text-xs font-medium text-[#96969F] mb-1.5">
                                Country
                            </label>
                            <Listbox value={selectedCountry} onChange={(value) => setValue('country', value, { shouldValidate: false })}>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all text-left hover:bg-white/10 cursor-pointer">
                                        <span className="block truncate">
                                            {selectedCountry ? countryOptions.find(o => o.value === selectedCountry)?.label : 'Select country'}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-50 w-full mt-1 py-1 bg-[#121213] border border-white/10 rounded-md shadow-lg focus:outline-none max-h-60 overflow-auto">
                                            {countryOptions.map((option) => (
                                                <Listbox.Option
                                                    key={option.value}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-2 px-3 ${active ? 'bg-[#D84124] text-white' : 'text-gray-300 hover:bg-white/10'
                                                        }`
                                                    }
                                                    value={option.value}
                                                >
                                                    {({ selected }) => (
                                                        <span className={`block truncate ${selected ? 'font-semibold text-[#D84124]' : 'font-normal'}`}>
                                                            {option.label}
                                                        </span>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                            {errors.country && (
                                <p className="mt-1 text-xs text-red-400">{errors.country.message}</p>
                            )}
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label
                                htmlFor="postalCode"
                                className="block text-xs font-medium text-[#96969F] mb-1.5"
                            >
                                Postal Code
                            </label>
                            <input
                                id="postalCode"
                                type="text"
                                {...register('postalCode')}
                                placeholder="12345"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-[#96969F]/50 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:border-transparent transition-all"
                            />
                            {errors.postalCode && (
                                <p className="mt-1 text-xs text-red-400">{errors.postalCode.message}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Security Notice */}
                <div className="rounded-md bg-blue-500/10 border border-blue-600/50 px-4 py-3">
                    <p className="text-xs text-blue-300">
                        🔒 Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] bg-brand-gradient"
                >
                    {isSubmitting ? 'Processing...' : submitSuccess ? 'Payment Added!' : 'Add Payment Method'}
                </button>
            </form>
        </div>
    );
}

export default BillingAndPayment;
