# LinkListinator

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?logo=angular)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red)](./LICENSE)

**Plataforma integral de gestión y organización de enlaces web**

[Características](#características) • [Requisitos](#requisitos) • [Instalación](#instalación) • [Uso](#uso) • [Arquitectura](#arquitectura) • [API](#api)

</div>

---

## 📋 Descripción

LinkListinator es una aplicación full-stack moderna para la gestión centralizada de colecciones de enlaces, etiquetas y metadata asociada. Proporciona una solución escalable con backend RESTful API y frontend interactivo basado en Angular, respaldado por PostgreSQL.

### Características Principales

- ✅ **Autenticación JWT** - Sistema seguro de usuario basado en tokens
- ✅ **Gestión de Colecciones** - Organiza enlaces en colecciones temáticas
- ✅ **Sistema de Etiquetas** - Categorización flexible con análisis de popularidad
- ✅ **API RESTful** - Endpoints completamente documentados y versionados
- ✅ **Persistencia de Datos** - PostgreSQL con migrations automáticas (TypeORM)
- ✅ **Interfaz Moderna** - Angular 21 con Material Design
- ✅ **Containerización** - Docker Compose para entorno reproducible
- ✅ **Desarrollo Rápido** - Hot-reload en ambos extremos

---

## 🔧 Requisitos Previos

| Componente | Versión | Descripción |
|-----------|---------|------------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **npm** | 9+ | Gestor de paquetes |
| **Docker** | 20.10+ | Containerización |
| **Docker Compose** | 1.29+ | Orquestación de contenedores |

Verifica tu instalación:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🚀 Instalación Rápida

### Paso 1: Clonar el repositorio
```bash
git clone <repository-url>
cd LinkListinator
```

### Paso 2: Instalar dependencias (primera vez)
```bash
npm run install:all
```

### Paso 3: Iniciar servicios
```bash
docker-compose up -d && npm run dev
```

¡Listo! La aplicación está corriendo en:
- 🌐 **Frontend**: http://localhost:4200
- 🔌 **API**: http://localhost:3000/api/v1
- 🗄️ **PostgreSQL**: localhost:5433

---

## 📦 Estructura del Proyecto

```
LinkListinator/
├── apps/
│   ├── api/                          # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/              # Módulos de negocio
│   │   │   │   ├── auth/             # Autenticación y JWT
│   │   │   │   ├── users/            # Gestión de usuarios
│   │   │   │   ├── collections/      # Colecciones de enlaces
│   │   │   │   ├── links/            # Gestión de enlaces
│   │   │   │   └── tags/             # Sistema de etiquetas
│   │   │   ├── common/               # Guards, filters, interceptors
│   │   │   └── main.ts               # Punto de entrada
│   │   ├── test/                     # Tests E2E
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Frontend Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/             # Servicios, guards, interceptors
│       │   │   ├── features/         # Módulos de características
│       │   │   └── shared/           # Componentes compartidos
│       │   └── main.ts               # Bootstrap
│       ├── angular.json
│       └── tsconfig.json
│
├── docker-compose.yml                # Orquestación de servicios
├── package.json                      # Scripts de root
└── .env                              # Variables de entorno
```

---

## 🎯 Comandos Disponibles

### Desarrollo

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia API + Web simultáneamente (hot-reload) |
| `npm run api:dev` | Solo backend en modo watch |
| `npm run web:dev` | Solo frontend en modo serve |
| `npm run install:all` | Instala dependencias de todos los módulos |

### Base de Datos

| Comando | Descripción |
|---------|------------|
| `npm run db:start` | Inicia PostgreSQL en Docker |
| `npm run db:stop` | Detiene PostgreSQL |
| `docker-compose down -v` | Detiene y elimina volúmenes (limpia BD) |

### Testing (API)

| Comando | Descripción |
|---------|------------|
| `cd apps/api && npm run test` | Tests unitarios |
| `cd apps/api && npm run test:e2e` | Tests end-to-end |
| `cd apps/api && npm run test:cov` | Cobertura de código |

### Build

| Comando | Descripción |
|---------|------------|
| `cd apps/api && npm run build` | Build de production (API) |
| `cd apps/web && npm run build` | Build de production (Web) |

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Angular 21)                   │
│                   http://localhost:4200                     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST + JWT Auth
┌────────────────────┴────────────────────────────────────────┐
│                    BACKEND (NestJS 11)                      │
│                   http://localhost:3000                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Users   │  │  Links   │  │  Tags    │   │
│  │ Module   │  │ Module   │  │ Module   │  │ Module   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                     TypeORM + Repository Pattern            │
└────────────────────┬────────────────────────────────────────┘
                     │ TCP/IP
┌────────────────────┴────────────────────────────────────────┐
│               DATABASE (PostgreSQL 16)                      │
│              linky_db @ localhost:5433                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Users  │  │ Collections│ │  Links   │  │  Tags    │    │
│  └─────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Patrones de Diseño

