type ButtonVariant = 'primary';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  /** The visual variant of the button. */
  variant?: ButtonVariant;
};

/**
 * A reusable button component with consistent styling.
 */
export function Button({ className, variant = 'primary', disabled, ...props }: ButtonProps) {
  const baseClasses = "px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors";
  
  const variantClasses = {
    primary: disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-blue-500 text-white hover:bg-blue-600'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      disabled={disabled}
      {...props}
    />
  );
} 