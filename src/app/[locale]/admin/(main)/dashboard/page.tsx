import { Metadata } from "next"
import { getDashboardStats } from "@lib/db/queries"
import Stat from "@modules/admin/components/stat"

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
      title: "Categorías", 
      value: stats.activeCategoriesCount,
      description: "Categorías activas",
      bg: "bg-primary-sm-lighter",
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Menu Management */}
      <div className="overflow-hidden shadow bg-light-sm-lighter">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-5">
                  <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="text-sm font-medium truncate text-grey-sm">
                  Menú y Categorías
                </dt>
                <dd className="text-lg font-medium text-dark-sm">
                  Gestión
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-light-sm">
          <div className="text-sm">
            <a href="/admin/menu/all" className="font-medium transition-colors text-secondary-sm hover:text-secondary-sm-darker">
              Ver Menú →
            </a>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="overflow-hidden rounded-md shadow bg-light-sm-lighter">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-5">
                  <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="text-sm font-medium truncate text-grey-sm">
                  Gestión de Usuarios
                </dt>
                <dd className="text-lg font-medium text-dark-sm">
                  Administradores
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-light-sm">
          <div className="text-sm">
            <a href="/admin/admin" className="font-medium transition-colors text-primary-sm hover:text-primary-sm-darker">
              Ver Usuarios →
            </a>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="overflow-hidden shadow bg-light-sm-lighter">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-dark-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-5">
                  <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="text-sm font-medium truncate text-grey-sm">
                  Ajustes del Sitio Web
                </dt>
                <dd className="text-lg font-medium text-dark-sm">
                  Configurar ajustes
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-light-sm">
          <div className="text-sm">
            <a href="/admin/settings" className="font-medium transition-colors text-dark-sm hover:text-dark-sm-darker">
              Ver ajustes →
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 shadow bg-light-sm-lighter">
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