import PageTitle from "@modules/common/components/page-title"
import MenuComponent from "@modules/menu"
import { listMenuItems } from "@lib/data/menu"
import CommingSoon from "../../../comming-soon"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Santa Mónica",
  description:
    "Comida americana con sabor venezolano. Hamburguesas gourmet, carne de la mejor calidad, pollo crujiente, opciones vegetarianas, postres, tequeños y mucho más. ¡Pide a domicilio o recoge en local!",
}

export default async function MenuPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const menuItems = await listMenuItems()
  
  return (
    <>
      {/** Section Tittle */}
      {menuItems.length === 0 ? (
        <CommingSoon />
      ) : (
         <section className="pt-20 pb-20 bg-secondary-sm bg-doodle">
          <div className="flex flex-col items-center justify-center px-10 pb-10">
            <h1 className="santa-monica font-lemonMilk">
              <PageTitle text="Menú" />
            </h1>
          </div>
          <div className="pb-10">
            <MenuComponent menuItems={menuItems}/>
          </div>
        </section>
      )}
     
    </>
  )
}
