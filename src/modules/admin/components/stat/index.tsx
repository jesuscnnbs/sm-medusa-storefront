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
    <div className={`overflow-hidden shadow ${bg}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`text-2xl font-bold ${textPrimary}`}>{value}</div>
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className={`text-sm font-medium truncate ${textPrimary}`}>
                {title}
              </dt>
              <dd className={`text-sm ${textSecondary}`}>
                {description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}