'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { SIGN_UP_REQUEST } from '@/modules/AuthModule/Types/RequestTypes';
import { useFetcher } from '@/Hooks/useFetcher';

type FormInputs = SIGN_UP_REQUEST & {
    confirmPassword: string;
    acceptTerms: boolean;
    role: 'admin' | 'user';
};

export default function SignupPage() {
    const { loading, error, sendRequest } = useFetcher();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
            role: 'user', // default role
        },
    });

    const handleSignUp = handleSubmit(async (values) => {
        await sendRequest({
            url: 'http://localhost:3003/api/auth/signup',
            method: 'POST',
            body: {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
            },
        });

    })

    const password = watch('password');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
            <div className="max-w-md w-full space-y-6 p-8 bg-white shadow-lg rounded-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-5">
                    {/* Username */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                            <p className="font-semibold">{error.message}</p>
                            {error.details?.map((detail, idx) => (
                                <p key={idx} className="text-sm mt-1">
                                    <strong>{detail.field}:</strong> {detail.message}
                                </p>
                            ))}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="John Doe"
                            {...register('name', { required: 'Full name is required' })}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Invalid email format',
                                },
                            })}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
                                    message:
                                        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol',
                                },
                            })}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repeat password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match',
                            })}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Select Role
                        </label>
                        <select
                            id="role"
                            {...register('role', { required: 'Role is required' })}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        >
                            <option value="user">Regular User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
                    </div>


                    {/* Terms & Conditions */}
                    <div className="flex items-center">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            {...register('acceptTerms', {
                                required: 'You must accept the Terms and Privacy Policy',
                            })}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                            I agree to the{' '}
                            <Link href="/terms" className="text-indigo-600 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-indigo-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    {errors.acceptTerms && <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>}



                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
