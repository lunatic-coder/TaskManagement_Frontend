'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { LOGIN_REQUEST } from '@/modules/AuthModule/Types/RequestTypes';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LOGIN_REQUEST>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginData = handleSubmit(async (values) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('values', values);

      // Simulate login API call
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Or{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleLoginData} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
              onFocus={() => clearErrors('email')}
              className="w-full px-3 py-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              onFocus={() => clearErrors('password')}
              className="w-full px-3 py-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>

            <Link href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