- **MVC Pattern**: Módulos en capas (Controllers, Services, Repositories)
- **JWT Authentication**: Seguridad basada en tokens
- **Dependency Injection**: NestJS/Angular IoC Container
- **Repository Pattern**: Abstracción de acceso a datos
- **Interceptors & Guards**: Middleware personalizado

---

## 🔌 API REST

### Endpoints Principales

#### Autenticación
```bash
POST   /api/v1/auth/register     # Registrar nuevo usuario
POST   /api/v1/auth/login        # Login (devuelve JWT)
POST   /api/v1/auth/refresh      # Refrescar token
```

#### Usuarios
```bash
GET    /api/v1/users/profile     # Perfil del usuario autenticado
PATCH  /api/v1/users/:id         # Actualizar usuario
```

#### Colecciones
```bash
GET    /api/v1/collections       # Listar colecciones del usuario
POST   /api/v1/collections       # Crear colección
PATCH  /api/v1/collections/:id   # Actualizar colección
DELETE /api/v1/collections/:id   # Eliminar colección
```

#### Enlaces
```bash
GET    /api/v1/links             # Listar enlaces
GET    /api/v1/links/search      # Buscar enlaces
POST   /api/v1/links             # Crear enlace
PATCH  /api/v1/links/:id         # Actualizar enlace
DELETE /api/v1/links/:id         # Eliminar enlace
```

#### Etiquetas
```bash
GET    /api/v1/tags              # Listar etiquetas del usuario
GET    /api/v1/tags/popular      # Top 10 etiquetas más usadas
```

### Autenticación

Todos los endpoints (excepto login/register) requieren un header:
```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## 🗂️ Variables de Entorno

### `.env` (Raíz)
```env
# Base de datos
POSTGRES_USER=linky
POSTGRES_PASSWORD=linky_secret
POSTGRES_DB=linky_db
```

### `apps/api/.env`
```env
# PostgreSQL
POSTGRES_USER=linky
POSTGRES_PASSWORD=linky_secret
POSTGRES_DB=linky_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# JWT
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Server
API_PORT=3000
```

---

## 🐛 Troubleshooting

### Error: "Container name already in use"
```bash
docker-compose down -v
docker-compose up -d
```

### Error: "password authentication failed"
Verifica que las credenciales en `.env` coincidan con `apps/api/.env`:
```bash
# Sincroniza ambos archivos
POSTGRES_USER=linky
POSTGRES_PASSWORD=linky_secret
```

### Puerto ya en uso
```bash
# API (3000)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Web (4200)
lsof -i :4200 | grep LISTEN | awk '{print $2}' | xargs kill -9

# PostgreSQL (5433)
lsof -i :5433 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Limpiar completamente
```bash
# Detener todo
docker-compose down -v

# Eliminar node_modules (si hay problemas de dependencias)
rm -rf node_modules apps/api/node_modules apps/web/node_modules

# Reinstalar
npm run install:all

# Reiniciar
docker-compose up -d && npm run dev
```

---

## 📊 Monitoreo

### Logs de la API
```bash
# Ver logs en real-time
docker-compose logs -f db
```

### Acceso a PostgreSQL
```bash
docker exec -it linky-db psql -U linky -d linky_db
```

### Comandos útiles SQL
```sql
\dt                    -- Listar tablas
SELECT * FROM "user";  -- Ver usuarios
\d "Link"              -- Estructura de tabla Link
```

---

## 🔐 Seguridad

- ✅ **JWT Token-based**: No almacena sesiones
- ✅ **Password Hashing**: bcrypt con salt
- ✅ **CORS Configurado**: Previene ataques cross-origin
- ✅ **Guards & Decorators**: Validación por endpoint
- ✅ **DTOs Validados**: class-validator en entrada
- ⚠️ **TODO en Producción**: 
  - Cambiar `JWT_SECRET` en `.env`
  - Habilitar HTTPS/TLS
  - Rate limiting
  - API key management

---

## 📝 Convenciones de Código

### Nombrado
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **Entities**: `*.entity.ts`
- **DTOs**: `*.dto.ts`
- **Modules**: `*.module.ts`

### Estructura de Módulos
```typescript
// Orden de imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from './entities';
import { Controller } from './controller';
import { Service } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
  exports: [Service],
})
export class YourModule {}
```

---

## 🤝 Contribuir

1. Crea una rama feature: `git checkout -b feature/miFeature`
2. Commit cambios: `git commit -am 'Add feature'`
3. Push a rama: `git push origin feature/miFeature`
4. Abre un Pull Request

---

## 📄 Licencia

UNLICENSED - Uso interno únicamente

---

## 👨‍💻 Stack de Desarrollo

- **TypeScript 5.9** - Tipado estático
- **NestJS 11** - Framework backend enterprise
- **Angular 21** - Framework frontend moderno
- **TypeORM 0.3** - ORM con soporte TypeScript
- **PostgreSQL 16** - Base de datos relacional
- **Docker Compose** - Orquestación de contenedores
- **ESLint + Prettier** - Code quality & formatting
- **Jest + Vitest** - Testing framework

---

<div align="center">

**Desarrollado por** • 2026

Para dudas o soporte, crea un issue en el repositorio.

</div>
