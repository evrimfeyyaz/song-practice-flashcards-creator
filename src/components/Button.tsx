type ButtonProps = {
  /** Whether the button should display a loading spinner. */
  isLoading?: boolean;
  /** The title of the button. */
  title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A reusable button component with consistent styling.
 */
export function Button({ className, disabled, isLoading, title, ...props }: ButtonProps) {
  const baseClasses = "px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors";
  
  const buttonClasses = disabled || isLoading
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-blue-500 text-white hover:bg-blue-600';

  return (
    <button
      className={`${baseClasses} ${buttonClasses} ${className || ''} relative`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={`flex items-center justify-center gap-2 ${isLoading ? 'invisible' : ''}`}>
        {title}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
} 