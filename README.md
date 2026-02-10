# 🎮 TaskQuest - Gamified RPG Task Manager

<div align="center">

![TaskQuest Logo](https://img.shields.io/badge/TaskQuest-RPG%20Task%20Manager-00F0FF?style=for-the-badge&logo=gamepad&logoColor=white)

**Transforma tu productividad en una aventura épica de RPG**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## ✨ Características

- 🎯 **Sistema de Misiones** - Convierte tareas en misiones épicas con diferentes tipos y dificultades
- ⚔️ **Batallas de Jefe** - Las misiones principales incluyen jefes con barras de HP
- 📊 **Sistema de Atributos** - Desarrolla Creatividad, Lógica, Enfoque y Comunicación
- ⭐ **Progresión XP/Niveles** - Sube de nivel y desbloquea nuevos títulos
- 💰 **Sistema de Recompensas** - Gana oro y gemas al completar tareas
- 🔥 **Rachas Diarias** - Mantén tu racha para obtener multiplicadores de XP
- 🏆 **Logros** - Desbloquea logros épicos por tus hazañas
- 🎨 **Tema Cyberpunk** - Diseño oscuro con efectos de neón

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** | Framework React con App Router |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos utilitarios |
| **Prisma** | ORM para PostgreSQL |
| **Framer Motion** | Animaciones fluidas |
| **Lucide React** | Iconografía |
| **Zustand** | Estado global |

## 📁 Estructura del Proyecto

```
taskmanager/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── app/
│   │   ├── api/           # API Routes
│   │   │   ├── character/
│   │   │   ├── quests/
│   │   │   └── tasks/
│   │   ├── globals.css    # Estilos globales
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página principal
│   ├── components/
│   │   ├── character/     # Componentes de personaje
│   │   ├── quest/         # Componentes de misiones
│   │   └── ui/            # Componentes base UI
│   └── lib/
│       ├── prisma.ts      # Cliente Prisma
│       ├── types.ts       # Tipos TypeScript
│       ├── utils.ts       # Utilidades
│       └── xp-calculator.ts # Cálculos de XP
├── .env.example           # Variables de entorno
├── next.config.js         # Configuración Next.js
├── tailwind.config.ts     # Configuración Tailwind
└── package.json
```

## 🚀 Instalación Rápida

### Prerrequisitos

- Node.js 18.17 o superior
- npm, yarn, pnpm o bun
- Cuenta en [Neon](https://neon.tech) o [Supabase](https://supabase.com) (PostgreSQL gratuito)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <tu-repo-url>
cd taskmanager

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 4. Generar cliente Prisma y sincronizar BD
npm run db:push

# 5. (Opcional) Cargar datos de prueba
npm run db:seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎮

## 🔧 Configuración de Base de Datos

### Opción A: Neon (Recomendado)

1. Crea una cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Pégala en `.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/taskquest?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/taskquest?sslmode=require"
```

### Opción B: Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database > Connection string
4. Configura las URLs en `.env`

## 🚢 Despliegue en Vercel

### Despliegue Automático

1. Sube tu código a GitHub/GitLab/Bitbucket
2. Importa el proyecto en [Vercel](https://vercel.com/new)
3. Configura las variables de entorno:
   - `DATABASE_URL`
   - `DIRECT_URL`
4. ¡Deploy! ✅

### Despliegue Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Producción
vercel --prod
```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:push` | Sincroniza esquema con BD |
| `npm run db:migrate` | Crea migración |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:seed` | Carga datos iniciales |

## 🎨 Personalización del Tema

Edita `tailwind.config.ts` para personalizar colores:

```typescript
colors: {
  primary: '#00F0FF',    // Cyan neón
  secondary: '#FF00FF',  // Magenta
  accent: '#FFD700',     // Oro
  background: '#0A0E27', // Fondo oscuro
}
```

## 📊 Modelo de Datos

```
Character (1) ──── (N) Quest (1) ──── (N) Task
    │                      │
    ├── Attributes         ├── Boss Battle (opcional)
    ├── Achievements       └── Rewards
    └── Inventory
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT © TaskQuest

---

<div align="center">

**¿Te gusta TaskQuest?** ⭐ ¡Dale una estrella al repo!

Hecho con 💜 para diseñadores UX/UI y desarrolladores Frontend

</div>
