import { Metadata } from "next"
import { getDashboardStats } from "@lib/db/queries"
import Stat from "@modules/admin/components/stat"
import { SpringCard, SpringCardsGrid } from "@modules/admin/components/spring-card"

export const metadata: Metadata = {
  title: "Admin Dashboard - Santa Monica",
  description: "Admin dashboard for Santa Monica restaurant management",
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statsData = [
    {
      title: "Menu",
      value: stats.menuItemsCount,
      description: "Elementos activos",
      bg: "bg-secondary-sm",
      textPrimary: "text-light-sm",
      textSecondary: "text-light-sm"
    },
    {
      title: "Categorias",
      value: stats.activeCategoriesCount,
      description: "Categorias activas",
      bg: "bg-primary-sm",
      textPrimary: "text-light-sm",
      textSecondary: "text-light-sm"
    },
    {
      title: "Administrador(es)",
      value: stats.menuProfilesCount,
      description: "Activos",
      bg: "bg-light-sm",
      textPrimary: "text-dark-sm",
      textSecondary: "text-grey-sm"
    }
  ]
  return (
    <>
    <SpringCardsGrid className="mb-8">
      <SpringCard
        title="MENU"
        subtitle="Gestiona tu menu, categorias y platos del restaurante. Crea, edita y organiza los items."
        href="/admin/menu"
        buttonText="VER MENU"
        circularText="MENU • PLATOS • CATEGORIAS • MENU • PLATOS •"
        className="bg-secondary-sm"
        textColor="text-light-sm"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
          </svg>
        }
      />

      <SpringCard
        title="AJUSTES"
        subtitle="Configura las opciones generales del sitio web. Personaliza la experiencia de tus clientes."
        href="/admin/settings"
        buttonText="CONFIGURAR"
        circularText="AJUSTES • CONFIGURACION • OPCIONES • AJUSTES •"
        bgColor="bg-emerald-600"
        borderColor="border-dark-sm"
        textColor="text-light-sm"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.570.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
          </svg>
        }
      />

      <SpringCard
        title="USUARIOS"
        subtitle="Administra los usuarios del panel de administracion. Controla permisos y accesos."
        href="/admin/admin"
        buttonText="VER USUARIOS"
        circularText="ADMINISTRADORES • USUARIOS • PERMISOS • ADMIN •"
        bgColor="bg-light-sm"
        borderColor="border-dark-sm"
        textColor="text-dark-sm"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
          </svg>
        }
      />

    </SpringCardsGrid>

    <div className="mt-8 rounded-lg shadow bg-light-sm-lighter">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-dark-sm">
          Estadísticas
        </h3>
        <div className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
          {statsData.map((stat, index) => (
            <Stat
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              bg={stat.bg}
              textPrimary={stat.textPrimary}
              textSecondary={stat.textSecondary}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  )
}