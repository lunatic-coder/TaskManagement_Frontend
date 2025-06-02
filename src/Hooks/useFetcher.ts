import { useState } from 'react';

interface ErrorResponse {
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface HttpOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export function useFetcher (){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState< null>(null);

  const sendRequest = async (options: HttpOptions) => {
    const { url, method, body, headers } = options;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },

      };

      if (method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(responseData));
      }

      setData(responseData);
      return responseData;
    } catch (err: unknown) {
      let parsedError: ErrorResponse = {
        message: 'An unknown error occurred',
      };

      if (err instanceof Error) {
        try {
          parsedError = JSON.parse(err.message);
        } catch {
          parsedError.message = err.message;
        }
      } else if (typeof err === 'string') {
        parsedError.message = err;
      }

      setError(parsedError);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, sendRequest };
};