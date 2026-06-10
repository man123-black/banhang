export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50'
  };
  const sizes = { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };
  return <button className={`rounded font-medium transition ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
