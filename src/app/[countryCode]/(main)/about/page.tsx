import PageTitle from "@modules/common/components/page-title"

export default async function Menu(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      {/** Section Tittle */}
      <section className="flex flex-col items-center justify-center px-10 pt-20 pb-20 bg-secondary-sm">
        <h1 className="santa-monica">
          <PageTitle text="Historia" />
        </h1>
      </section>
    </>
  )
}
