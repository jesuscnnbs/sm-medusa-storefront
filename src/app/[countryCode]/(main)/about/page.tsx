import PageTitle from "@modules/common/components/page-title"

export default async function Menu(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      {/** Section Tittle */}
      <section className="py-20 bg-primary-sm pb-44">
        <h1 className="santa-monica">
          <PageTitle text="Historia" />
        </h1>
      </section>
    </>
  )
}
