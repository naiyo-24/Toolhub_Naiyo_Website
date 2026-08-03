import React from"react";
import { motion, HTMLMotionProps } from"framer-motion";
import { cn } from"../../lib/utils"; interface NeoCardProps extends HTMLMotionProps<"div"> { children: React.ReactNode; color?:"white" |"blue" |"mint" |"yellow" |"pink" |"purple" |"orange"; hoverEffect?: boolean;
} export function NeoCard({ children, className, color ="white", hoverEffect = true, ...props
}: NeoCardProps) { const colorMap = { white:"bg-white", blue:"bg-neo-blue", mint:"bg-neo-mint", yellow:"bg-neo-yellow", pink:"bg-neo-pink", purple:"bg-neo-purple", orange:"bg-neo-orange", }; return ( <motion.div whileHover={ hoverEffect ? { y: -4, x: -4, boxShadow:"12px 12px 0px 0px #000000", rotate: 1, } : {} } className={cn("border-3 border-black p-6 shadow-[8px_8px_0px_0px_#000000] transition-colors", colorMap[color], className )} {...props} > {children} </motion.div> );
}
