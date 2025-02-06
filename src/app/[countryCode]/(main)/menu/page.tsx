import PageTitle from "@modules/common/components/page-title"
import MenuComponent from "@modules/menu"

export default async function MenuPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      {/** Section Tittle */}
      <section className="pt-20 pb-20 bg-secondary-sm bg-doodle">
        <div className="flex flex-col items-center justify-center px-10 pb-10">
          <h1 className="santa-monica">
            <PageTitle text="Menú" />
          </h1>
        </div>
        <div className="pb-10">
          <MenuComponent />
        </div>
      </section>
    </>
  )
}
