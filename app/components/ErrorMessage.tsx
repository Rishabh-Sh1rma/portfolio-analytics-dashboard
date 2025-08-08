import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-foreground/80 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}