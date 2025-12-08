import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'glass' | 'elevated'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hover = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl border border-dark-border transition-all duration-300'

    const variants = {
      default: 'bg-dark-card',
      glass: 'bg-dark-card/60 backdrop-blur-md',
      elevated: 'bg-dark-card shadow-lg',
    }

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={hover ? { y: -5, scale: 1.02 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card



