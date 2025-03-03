import PageTitle from "@modules/common/components/page-title"
import {SmoothScrollHero} from "@modules/about/components/hero"

export default async function Menu(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      {/** Section Tittle */}
      <section className="flex flex-col items-center justify-center px-2 pt-20 pb-20 lg:px-10 bg-secondary-sm">
        <h1 className="santa-monica monica">
          <PageTitle text="Historia" />
        </h1>
      </section>
      <section>
        <SmoothScrollHero />
      </section>
    </>
  )
}
