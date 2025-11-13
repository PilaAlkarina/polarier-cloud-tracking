# 📝 Funcionalidades de Edición de Tareas

## ✅ Implementación Completada

Se han agregado funcionalidades completas de edición para las tareas del dashboard, permitiendo gestionar completamente el proyecto desde la interfaz.

---

## 🎯 Funcionalidades Implementadas

### 1. **🗑️ Eliminar Tareas**

**Cómo usar:**

-   Pasa el cursor sobre cualquier tarea
-   Aparecerá un botón **✕** en rojo a la derecha
-   Click en el botón
-   Confirma la eliminación en el diálogo

**Características:**

-   ✅ Confirmación obligatoria antes de eliminar
-   ✅ Eliminación instantánea del estado local
-   ✅ Se mantiene en localStorage hasta guardar
-   ⚠️ **Recuerda hacer click en "💾 Guardar" para persistir en GitHub**

---

### 2. **📅 Modificar Fecha Límite**

**Cómo usar:**

-   Click en la fecha mostrada en cada tarea
-   Se abre un selector de fecha (input type="date")
-   Selecciona la nueva fecha
-   Presiona **Enter** o haz click fuera para guardar
-   Presiona **Escape** para cancelar

**Características:**

-   ✅ Editor inline (no abre modal)
-   ✅ Formato automático DD/MM
-   ✅ Actualización instantánea
-   ✅ Las tareas se reorganizan automáticamente por sección (Hoy/Atrasadas/Próximas)

---

### 3. **⋮⋮ Reordenar Tareas (Cambiar Prioridad)**

**Cómo usar:**

-   Haz click y mantén presionado en el icono **⋮⋮** (al inicio de cada tarea)
-   Arrastra la tarea hacia arriba o abajo
-   Suelta en la nueva posición
-   El número de prioridad se actualiza automáticamente

**Características:**

