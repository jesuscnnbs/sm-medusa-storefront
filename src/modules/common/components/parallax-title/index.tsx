import { clx } from "@medusajs/ui";
import ParallaxText from "../parallax-text";

interface Props {
  textPrimary: string;
  textSecondary: string;
  className?: string;
}

function ParallaxTitle({textPrimary, textSecondary, className=""}: Props) {
  return (
    <div className={clx('bg-ui-bg-base border-y-4 border-dark-sm-lighter', className)}>
        <ParallaxText baseVelocity={-0.8}>
          <span className="font-light sm:text-5xl text-secondary-sm">{textPrimary}<span className="text-dark-sm-lighter">&nbsp;{textSecondary}</span></span>
        </ParallaxText>
        <ParallaxText baseVelocity={0.8}>
          <span className="font-light sm:text-5xl text-secondary-sm">{textPrimary}<span className="text-dark-sm-lighter">&nbsp;{textSecondary}</span></span>
        </ParallaxText>
      </div>
  );
}

export default ParallaxTitle;