'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-error" />
        <h2 className="mb-2 text-2xl font-bold text-white">¡Algo salió mal!</h2>
        <p className="mb-6 text-gray-400">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
