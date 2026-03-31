# Product Dashboard

## Cómo ejecutar el proyecto

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre en tu navegador:

```text
http://localhost:3000
```

## Decisiones de producto y técnicas

- Usé **Next.js** con el directorio `app` para aprovechar rutas del lado del servidor y una estructura moderna.
- La aplicación está pensada como un **dashboard de productos** con componentes reutilizables: `ProductTable`, `ProductDetail`, `Kpi` y `Skeleton`.
- La arquitectura sigue una separación de responsabilidades: componentes UI en `src/components` y lógica de dominio/puertos en `src/contexts/product`.
- Integré un cliente HTTP en `src/contexts/product/infra/http/ProductView.ts` para abstraer la carga de datos.
- Se usa el hook `useProducts` en `src/hooks/useProducts.ts` para encapsular la obtención de datos y facilitar pruebas o cambios futuros.

## Limitaciones actuales

- No hay autenticación ni gestión de usuarios.
- La aplicación no cuenta con paginación ni filtrado avanzado para listados de productos.
- No existe manejo completo de errores de red o estados de carga sofisticados más allá de un `Skeleton` básico.
- La lógica de negocio está simplificada y depende de endpoints de ejemplo sin una capa de cache o persistencia local.
- No hay tests automatizados incluidos en el repositorio.
- Las funcionalidades de detalle de producto y KPIs son básicas y podrían expandirse con más datos o visualizaciones.
- Los url y puertos de la API están hardcodeados y no son configurables.

## Qué mejoraría con más tiempo

- Añadir **tests unitarios y de integración** para componentes y hooks.
- Implementar **filtrado, búsqueda de catalogos y mejor paginación** en la tabla de productos.
- Agregar **manejo de errores mejorado** y mensajes de UI cuando la API falla.
- Crear una **capa de estado global** o un store para compartir producto seleccionado y datos entre componentes.
- Incluir **autenticación** y una experiencia de usuario más completa con permisos y roles.
- Optimizar el rendimiento con **renderizado en servidor** y caché de datos si el backend lo permite.

## Estructura principal

- `app/page.tsx`: entrada principal de la página.
- `src/components`: componentes visuales del dashboard.
- `src/hooks/useProducts.ts`: hook para obtener productos.
- `src/contexts/product`: dominio y puertos para el modelo de producto.
- `src/util/DummyJsonCli.ts`: utilidad relacionada con datos de ejemplo.
