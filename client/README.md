# Pokemon App - Frontend con Vite + TypeScript 🔷⚡

Este es el frontend modernizado del proyecto Pokemon, migrado de Create React App a Vite y convertido a TypeScript.

## 🚀 Tecnologías Actualizadas

- **TypeScript 5.9** ✨ (nuevo)
- **React 19** (antes 17)
- **Vite 7** (antes Create React App)
- **Redux Toolkit** (antes Redux tradicional)
- **React Router v7** (antes v5)
- **Axios** actualizado
- Sin vulnerabilidades de seguridad ✅
- Tipado estático completo 🔒

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecutar el proyecto

```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:5173`

## 🔧 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción (verifica tipos)
- `npm run type-check` - Verifica tipos de TypeScript sin compilar
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta ESLint

## 📝 Cambios principales de la migración

### Redux Toolkit
En lugar de actions y reducers separados, ahora usamos slices:

```javascript
// Antes
dispatch(getAllPokemons())

// Ahora
dispatch(fetchAllPokemons())
```

### React Router v6
```javascript
// Antes
<Route exact path="/" component={LandingPage} />

// Ahora
<Route path="/" element={<LandingPage />} />
```

### useNavigate en lugar de useHistory
```javascript
// Antes
const history = useHistory()
history.push('/pokemons')

// Ahora
const navigate = useNavigate()
navigate('/pokemons')
```

## 🎯 Ventajas de Vite

- ⚡ **Inicio ultra rápido** - HMR instantáneo
- 📦 **Build optimizado** - Más rápido que Webpack
- 🔥 **Hot Module Replacement** - Actualizaciones sin perder estado
- 🛠️ **Mejor DX** - Errores más claros y útiles

## 🔷 TypeScript

El proyecto está completamente tipado con TypeScript:
- ✅ Interfaces para todos los componentes
- ✅ Tipos completos en Redux
- ✅ Hooks tipados personalizados
- ✅ Eventos tipados
- ✅ Strict mode habilitado

Ver [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md) para más detalles.

## 🔗 Backend

Recuerda iniciar el backend en otra terminal:

```bash
cd ../api
npm start
```

El backend debe estar corriendo en `http://localhost:3001`
