# 🎮 TaskQuest - Gamified RPG Task Manager

<div align="center">

![TaskQuest Banner](https://img.shields.io/badge/🎮_TaskQuest-Gamified_Task_Manager-00F0FF?style=for-the-badge&labelColor=0A0E27)

### **Transforma tu productividad en una aventura épica de RPG**

*Convierte tus tareas diarias en misiones, sube de nivel, desbloquea logros y conquista tu día a día como un verdadero héroe.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.1.3-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/franSixto/taskQuest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

---

## 📖 Tabla de Contenidos

- [✨ Características](#-características)
- [🎥 Demo](#-demo)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación Rápida](#-instalación-rápida)
- [🔧 Configuración](#-configuración-de-base-de-datos)
- [📜 Scripts Disponibles](#-scripts-disponibles)
- [🎨 Personalización](#-personalización-del-tema)
- [🚢 Despliegue](#-despliegue-en-vercel)
- [🤝 Contribuir](#-contribuir)
- [📝 Licencia](#-licencia)

---

## ✨ Características

### 🎯 Sistema de Misiones Épicas
Convierte cualquier tarea en una misión con diferentes tipos y niveles de dificultad:
- **Misiones Principales** - Proyectos importantes con jefes finales
- **Misiones Secundarias** - Tareas del día a día
- **Misiones Diarias/Semanales** - Hábitos recurrentes
- **Batallas de Jefe** - Desafíos con barras de HP y recompensas épicas

### 📊 Sistema de Progresión RPG
- **4 Atributos** - Creatividad 🎨, Lógica 🧠, Enfoque 🎯, Comunicación 💬
- **Sistema de Niveles** - Gana XP, sube de nivel, desbloquea títulos
- **Rachas Diarias** - Multiplicadores de XP por consistencia
- **Logros Épicos** - Colecciona medallas por tus hazañas

### 💰 Economía del Juego
- **Oro** - Moneda básica por completar tareas
- **Gemas** - Moneda premium por logros especiales
- **Tienda de Recompensas** - Canjea tu oro por premios reales
- **Seguimiento de Facturación** - Opcional para freelancers

### 🎨 Diseño Cyberpunk
- Tema oscuro con efectos de neón brillantes
- Animaciones fluidas con Framer Motion
- Interfaz responsive para todos los dispositivos
- Componentes reutilizables y personalizables

---

## 🎥 Demo

> 🚧 **Demo en vivo próximamente** - Mientras tanto, clona el repo y ejecútalo localmente

```bash
git clone https://github.com/franSixto/taskQuest.git
cd taskQuest
npm install && npm run dev
```

### Capturas de Pantalla

<details>
<summary>📸 Ver capturas de pantalla</summary>

| Dashboard Principal | Sistema de Misiones |
|:---:|:---:|
| *Panel con estadísticas del personaje* | *Lista de misiones activas* |

| Perfil del Personaje | Tienda de Recompensas |
|:---:|:---:|
| *Atributos y progresión* | *Canjea oro por premios* |

</details>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 14
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
<br>Prisma ORM
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=sqlite" width="48" height="48" alt="SQLite" />
<br>SQLite
</td>
</tr>
</table>

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR, API Routes, File-based routing |
| **Lenguaje** | TypeScript 5.4 | Tipado estático y mejor DX |
| **Estilos** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Base de Datos** | SQLite + Prisma ORM | Persistencia local (migrable a PostgreSQL) |
| **Animaciones** | Framer Motion 11 | Animaciones declarativas y fluidas |
| **Estado** | Zustand 4.5 | Estado global minimalista |
| **Iconos** | Lucide React | Iconografía moderna y consistente |
| **Utilidades** | clsx, tailwind-merge, date-fns | Helpers para estilos y fechas |

## 📁 Estructura del Proyecto

```
taskQuest/
├── 📂 prisma/
│   ├── schema.prisma        # 📋 Esquema de base de datos
│   ├── seed.ts              # 🌱 Datos iniciales
│   └── migrations/          # 📦 Migraciones de BD
│
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 api/          # 🔌 API Routes (REST)
│   │   │   ├── character/   #    └─ Endpoints del personaje
│   │   │   ├── quests/      #    └─ CRUD de misiones
│   │   │   ├── tasks/       #    └─ Gestión de tareas
│   │   │   ├── rewards/     #    └─ Sistema de recompensas
│   │   │   └── stats/       #    └─ Estadísticas
│   │   ├── globals.css      # 🎨 Estilos globales + tema cyberpunk
│   │   ├── layout.tsx       # 📐 Layout principal
│   │   ├── page.tsx         # 🏠 Página principal
│   │   ├── loading.tsx      # ⏳ Estado de carga
│   │   └── error.tsx        # ❌ Manejo de errores
│   │
│   ├── 📂 components/
│   │   ├── 📂 character/    # 👤 Componentes del personaje
│   │   │   ├── character-card.tsx
│   │   │   ├── attribute-bar.tsx
│   │   │   └── xp-popup.tsx
│   │   ├── 📂 quest/        # ⚔️ Componentes de misiones
│   │   │   ├── quest-card.tsx
│   │   │   ├── quest-detail.tsx
│   │   │   ├── quest-form.tsx
│   │   │   └── task-item.tsx
│   │   ├── 📂 rewards/      # 🏆 Sistema de recompensas
│   │   │   └── reward-shop.tsx
│   │   ├── 📂 stats/        # 📊 Dashboard y estadísticas
│   │   │   ├── stats-dashboard.tsx
│   │   │   └── quest-history.tsx
│   │   └── 📂 ui/           # 🧩 Componentes base reutilizables
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       ├── progress-bar.tsx
│   │       └── toast.tsx
│   │
│   └── 📂 lib/
│       ├── prisma.ts        # 🔗 Cliente Prisma singleton
│       ├── types.ts         # 📝 Tipos TypeScript
│       ├── utils.ts         # 🔧 Funciones utilitarias
│       └── xp-calculator.ts # 🧮 Lógica de cálculo XP
│
├── .env.example             # 📋 Variables de entorno ejemplo
├── next.config.js           # ⚙️ Configuración Next.js
├── tailwind.config.ts       # 🎨 Configuración Tailwind + colores
├── tsconfig.json            # 📘 Configuración TypeScript
└── package.json             # 📦 Dependencias y scripts
```

## 🚀 Instalación Rápida

### Prerrequisitos

- **Node.js** 18.17 o superior ([descargar](https://nodejs.org/))
- **npm**, yarn, pnpm o bun
- **Git** ([descargar](https://git-scm.com/))

### Instalación en 5 pasos

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/franSixto/taskQuest.git
cd taskQuest

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Configurar variables de entorno
cp .env.example .env
# El archivo ya viene configurado para SQLite local

# 4️⃣ Inicializar la base de datos
npm run db:push

# 5️⃣ (Opcional) Cargar datos de ejemplo
npm run db:seed
```

### Iniciar el servidor

```bash
npm run dev
```

🎮 Abre **[http://localhost:3000](http://localhost:3000)** y comienza tu aventura!

## 🔧 Configuración de Base de Datos

Por defecto, TaskQuest usa **SQLite** para desarrollo local (sin configuración adicional).

### SQLite (Por defecto - Desarrollo local)

```env
DATABASE_URL="file:./dev.db"
```

### Migrar a PostgreSQL (Producción)

<details>
<summary>📘 Opción A: Neon (Recomendado - Gratis)</summary>

1. Crea una cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Actualiza `.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/taskquest?sslmode=require"
```

5. Cambia el provider en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

6. Ejecuta: `npm run db:push`

</details>

<details>
<summary>📗 Opción B: Supabase (Gratis)</summary>

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings > Database > Connection string**
4. Configura `.env` y el provider como en la opción anterior

</details>

<details>
<summary>📙 Opción C: Railway (Fácil deploy)</summary>

1. Crea cuenta en [railway.app](https://railway.app)
2. Añade un servicio PostgreSQL
3. Copia la connection URL
4. Configura las variables de entorno

</details>

## 🚢 Despliegue en Vercel

### 🚀 Un clic para desplegar

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/franSixto/taskQuest&env=DATABASE_URL&envDescription=URL%20de%20conexi%C3%B3n%20a%20PostgreSQL&envLink=https://neon.tech)

### Despliegue manual

1. **Sube tu código a GitHub** (ya lo hiciste ✅)

2. **Importa en Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa el repositorio `franSixto/taskQuest`
   
3. **Configura variables de entorno:**
   - `DATABASE_URL` - Tu URL de PostgreSQL (Neon/Supabase)
   
4. **¡Deploy!** 🎉

### Usando Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Preview deploy
vercel

# Producción
vercel --prod
```

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| 🚀 **Desarrollo** | `npm run dev` | Servidor de desarrollo con hot-reload |
| 🏗️ **Build** | `npm run build` | Compila para producción |
| ▶️ **Start** | `npm run start` | Inicia servidor de producción |
| 🔍 **Lint** | `npm run lint` | Ejecuta ESLint |
| 📤 **DB Push** | `npm run db:push` | Sincroniza esquema con BD |
| 📦 **DB Migrate** | `npm run db:migrate` | Crea nueva migración |
| 🔬 **DB Studio** | `npm run db:studio` | Abre Prisma Studio (GUI) |
| 🌱 **DB Seed** | `npm run db:seed` | Carga datos iniciales |

## 🎨 Personalización del Tema

Edita `tailwind.config.ts` para personalizar la paleta de colores cyberpunk:

```typescript
colors: {
  // Colores principales
  primary: '#00F0FF',    // 💎 Cyan neón - acciones principales
  secondary: '#FF00FF',  // 🔮 Magenta - acentos secundarios
  accent: '#FFD700',     // ⭐ Oro - recompensas y XP
  
  // Fondos
  background: '#0A0E27', // 🌑 Fondo oscuro principal
  surface: '#141B3D',    // 📦 Tarjetas y superficies
  
  // Estados
  success: '#00FF88',    // ✅ Completado
  warning: '#FFB800',    // ⚠️ Advertencia
  danger: '#FF3366',     // ❌ Error / HP bajo
}
```

### Niveles de Dificultad

| Dificultad | Color | XP Base |
|------------|-------|---------|
| Trivial | Gris | 10 XP |
| Fácil | Verde | 25 XP |
| Normal | Azul | 50 XP |
| Difícil | Morado | 100 XP |
| Épica | Naranja | 200 XP |
| Legendaria | Dorado | 500 XP |

## 📊 Modelo de Datos

```mermaid
erDiagram
    CHARACTER ||--o{ QUEST : has
    CHARACTER ||--o{ ATTRIBUTE : develops
    CHARACTER ||--o{ ACHIEVEMENT : unlocks
    CHARACTER ||--o{ INVENTORY : owns
    CHARACTER ||--o{ DAILY_PROGRESS : tracks
    
    QUEST ||--o{ TASK : contains
    QUEST ||--o| BOSS : may_have
    
    CHARACTER {
        string id PK
        string name
        string title
        int level
        int currentXP
        int gold
        int gems
        int currentStreak
    }
    
    QUEST {
        string id PK
        string title
        string type
        string difficulty
        string status
        int xpReward
        int goldReward
    }
    
    TASK {
        string id PK
        string title
        boolean isCompleted
        int xpReward
    }
```

### Relaciones simplificadas

```
👤 Character (1) ───── (N) ⚔️ Quest (1) ───── (N) 📋 Task
      │                        │
      ├── 📊 Attributes        ├── 👹 Boss (opcional)
      ├── 🏆 Achievements      └── 💰 Rewards
      ├── 🎒 Inventory
      └── 📅 DailyProgress
```

## 🗺️ Roadmap

- [x] Sistema de misiones y tareas
- [x] Progresión de personaje (XP/Niveles)
- [x] Sistema de atributos
- [x] Tienda de recompensas
- [x] Dashboard de estadísticas
- [ ] 🔐 Autenticación de usuarios
- [ ] 📱 PWA / App móvil
- [ ] 🌍 Modo multijugador (guilds)
- [ ] 🎵 Efectos de sonido
- [ ] 📈 Gráficos de progreso avanzados
- [ ] 🔔 Notificaciones push

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 🎉

1. **Fork** el proyecto
2. **Crea** tu rama de feature
   ```bash
   git checkout -b feature/NuevaCaracteristica
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'feat: agregar nueva característica increíble'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/NuevaCaracteristica
   ```
5. **Abre** un Pull Request

### Guía de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bugs
- `docs:` Documentación
- `style:` Estilos (no afecta lógica)
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Tareas de mantenimiento

## 📝 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 💖 Agradecimientos

- 🎮 Inspirado en juegos RPG como Habitica, WoW y Final Fantasy
- 🎨 Diseño inspirado en estética Cyberpunk 2077
- 🛠️ Construido con las mejores herramientas del ecosistema React

---

<div align="center">

### ⭐ ¿Te gusta TaskQuest?

**¡Dale una estrella al repositorio!** Nos ayuda a seguir mejorando.

[![GitHub stars](https://img.shields.io/github/stars/franSixto/taskQuest?style=social)](https://github.com/franSixto/taskQuest/stargazers)

<br/>

**Hecho con 💜 por [Francisco Sixto](https://github.com/franSixto)**

*Para diseñadores UX/UI y desarrolladores Frontend que quieren gamificar su productividad*

<br/>

[🐛 Reportar Bug](https://github.com/franSixto/taskQuest/issues) · [✨ Solicitar Feature](https://github.com/franSixto/taskQuest/issues)

</div>