-   ✅ Drag & Drop suave con feedback visual
-   ✅ Recalcula automáticamente la prioridad numérica (#1, #2, #3...)
-   ✅ Funciona dentro de cada sección y usuario
-   ✅ Overlay visual durante el arrastre
-   ✅ Compatible con teclado (Tab + Espacio + Flechas)

---

### 4. **👤 Cambiar Responsable (Arrastrar entre Usuarios)**

**Cómo usar:**

-   Arrastra una tarea con el icono **⋮⋮**
-   Suelta sobre el **header de otro usuario** (la barra de color con el nombre)
-   La tarea se reasigna automáticamente

**Características:**

-   ✅ Reasignación instantánea
-   ✅ La tarea se mueve a la columna del nuevo usuario
-   ✅ Mantiene la fecha límite y estado
-   ✅ Funciona entre todas las secciones

---

## 🎨 Interfaz de Usuario

### Indicadores Visuales

#### **Estado de las Tareas:**

-   🔴 **Borde rojo + fondo rojo claro**: Tareas con errores (`conErrores: true`)
-   🟡 **Borde amarillo + fondo amarillo**: En desarrollo (`enDesarrollo: true`)
-   🔵 **Fondo azul claro**: Tareas de hoy
-   🔴 **Fondo rojo claro**: Tareas atrasadas
-   🟢 **Fondo verde claro**: Tareas futuras
-   ✅ **Fondo verde esmeralda**: Tareas completadas

#### **Interactividad:**

-   **⋮⋮**: Icono de arrastre (gris normal, gris oscuro al hover)
-   **✕**: Botón eliminar (aparece solo al hover)
-   **Fecha clickeable**: Se puede editar con un click
-   **Cursor**: Cambia a "grab" al hover sobre ⋮⋮

---

## 💾 Guardar Cambios

### ⚠️ IMPORTANTE: Persistencia

Todos los cambios (eliminar, reordenar, cambiar fecha, cambiar usuario) se guardan:

1. **Automáticamente en localStorage** → Cambios inmediatos en tu navegador
2. **Manualmente en GitHub** → Click en "💾 Guardar" para persistir

**Flujo recomendado:**

1. Realiza todos tus cambios
2. Verifica que todo esté correcto
3. Click en "💾 Guardar"
4. Espera el mensaje "✅ Guardado"
5. Los cambios ahora están en GitHub y visibles para todos

---

## 🔧 Funciones del Hook

Las siguientes funciones están disponibles en `useTrackingData()`:

```typescript
const {
    pantallas, // Array de todas las tareas
    deletePantalla, // (id: number) => void
    updateFechaLimite, // (id: number, fecha: string) => void
    updateResponsable, // (id: number, usuario: string) => void
    reorderPantallas, // (fromIndex: number, toIndex: number) => void
    saveToGitHub, // () => Promise<void>
} = useTrackingData();
```

---

## 🎮 Atajos de Teclado

### Drag & Drop con Teclado:

1. **Tab**: Navegar entre tareas
2. **Espacio**: Activar modo arrastre
3. **Flechas ↑↓**: Mover tarea
4. **Espacio**: Soltar en nueva posición
5. **Escape**: Cancelar

### Editor de Fecha:

-   **Enter**: Guardar cambios
-   **Escape**: Cancelar edición

---

## 📦 Dependencias Instaladas

```json
{
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x"
}
```

**Características de @dnd-kit:**

-   ✅ Accesible (WCAG compliant)
-   ✅ Compatible con touch devices
-   ✅ Performance optimizado
-   ✅ TypeScript friendly
-   ✅ Sin dependencias pesadas

---

## 🧪 Testing Manual

### Test 1: Eliminar Tarea

1. ✅ Hover sobre tarea → Aparece botón ✕
2. ✅ Click en ✕ → Aparece confirmación
3. ✅ Confirmar → Tarea desaparece
4. ✅ Guardar → Cambio persistido en GitHub

### Test 2: Cambiar Fecha

1. ✅ Click en fecha → Se abre selector
2. ✅ Seleccionar nueva fecha → Actualización inmediata
3. ✅ Tarea se mueve a sección correcta (Hoy/Atrasadas/Futuras)
4. ✅ Guardar → Fecha persistida

### Test 3: Reordenar

1. ✅ Arrastrar tarea con ⋮⋮
2. ✅ Mover arriba/abajo
3. ✅ Números de prioridad se recalculan
4. ✅ Guardar → Orden persistido

### Test 4: Cambiar Usuario

1. ✅ Arrastrar tarea con ⋮⋮
2. ✅ Soltar sobre header de otro usuario
3. ✅ Tarea aparece en columna del nuevo usuario
4. ✅ Guardar → Responsable actualizado en GitHub

---

## 🐛 Troubleshooting

### Las tareas no se arrastran

-   Verifica que estés clickeando en el icono **⋮⋮**
-   Intenta con otro navegador (Chrome/Edge recomendados)

### Los cambios no persisten después de recargar

-   Asegúrate de hacer click en **"💾 Guardar"**
-   Espera el mensaje "✅ Guardado"
-   Verifica que el token de GitHub esté configurado en `.env.local`

### El auto-reset borra mis cambios

-   El auto-reset cada 5 minutos recarga desde GitHub
-   **Solución**: Guarda tus cambios antes de que pase el auto-reset
-   O desactiva el auto-reset temporalmente

### No puedo cambiar el usuario arrastrando

-   Asegúrate de soltar sobre el **header del usuario** (barra de color)
-   No sobre las tareas del usuario

---

## 📊 Estructura de Datos

### Pantalla (Tarea)

```typescript
interface Pantalla {
    id: number;
    nombre: string;
    modulo: string;
    prioridad: Prioridad;
    prioridadNum?: number; // Se actualiza al reordenar
    importada: boolean;
    verificada: boolean;
    estado: Estado;
    responsable?: string; // Se actualiza al cambiar usuario
    fechaLimite?: string; // Se actualiza al editar fecha
    // ... otros campos
}
```

---

## 🎯 Próximas Mejoras Sugeridas

-   [ ] Deshacer/Rehacer cambios (Ctrl+Z)
-   [ ] Arrastrar múltiples tareas a la vez
-   [ ] Filtros avanzados (por usuario, módulo, prioridad)
-   [ ] Búsqueda de tareas
-   [ ] Vista de calendario
-   [ ] Notificaciones de tareas próximas
-   [ ] Comentarios en tareas
-   [ ] Historial de cambios

---

**¿Necesitas más funcionalidades?** Las nuevas características están listas para ser extendidas fácilmente.
