type TextAreaProps = React.ComponentPropsWithoutRef<'textarea'>;

/**
 * A reusable textarea component with consistent styling.
 */
export function TextArea({ className, rows = 4, ...props }: TextAreaProps) {
  const baseClasses = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none";
  
  return (
    <textarea
      rows={rows}
      className={`${baseClasses} ${className || ''}`}
      {...props}
    />
  );
} 