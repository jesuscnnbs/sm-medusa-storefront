import { Button } from "@medusajs/ui"
import { PlusMini, PencilSquare, Trash } from "@medusajs/icons"

export default function AdminUsersPage() {
  // TODO: Implement with your backend - fetch admin users
  const adminUsers = [
    {
      id: "1",
      name: "Admin Principal",
      email: "admin@santamonicaburgers.com",
      role: "Super Admin",
      status: "Activo",
      lastLogin: "2024-01-15 14:30"
    },
    {
      id: "2", 
      name: "María González",
      email: "maria@santamonicaburgers.com",
      role: "Admin",
      status: "Activo",
      lastLogin: "2024-01-14 09:15"
    },
    {
      id: "3",
      name: "Carlos Mendoza", 
      email: "carlos@santamonicaburgers.com",
      role: "Moderador",
      status: "Inactivo",
      lastLogin: "2024-01-10 16:45"
    }
  ]

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-sm">Administradores</h1>
          <p className="text-grey-sm-darker">Gestiona los usuarios administradores del sistema</p>
        </div>
        <Button className="bg-primary-sm text-white hover:bg-primary-sm/90">
          <PlusMini className="w-4 h-4 mr-2" />
          Nuevo Administrador
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-ui-border-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-5 border-b border-ui-border-base">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Nombre</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Rol</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Último Acceso</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-grey-5">
                  <td className="px-6 py-4">
                    <div className="font-medium text-dark-sm">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 text-grey-sm-darker">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-grey-sm-darker">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="small">
                        <PencilSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="small" className="text-red-600 hover:text-red-800">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Funcionalidad en Desarrollo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Esta página está lista para conectar con tu backend personalizado. 
                Las acciones de crear, editar y eliminar administradores necesitan ser implementadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}