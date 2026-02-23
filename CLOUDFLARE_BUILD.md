# 🚀 Configuración de Build para Cloudflare Pages

## Configuración del Proyecto

### Build Settings

**Framework preset:** `None` (sitio estático)

**Build command:** (dejar vacío o usar `echo "No build required"`)

**Build output directory:** `/`

**Root directory:** `/`

---

## Variables de Entorno

No se requieren variables de entorno para este proyecto.

---

## Archivos Principales

### Versión Optimizada (Recomendada)
- **HTML:** `index-optimized.html`
- **CSS:** `styles-optimized.css`
- **JS:** `visualizer-final.js` + `app-optimized.js`

### Versión Original
- **HTML:** `index.html`
- **CSS:** `styles-corregido.css`
- **JS:** `visualizer-final.js`

---

## Configuración de Rutas

### Opción 1: Usar versión optimizada como principal

Renombra los archivos antes del deploy:
```bash
cp index-optimized.html index.html
cp styles-optimized.css styles.css
```

O crea un archivo `_redirects` en la raíz:
```
/  /index-optimized.html  200
```

### Opción 2: Mantener ambas versiones

Acceso:
- Versión optimizada: `https://tu-dominio.pages.dev/index-optimized.html`
- Versión original: `https://tu-dominio.pages.dev/index.html`

---

## Headers Recomendados

Crea un archivo `_headers` en la raíz del proyecto:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/index*.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## Pasos para Deploy en Cloudflare Pages

1. **Conectar Repositorio**
   - Ve a Cloudflare Dashboard → Pages
   - Click en "Create a project"
   - Conecta tu cuenta de GitHub
   - Selecciona el repo: `anansimx/generadorfantasmogenesis`

2. **Configurar Build**
   - Framework preset: `None`
   - Build command: (vacío)
   - Build output directory: `/`
   - Root directory: `/`

3. **Deploy**
   - Click en "Save and Deploy"
   - Cloudflare automáticamente desplegará el sitio

4. **Configurar Dominio Personalizado (Opcional)**
   - Ve a la pestaña "Custom domains"
   - Agrega tu dominio (ej: `generador.fantasmogenesis.art`)
   - Sigue las instrucciones para configurar DNS

---

## Archivos Necesarios en el Repositorio

✅ Ya están en el repo:
- `index-optimized.html` (versión optimizada)
- `styles-optimized.css` (estilos optimizados)
- `visualizer-final.js` (lógica principal)
- `app-optimized.js` (mejoras de UX)
- `fantasmo.png` (logo)
- Todos los archivos de shaders y recursos

---

## Testing Local

Para probar localmente antes del deploy:

```bash
# Opción 1: Python
python server.py

# Opción 2: Python simple
python -m http.server 8080

# Opción 3: Node.js
npx serve .
```

Luego abre: `http://localhost:8080/index-optimized.html`

---

## Notas Importantes

### WebGL y Audio
- El sitio requiere WebGL (soportado en todos los navegadores modernos)
- El AudioContext puede requerir interacción del usuario (click) para iniciar
- MIDI requiere permisos del navegador

### Compatibilidad
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requiere HTTPS para algunas funciones (cámara, micrófono)

### Performance
- Canvas optimizado a 400px de altura para mejor rendimiento
- 40 shaders complejos con loops y efectos avanzados
- Funciona bien en MacBook Pro M3 y dispositivos similares

---

## Estructura de Archivos

```
generadorfantasmogenesis/
├── index-optimized.html      ← Versión optimizada (usar esta)
├── styles-optimized.css      ← Estilos optimizados
├── visualizer-final.js       ← Lógica principal (40 shaders)
├── app-optimized.js          ← Mejoras de UX
├── index.html                ← Versión original
├── styles-corregido.css      ← Estilos originales
├── fantasmo.png              ← Logo
├── server.py                 ← Servidor local de desarrollo
├── OPTIMIZACIONES.md         ← Documentación de cambios
└── README.md                 ← Documentación general
```

---

## Troubleshooting

### El sitio no carga
- Verifica que todos los archivos estén en la raíz
- Revisa la consola del navegador (F12)
- Asegúrate de que `visualizer-final.js` esté presente

### Los shaders no funcionan
- Verifica que WebGL esté habilitado en el navegador
- Revisa errores en la consola
- Prueba con otro navegador

### MIDI no conecta
- Asegúrate de que el sitio esté en HTTPS
- Verifica permisos del navegador
- Conecta el dispositivo MIDI antes de abrir el sitio

---

## Contacto

- GitHub: [@anansimx](https://github.com/anansimx)
- Web: [fantasmogenesis.art](https://fantasmogenesis.art)

---

**¡Listo para deploy! 🚀**
