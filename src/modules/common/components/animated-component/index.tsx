'use client'
import { motion, Variants } from 'framer-motion'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  variant: Variants;
}

const AnimatedComponent = ({ variant, children }: Props) => {
  return (
    <motion.div variants={variant} initial="initial" animate="animate">
      {children}
    </motion.div>
  )
}


export default AnimatedComponent