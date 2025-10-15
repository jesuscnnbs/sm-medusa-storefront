import { Metadata } from "next"
import { listMenuCategories } from "@lib/db/queries"
import { NewMenuCategory } from "@lib/db"

export const metadata: Metadata = {
  title: "Categorías - Santa Monica Admin",
  description: "Gestión de categorías del menú",
}

export default async function AdminCategories() {
  const categories = await listMenuCategories()
  
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-dark-sm">Categorías del Menú</h1>
        <p className="text-grey-sm">Gestiona las categorías de tu menú</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.length === 0 ? (
          <div className="p-8 text-center bg-light-sm-lighter">
            <div className="mb-4 text-grey-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-dark-sm">No hay categorías</h3>
            <p className="text-grey-sm">Aún no has creado ninguna categoría para tu menú.</p>
          </div>
        ) : (
          categories.map((category: NewMenuCategory) => (
            <div key={category.id} className="overflow-hidden shadow bg-light-sm-lighter">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-12 h-12 ${category.isActive ? 'bg-secondary-sm' : 'bg-grey-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-white size-6">
                          <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 ml-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-dark-sm">
                            {category.name}
                          </h3>
                          {category.nameEn && (
                            <p className="mt-0 text-sm truncate text-grey-sm">
                              {category.nameEn}
                            </p>
                          )}
                          {category.description && (
                            <p className="mt-1 text-sm text-grey-sm line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Activa' : 'Inactiva'}
                      </div>
                      <div className="mt-1 text-xs text-grey-sm">
                        Orden: {category.sortOrder}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-light-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-grey-sm">
                    Creada: {category.createdAt && new Date(category.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button className="px-1 text-sm font-medium transition-colors text-primary-sm hover:text-primary-sm-darker">
                      Editar →
                    </button>
                    <button className="px-1 text-sm font-medium transition-colors text-secondary-sm hover:text-secondary-sm-darker">
                      Ver Elementos →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {categories.length > 0 && (
        <div className="mt-8 shadow bg-light-sm-lighter">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-dark-sm">
              Resumen de Categorías
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="p-4 overflow-hidden shadow bg-secondary-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-light-sm">{categories.length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium truncate text-light-sm">
                        Total Categorías
                      </dt>
                      <dd className="text-sm text-light-sm">
                        En el sistema
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="p-4 overflow-hidden bg-green-600 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{categories.filter(c => c.isActive).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Activas
                      </dt>
                      <dd className="text-sm text-white">
                        Visibles en el menú
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="p-4 overflow-hidden bg-red-600 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{categories.filter(c => !c.isActive).length}</div>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-white truncate">
                        Inactivas
                      </dt>
                      <dd className="text-sm text-white">
                        Ocultas del menú
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}