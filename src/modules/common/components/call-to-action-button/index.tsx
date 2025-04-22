"use client"
import React from "react";
import {
  motion,
} from "framer-motion";
import { MdOutlineArrowUpward } from "react-icons/md";

interface Props {
  text: string
}

const CallToActionButton = ({text}: Props) => {
  const textContent = React.useMemo(
    () => (
      text === "Reservar" ?
      `${text} ✹ ${text} ✹ `:
      `${text} ✹ ✹ ${text} ✹ ✹`
    ),
    []
  );

  return (
    <motion.button
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group relative grid h-[150px] w-[150px] place-content-center rounded-full transition-colors duration-700 ease-out"
    >
      <MdOutlineArrowUpward className="relative z-10 text-5xl transition-transform duration-700 ease-out rotate-90 pointer-events-none text-dark-sm group-hover:rotate-0" />

      <div className="absolute inset-0 z-0 border-[2px] rounded-full pointer-events-none bg-ui-bg-base" />

      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          willChange: "transform",
        }}
        width="240"
        height="240"
        className="absolute z-10 pointer-events-none"
      >
        <path
          id="circlePath"
          d="M 168 120 A 48 48 90 1 1 72 120 A 48 48 90 1 1 168 120"
          fill="none"
        />
        <text>
          <textPath
            href="#circlePath"
            fill="black"
            className="text-[1.4rem] uppercase transition-opacity duration-200 ease-out opacity-100 font-lemonMilk fill-dark-sm"
          >
             {textContent}
          </textPath>
        </text>
      </motion.svg>
    </motion.button>
  );
};

export default React.memo(CallToActionButton);