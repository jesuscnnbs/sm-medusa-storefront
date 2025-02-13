"use client"
import React, { useRef, PropsWithChildren, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps extends PropsWithChildren {
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const repeatedContent = useMemo(() => Array(8).fill(children), [children]);

  return (
    <div className="flex m-0 overflow-hidden flex-nowrap whitespace-nowrap">
      <motion.div 
        className="flex leading-[1.2] uppercase flex-nowrap whitespace-nowrap parallax-text font-lemonMilk font-bold tracking-tighter text-secondary-sm" 
        style={{ x, willChange: 'transform' }}
      >
        {repeatedContent.map((content, index) => (
          <span key={index} className="block mr-3">{content}</span>
        ))}
      </motion.div>
    </div>
  );
}

export default React.memo(ParallaxText);