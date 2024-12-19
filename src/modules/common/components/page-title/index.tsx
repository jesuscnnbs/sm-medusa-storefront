interface Props {
  text: string;
  initialDelay?: number;
  classNames?: string;
}

export default function PageTitle({text, initialDelay=0, classNames=""}: Props) {
  return (
    <span className={classNames}>
      <div className="relative block text-start font-lemonMilk">
        {text.split("").map((letter, index) => {
          const delayMs = index*50+initialDelay
          return (
            <div key={index} className={`delay-${delayMs} relative inline-block transition-transform opacity-0 animate-fade-in-bottom`}>
              {letter}
            </div>
          )
        })}
      </div>
    </span>
  )
}
