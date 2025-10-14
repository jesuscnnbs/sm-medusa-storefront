import { Button } from "@medusajs/ui"
import { Check, BellAlert, ShieldCheck, GlobeEurope, CreditCard, ArchiveBox } from "@medusajs/icons"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-sm">Ajustes</h1>
        <p className="text-grey-sm-darker">Configura las opciones del sistema</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="p-6 bg-white border rounded-lg shadow-sm border-ui-border-base">
          <div className="flex items-center mb-4">
            <GlobeEurope className="w-5 h-5 mr-2 text-primary-sm" />
            <h2 className="text-lg font-semibold text-dark-sm">Configuración General</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                Nombre del Restaurante
              </label>
              <input
                type="text"
                defaultValue="Santa Monica Burgers"
                className="w-full px-3 py-2 border rounded-md border-ui-border-base focus:outline-none focus:ring-2 focus:ring-primary-sm"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                Idioma por Defecto
              </label>
              <select className="w-full px-3 py-2 border rounded-md border-ui-border-base focus:outline-none focus:ring-2 focus:ring-primary-sm">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                Zona Horaria
              </label>
              <select className="w-full px-3 py-2 border rounded-md border-ui-border-base focus:outline-none focus:ring-2 focus:ring-primary-sm">
                <option value="America/Mexico_City">México (GMT-6)</option>
                <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                <option value="America/New_York">New York (GMT-5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white border rounded-lg shadow-sm border-ui-border-base">
          <div className="flex items-center mb-4">
            <BellAlert className="w-5 h-5 mr-2 text-primary-sm" />
            <h2 className="text-lg font-semibold text-dark-sm">Notificaciones</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Nuevos pedidos</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Reservaciones</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Inventario bajo</span>
              <input type="checkbox" className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Email notificaciones</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-6 bg-white border rounded-lg shadow-sm border-ui-border-base">
          <div className="flex items-center mb-4">
            <ShieldCheck className="w-5 h-5 mr-2 text-primary-sm" />
            <h2 className="text-lg font-semibold text-dark-sm">Seguridad</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                Tiempo de Sesión (minutos)
              </label>
              <input
                type="number"
                defaultValue="120"
                className="w-full px-3 py-2 border rounded-md border-ui-border-base focus:outline-none focus:ring-2 focus:ring-primary-sm"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Autenticación de dos factores</span>
              <input type="checkbox" className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Registro de actividad</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="p-6 bg-white border rounded-lg shadow-sm border-ui-border-base">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-primary-sm" />
            <h2 className="text-lg font-semibold text-dark-sm">Métodos de Pago</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Stripe</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">PayPal</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-sm">Efectivo</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-sm" />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-dark-sm">
                Moneda
              </label>
              <select className="w-full px-3 py-2 border rounded-md border-ui-border-base focus:outline-none focus:ring-2 focus:ring-primary-sm">
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="USD">Dólar Americano (USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="p-6 bg-white border rounded-lg shadow-sm border-ui-border-base lg:col-span-2">
          <div className="flex items-center mb-4">
            <ArchiveBox className="w-5 h-5 mr-2 text-primary-sm" />
            <h2 className="text-lg font-semibold text-dark-sm">Base de Datos</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 text-center rounded-lg bg-grey-5">
              <div className="text-2xl font-bold text-primary-sm">1,245</div>
              <div className="text-sm text-grey-sm-darker">Total Pedidos</div>
            </div>
            
            <div className="p-4 text-center rounded-lg bg-grey-5">
              <div className="text-2xl font-bold text-primary-sm">89</div>
              <div className="text-sm text-grey-sm-darker">Productos en Menú</div>
            </div>
            
            <div className="p-4 text-center rounded-lg bg-grey-5">
              <div className="text-2xl font-bold text-primary-sm">342</div>
              <div className="text-sm text-grey-sm-darker">Clientes Registrados</div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" size="small">
              Respaldar Base de Datos
            </Button>
            <Button variant="secondary" size="small">
              Limpiar Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="text-white bg-primary-sm hover:bg-primary-sm/90">
          <Check className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Development Notice */}
      <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Funcionalidad en Desarrollo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Esta página de configuración está lista para conectar con tu backend personalizado. 
                Las funcionalidades de guardado y configuración necesitan ser implementadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}