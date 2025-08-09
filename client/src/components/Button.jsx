import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Button({
  children,
  className = '',
  variant = 'solid', // 'solid' | 'outline' | 'ghost'
  color = 'primary', // 'primary' | 'gold' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  rounded = 'md', // 'none' | 'sm' | 'md' | 'lg' | 'full'
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold focus:outline-none transition-all duration-200 ease-in-out';

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3',
  };

  const rounds = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variants = {
    solid: {
      primary:
        'bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary/90',
      gold: 'bg-gold text-white shadow-md hover:shadow-lg hover:bg-gold/80',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    outline: {
      primary:
        'border border-primary text-primary hover:bg-primary hover:text-white',
      gold: 'border border-gold text-gold hover:bg-gold hover:text-white',
      danger:
        'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    },
    ghost: {
      primary: 'text-primary hover:bg-primary/10 backdrop-blur-sm',
      gold: 'text-gold hover:bg-gold/10 backdrop-blur-sm',
      danger: 'text-red-600 hover:bg-red-600/10',
    },
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      {...props}
      className={clsx(
        base,
        sizes[size],
        rounds[rounded],
        variants[variant][color],
        'transition-transform duration-150 ease-in-out',
        className
      )}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </motion.button>
  );
}
