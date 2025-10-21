import { twMerge } from "tailwind-merge"

interface StatProps {
  title: string
  value: number
  description: string
  bg: string
  textPrimary: string
  textSecondary: string
}

export default function Stat({
  title,
  value,
  description,
  bg,
  textPrimary,
  textSecondary
}: StatProps) {
  return (
    <div className="border-2 rounded-lg border-dark-sm">
      <div className="-m-0.5 border-2 border-dark-sm rounded-lg">
        <div className={twMerge(
          "relative -m-0.5 border-2 rounded-lg border-dark-sm p-6",
          bg
        )}>
          <div className="flex flex-col">
            <p className={twMerge(
              "text-sm font-medium uppercase mb-2",
              textPrimary
            )}>
              {title}
            </p>
            <div className={twMerge(
              "text-4xl font-bold mb-1",
              textPrimary
            )}>
              {value}
            </div>
            <p className={twMerge(
              "text-xs",
              textSecondary
            )}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}