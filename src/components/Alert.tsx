
import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const baseClasses = "alert flex items-start space-x-3";
  const typeClasses = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  const Icon: React.FC<{ type: AlertProps['type'] }> = ({ type }) => {
    if (type === 'error') return <ErrorIcon className="w-5 h-5" />;
    if (type === 'success') return <SuccessIcon className="w-5 h-5" />;
    if (type === 'warning') return <WarningIcon className="w-5 h-5" />;
    return <InfoIcon className="w-5 h-5" />;
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className="flex-shrink-0">
        <Icon type={type} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-base-content">{message}</p>
      </div>
      {onClose && (
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className={`btn btn-ghost btn-xs p-1.5 rounded-md focus:outline-none focus:ring-2 
              ${type === 'success' ? 'hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600 dark:focus:ring-green-500' : ''}
              ${type === 'error' ? 'hover:bg-red-100 dark:hover:bg-red-800 focus:ring-red-600 dark:focus:ring-red-500' : ''}
              ${type === 'warning' ? 'hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:ring-yellow-600 dark:focus:ring-yellow-500' : ''}
              ${type === 'info' ? 'hover:bg-blue-100 dark:hover:bg-blue-800 focus:ring-blue-600 dark:focus:ring-blue-500' : ''}
            `}
            aria-label="Dismiss"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);
const SuccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>
);
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default Alert;
