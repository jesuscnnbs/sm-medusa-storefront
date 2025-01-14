"use client"
import React, { PropsWithChildren, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const SPRING_OPTIONS = {
  mass: 1.5,
  stiffness: 500,
  damping: 100,
};

const CallToActionButton = () => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, SPRING_OPTIONS);
  const ySpring = useSpring(y, SPRING_OPTIONS);

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const { height, width } = ref.current.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;

    const xPct = offsetX / width;
    const yPct = 1 - offsetY / height;

    const newY = 12 + yPct * 12;
    const newX = xPct * 12;

    x.set(newX);
    y.set(-newY);
  };

  const handleReset = () => {
    x.set(0);
    y.set(0);
  };

  return (
      <div className="w-full h-16 mx-auto lg:h-20 bg-[rgba(0,0,0,0.2)] drop-shadow-[0px_10px_2px_rgba(0,0,0,0.3)] max-w-96">
        <motion.button
          ref={ref}
          style={{
            transform,
          }}
          onMouseMove={handleMove}
          onMouseLeave={handleReset}
          onMouseDown={handleReset}
          className="flex items-center justify-between w-full h-full gap-4 px-6 text-lg font-semibold uppercase lg:text-xl lg:px-8 text-light-sm bg-primary-sm-lighter group"
        >
          <Copy>Reserva</Copy>
          <Arrow />
        </motion.button>
      </div>
  );
};

const Copy = ({ children }: PropsWithChildren) => {
  return (
    <span className="relative overflow-hidden">
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute top-0 left-0 block transition-transform duration-300 translate-y-full group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
};

const Arrow = () => (
  <div className="flex w-6 h-6 overflow-hidden text-2xl pointer-events-none">
    <FiArrowRight className="transition-transform duration-300 -translate-x-full shrink-0 group-hover:translate-x-0" />
    <FiArrowRight className="transition-transform duration-300 -translate-x-full shrink-0 group-hover:translate-x-0" />
  </div>
);

export default CallToActionButton;