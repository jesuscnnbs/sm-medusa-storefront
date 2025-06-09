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
import parallax7 from "../../../../../public/sm-cabo-gata.jpeg"

export const SmoothScrollHero = () => {
  return (
    <div className="bg-secondary-sm">
      <ReactLenis
        root
        options={{
          // Learn more -> https://github.com/darkroomengineering/lenis?tab=readme-ov-file#instance-settings
          lerp: 0.05,
          //   infinite: true,
          //   syncTouch: true,
        }}
      >
        <Hero />
        <Schedule />
      </ReactLenis>
    </div>
  );
};


const SECTION_HEIGHT = 3000;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <ParallaxImages />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 w-full h-screen"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          `url(${bgImage.src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src={parallax1.src}
        alt="And example of a space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src={parallax2.src}
        alt="An example of a space launch"
        start={200}
        end={-250}
        className="w-2/3 mx-auto"
      />
      <ParallaxImg
        src={parallax3.src}
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="w-1/3 ml-auto"
      />
      <ParallaxImg
        src={parallax4.src}
        alt="Orbiting satellite"
        start={100}
        end={-100}
        className="w-5/12 ml-24"
      />
      <ParallaxImg
        src={parallax5.src}
        alt="Orbiting satellite"
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
        src={parallax7.src}
        alt="Orbiting satellite"
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
      className={className}
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
        className="mb-20 text-4xl font-black uppercase text-zinc-50 font-lemonMilk"
      >
        2022
      </motion.h1>
      <ScheduleItem text={t("2022")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50 font-lemonMilk"
      >
        2023
      </motion.h1>
      <ScheduleItem text={t("2023")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50 font-lemonMilk"
      >
        2024
      </motion.h1>
      <ScheduleItem text={t("2024")} />
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50 font-lemonMilk"
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
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="flex items-center justify-between px-3 mb-32 border-b-8 border-primary-sm pb-9"
    >
      <div>
        {title && <p className="mb-1.5 text-xl text-zinc-50">{title}</p>}
        <p className="text-lg text-zinc-50">{text}</p>
      </div>
    </motion.div>
  );
};