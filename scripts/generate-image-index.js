const fs = require('fs')
const path = require('path')

// Script para generar índice de imágenes en /public/menu/
// Se ejecuta durante el build para que Vercel pueda listar las imágenes

const menuDir = path.join(process.cwd(), 'public', 'menu')
const outputFile = path.join(menuDir, 'images.json')

try {
  console.log('🔍 Generando índice de imágenes...')
  console.log(`   Directorio: ${menuDir}`)

  // Crear directorio si no existe
  if (!fs.existsSync(menuDir)) {
    fs.mkdirSync(menuDir, { recursive: true })
    console.log('✓ Directorio /public/menu/ creado')
  }

  // Leer archivos del directorio
  const files = fs.readdirSync(menuDir)
  console.log(`   Archivos encontrados: ${files.length}`)

  // Filtrar solo archivos de imagen (excluir images.json)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const imageFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext) && file !== 'images.json'
    })
    .map(file => `/menu/${file}`)
    .sort()
    .reverse() // Más recientes primero

  // Guardar como JSON
  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2))

  console.log(`✓ Índice de imágenes generado: ${imageFiles.length} imágenes`)
  console.log(`✓ Archivo guardado: ${outputFile}`)

  // Listar primeras 5 imágenes
  if (imageFiles.length > 0) {
    console.log('   Primeras imágenes:')
    imageFiles.slice(0, 5).forEach(img => console.log(`   - ${img}`))
    if (imageFiles.length > 5) {
      console.log(`   ... y ${imageFiles.length - 5} más`)
    }
  }

  process.exit(0)
} catch (error) {
  console.error('✗ Error generando índice de imágenes:', error.message)
  console.error('   Stack:', error.stack)

  // Asegurarse de que el directorio existe
  if (!fs.existsSync(menuDir)) {
    fs.mkdirSync(menuDir, { recursive: true })
  }

  // Crear archivo vacío si hay error
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2))
  console.log('✓ Archivo images.json creado vacío como fallback')

  process.exit(0) // No fallar el build
}
