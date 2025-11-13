# 🔐 Configuración de GitHub API

## ✅ Implementación Completada

Se ha implementado la funcionalidad de guardar cambios directamente en GitHub. Los usuarios ahora pueden modificar registros desde el cliente y esos cambios se persistirán en el archivo `tracking.json` del repositorio.

## 📋 Pasos para Configurar

### 1. Crear Personal Access Token en GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Configuración del token:
    - **Note**: `polarier-cloud-tracking-write`
    - **Expiration**: 90 días (o lo que prefieras)
    - **Scopes**: Marca `repo` (acceso completo a repositorios)
4. Click en "Generate token"
5. **COPIA el token inmediatamente** (solo se muestra una vez)

### 2. Configurar Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto:

```bash
GITHUB_TOKEN=tu_nuevo_token_aqui
GITHUB_OWNER=PilaAlkarina
GITHUB_REPO=polarier-cloud-tracking
GITHUB_BRANCH=main
```

⚠️ **IMPORTANTE**:

-   NUNCA subas el archivo `.env.local` a GitHub
-   Ya está incluido en `.gitignore`
-   El token es como una contraseña, mantenlo seguro

### 3. Reiniciar el Servidor de Desarrollo

Después de configurar las variables de entorno:

```bash
# Detén el servidor (Ctrl+C)
# Reinicia el servidor
npm run dev
```

## 🎯 Cómo Funciona

### Flujo de Datos:

1. **Usuario hace cambios** → Se actualizan en el estado de React
2. **Click en "💾 Guardar"** → Envía datos al endpoint `/api/tracking` (PUT)
3. **API obtiene SHA actual** → Necesario para actualizar archivo en GitHub
4. **Transforma datos** → `Pantalla[]` → `TrackingItemRaw[]`
5. **Actualiza GitHub** → Commit automático en el repositorio
6. **Confirmación** → Botón muestra "✅ Guardado"

### Características Implementadas:

-   ✅ Endpoint PUT en `/api/tracking`
-   ✅ Transformación inversa de datos
-   ✅ Manejo de SHA para evitar conflictos
-   ✅ Estados de carga (Guardando/Guardado/Error)
-   ✅ Mensajes automáticos de commit
-   ✅ Feedback visual al usuario
-   ✅ Manejo robusto de errores

## 🧪 Testing

### Prueba 1: Guardar Cambios

1. Haz cambios en el dashboard (marca tareas como importadas/verificadas)
2. Click en "💾 Guardar"
3. Confirma el diálogo
4. Espera el mensaje "✅ Guardado"
5. Ve a GitHub y verifica el commit en `tracking.json`

### Prueba 2: Persistencia

1. Guarda cambios
2. Cierra el navegador
3. Abre de nuevo la aplicación
4. Los cambios deben persistir (vienen desde GitHub)

### Prueba 3: Reset

1. Haz cambios locales SIN guardar
2. Click en "🔄 Reset"
3. Los cambios locales se descartan
4. Se recarga desde GitHub

## 🔧 Troubleshooting

### Error: "GITHUB_TOKEN no configurado"

-   Verifica que `.env.local` existe
-   Verifica que el token está correctamente copiado
-   Reinicia el servidor de desarrollo

### Error: "Error al obtener SHA"

-   Verifica que el token tiene permisos `repo`
-   Verifica que el nombre del repositorio es correcto
-   Verifica que estás autenticado en GitHub

### Error: "Error al actualizar"

-   Puede haber un conflicto (alguien más modificó el archivo)
-   Haz reset y vuelve a intentar
-   Verifica que el token no ha expirado

## 📊 Estructura de Archivos Modificados

```
polarier-cloud-tracking/
├── .env.local (NUEVO - NO COMMITEAR)
├── app/api/tracking/route.ts (MODIFICADO)
│   ├── Agregado endpoint PUT
│   └── Función transformPantallasToRaw()
├── hooks/useTrackingData.ts (MODIFICADO)
│   ├── Estados isSaving y saveStatus
│   └── Función saveToGitHub()
└── components/Dashboard.tsx (MODIFICADO)
    └── Botón "💾 Guardar" con estados
```

## 🔒 Seguridad

-   ✅ Token en variable de entorno
-   ✅ `.env.local` en `.gitignore`
-   ✅ Token NO se expone al cliente
-   ✅ Autenticación en cada request
-   ✅ Confirmación antes de guardar

## 📝 Notas Adicionales

-   Los commits automáticos tienen timestamp: `📊 Actualizar tracking - 2025-11-13T10:30:00.000Z`
-   El auto-reset cada 5 minutos NO afecta los datos guardados en GitHub
-   localStorage se sincroniza con GitHub después de cada guardado exitoso
-   El botón muestra el estado: Normal → Guardando → Guardado/Error

---

**¿Necesitas ayuda?** Revisa los logs en la consola del navegador (F12) para más detalles.
