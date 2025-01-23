import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";


const CallToActionButton = () => {

  return (
    <motion.button
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group drop-shadow-[0px_10px_2px_rgba(0,0,0,0.4)] relative grid h-[135px] w-[135px] place-content-center rounded-full transition-colors duration-700 ease-out"
    >
      <MdOutlineArrowUpward className="relative z-10 transition-all duration-700 ease-out rotate-90 pointer-events-none text-light-sm md:rotate-45 text-7xl group-hover:rotate-90" />

      <div className="absolute inset-0 z-0 border-[2px] rounded-full pointer-events-none outline outline-4 outline-primary-sm-darker border-sm-ligh bg-primary-sm-darker group-hover:scale-100" />

      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        width="240"
        height="240"
        className="absolute z-10 pointer-events-none"
      >
        <path
          id="circlePath"
          d="M 120, 120
            m 60, 0
            a 60,60 0 1,0 -120,0
            a 60,60 0 1,0  120,0"
          fill="none"
        />
        <text>
          <textPath
            href="#circlePath"
            fill="black"
            className="text-lg font-light tracking-widest uppercase transition-opacity duration-700 ease-out opacity-80 font-lemonMilk fill-light-sm group-hover:opacity-100"
          >
             RESERVA&nbsp;&nbsp;&nbsp;•&nbsp;•&nbsp;•&nbsp;&nbsp;&nbsp;RESERVA&nbsp;&nbsp;&nbsp;•&nbsp;•&nbsp;•&nbsp;&nbsp;&nbsp;
          </textPath>
        </text>
      </motion.svg>
    </motion.button>
  );
};

export default CallToActionButton;