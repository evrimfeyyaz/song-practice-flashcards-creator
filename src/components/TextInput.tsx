type TextInputProps = React.ComponentPropsWithoutRef<'input'>;

/**
 * A reusable text input component with consistent styling.
 */
export function TextInput({ className, ...props }: TextInputProps) {
  const baseClasses = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  
  return (
    <input
      type="text"
      className={`${baseClasses} ${className || ''}`}
      {...props}
    />
  );
} 