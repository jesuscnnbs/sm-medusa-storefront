const fs = require('fs')
const path = require('path')

// Script para generar índice de imágenes en /public/menu/
// Se ejecuta durante el build para que Vercel pueda listar las imágenes

const menuDir = path.join(process.cwd(), 'public', 'menu')
const outputFile = path.join(process.cwd(), 'public', 'menu', 'images.json')

try {
  // Crear directorio si no existe
  if (!fs.existsSync(menuDir)) {
    fs.mkdirSync(menuDir, { recursive: true })
    console.log('✓ Directorio /public/menu/ creado')
  }

  // Leer archivos del directorio
  const files = fs.readdirSync(menuDir)

  // Filtrar solo archivos de imagen
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const imageFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })
    .map(file => `/menu/${file}`)
    .sort()
    .reverse() // Más recientes primero

  // Guardar como JSON
  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2))

  console.log(`✓ Índice de imágenes generado: ${imageFiles.length} imágenes encontradas`)
  console.log(`  Archivo: ${outputFile}`)
} catch (error) {
  console.error('✗ Error generando índice de imágenes:', error)
  // Crear archivo vacío si hay error
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2))
}
