"use client"
import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {useTranslations} from 'next-intl';
import bgImage from "../../../../../public/sm-crew.jpeg"
import parallax1 from "../../../../../public/parallax1.jpeg"
import parallax2 from "../../../../../public/parallax2.jpeg"
import parallax3 from "../../../../../public/nala.jpeg"
import parallax4 from "../../../../../public/yarlin.jpg"
import parallax5 from "../../../../../public/sm-yaidilier.jpeg"
import parallax6 from "../../../../../public/dani.jpeg"
import parallax7 from "../../../../../public/team.jpg"

export const SmoothScrollHero = () => {
  return (
    <div className="bg-secondary-sm">
      <ReactLenis
        root
        options={{
          // Learn more -> https://github.com/darkroomengineering/lenis?tab=readme-ov-file#instance-settings
          //lerp: 0.05,
          //infinite: true,
          //syncTouch: true,
        }}
      >
        <Hero />
        <Schedule />
      </ReactLenis>
    </div>
  );
};


const SECTION_HEIGHT = 2100;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <ParallaxImages />
    </div>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src={parallax7.src}
        alt="Historia de Santa Mónica"
        start={-300}
        end={300}
        className="w-full mx-auto mb-40 sm:mb-0 sm:w-2/3"
      />
      <ParallaxImg
        src={parallax2.src}
        alt="Historia de Santa Mónica"
        start={-100}
        end={100}
        className="w-2/3 mb-40 sm:w-1/3 sm:mb-0"
      />
      <ParallaxImg
        src={parallax1.src}
        alt="Historia de Santa Mónica"
        start={100}
        end={100}
        className="w-2/3 mb-40 ml-auto sm:w-1/3 sm:mb-0"
      />
      <ParallaxImg
        src={parallax4.src}
        alt="Historia de Santa Mónica"
        start={100}
        end={-100}
        className="w-2/3 mx-auto mb-40 sm:w-1/3"
      />
      <ParallaxImg
        src={parallax5.src}
        alt="Historia de Santa Mónica"
        start={0}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src={parallax6.src}
        alt="Dani comiendo"
        start={0}
        end={-100}s
        className="w-1/3 ml-auto"
      />
      <ParallaxImg
        src={parallax3.src}
        alt="Historia de Santa Mónica"
        start={200}
        end={-300}
        className="w-7/12 ml-32"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }: any) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className + " border-2 border-dark-sm rounded-lg shadow"}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const Schedule = () => {
  const t = useTranslations('About')
  return (
    <section
      id="launch-schedule"
      className="max-w-5xl px-4 py-48 mx-auto text-white"
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-1 text-4xl font-black uppercase font-lemonMilk"
      >
        2022
      </motion.h1>
      <ScheduleItem text={t("2022")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-1 text-4xl font-black uppercase font-lemonMilk"
      >
        2023
      </motion.h1>
      <ScheduleItem text={t("2023")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-1 text-4xl font-black uppercase font-lemonMilk"
      >
        2024
      </motion.h1>
      <ScheduleItem text={t("2024")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-1 text-4xl font-black uppercase font-lemonMilk"
      >
        2025
      </motion.h1>
      <ScheduleItem text={t("2025")} />
    </section>
  );
};

const ScheduleItem = ({ title, text }: any) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 10, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="flex items-center justify-between px-5 mb-32 border-2 rounded-lg shadow-drop py-7 bg-light-sm-lighter border-dark-sm"
    >
      <div>
        {title && <p className="mb-1.5 text-xl text-dark-sm">{title}</p>}
        <p className="text-lg text-dark-sm">{text}</p>
      </div>
    </motion.div>
  );
};