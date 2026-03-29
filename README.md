# 🍽️ RÚSTICA — Sistema de Reservas

Rústica es un restaurant especial, no solo ofrece platos de calidad gourmet, sino toda una experiencia.
Cada uno de nuestros productos incluye un menú temático especialmente diseñado para la ocasión; vajilla y mobiliario,
iluminación y musicalización, específicamente seleccionadas para realzar la experiencia y estimular al máximo los sentidos.

---

## 🎨 Paleta de colores

![Paleta de colores](./frontend/public/paleta.png)

---

## 🏷️ Logo de la marca

<img src="./frontend/public/logo.png" alt="Logo Rústica" width="300">

---

## ⚙️ Tecnologías

### 🖥️ Frontend

| Tecnología | Versión |
|---|---|
| Vite | 7.1.7 |
| React | 19.1.1 |
| React Router DOM | 7.9.6 |
| Axios | 1.13.2 |
| Bootstrap Icons | 1.13.1 |
| React Datepicker | 9.1.0 |
| React Slick + Slick Carousel | 0.31.0 / 1.8.1 |
| React WhatsApp Widget | 2.2.0 |

### ☕ Backend

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.5.6 |
| Spring Web | — |
| Spring Data JPA | — |
| Spring Security | — |
| Spring Validation | — |
| Spring Mail | — |
| H2 Database | runtime |
| JJWT | 0.11.5 |
| Lombok | — |

---

## 🚀 Instalación local

### 🧩 Requisitos previos

- Node.js 18+
- Java 17+

### 📦 Cloná el repositorio
```bash
git clone https://github.com/Federico-Pedro/DPPF-Federico-Pedro.git
cd DPPF-Federico-Pedro
```

### 📁 Backend (`/backend`)
```bash
cd backend
```



#### Archivo `.application.properties`:
//COPIAR EL ARCHIVO application.properties.example Y RENOMBRARLO COMO application.properties CONFIGURANDO LAS VARIABLES INDICADAS EN ÉL

| Variable        | Descripción                                      |
|-----------------|--------------------------------------------------|
| MAIL_USERNAME   | Email desde el que se envían las notificaciones  |
| MAIL_PASSWORD   | Contraseña de aplicación del email               |
| JWT_SECRET      | Clave secreta para firmar los tokens JWT         |
```

#### Correr el backend:
```bash
./mvnw spring-boot:run
```

> El backend estará disponible en `http://localhost:8080`

---

### 🖼️ Frontend (`/frontend`)
```bash
cd frontend
npm install
```

#### Correr el frontend:
```bash
npm run dev
```

#### Archivo `.env`:
Creá un archivo `.env` en la carpeta `/frontend` con el siguiente contenido:

| Variable        | Descripción                        |
|-----------------|------------------------------------|
| VITE_API_URL    | URL base del backend               |

#### Valor por defecto:
```dotenv
VITE_API_URL=http://localhost:8080
```

> La aplicación estará disponible en `http://localhost:5173`

---

## 📬 Endpoints (API REST)

| Método | Endpoint                                       | Descripción                                   | Auth         |
|--------|------------------------------------------------|-----------------------------------------------|--------------|
| POST   | /api/users                                     | Registro de usuario                           | ❌           |
| POST   | /api/users/login                               | Login y generación de JWT                     | ❌           |
| POST   | /api/users/resend-confirmation                 | Reenvío de email de confirmación              | ❌           |
| GET    | /api/products                                  | Listado de productos                          | ❌           |
| GET    | /api/products/{id}                             | Detalle de producto                           | ❌           |
| POST   | /api/products                                  | Crear producto                                | ✅ (ADMIN)   |
| PUT    | /api/products/{id}                             | Editar producto                               | ✅ (ADMIN)   |
| DELETE | /api/products/{id}                             | Eliminar producto                             | ✅ (ADMIN)   |
| GET    | /api/categories                                | Listado de categorías                         | ❌           |
| POST   | /api/categories                                | Crear categoría                               | ✅           |
| GET    | /api/characteristics                           | Listado de características                    | ❌           |
| GET    | /api/reservations                              | Listado de reservas                           | ❌           |
| GET    | /api/reservations/{id}                         | Detalle de reserva                            | ❌           |
| GET    | /api/reservations/user/{userId}                | Reservas de un usuario                        | ✅           |
| GET    | /api/reservations/product/{productId}          | Fechas reservadas de un producto              | ❌           |
| POST   | /api/reservations                              | Crear reserva                                 | ✅           |
| POST   | /api/favorites                                 | Agregar favorito                              | ✅           |
| GET    | /api/favorites/user/{userId}                   | Favoritos de un usuario                       | ✅           |
| DELETE | /api/favorites/product/{productId}             | Eliminar favorito                             | ✅           |
| GET    | /api/reviews                                   | Listado de reviews                            | ❌           |
| GET    | /api/reviews/product/{productId}               | Reviews de un producto                        | ❌           |
| GET    | /api/reviews/product/{productId}/stats         | Estadísticas de un producto                   | ❌           |
| GET    | /api/reviews/stats/all                         | Estadísticas de todos los productos           | ❌           |
| GET    | /api/reviews/product/{productId}/user/{userId} | Review de un usuario para un producto         | ❌           |
| POST   | /api/reviews/product/{productId}               | Crear review                                  | ✅           |
| DELETE | /api/reviews/{id}                              | Eliminar review                               | ✅           |

---

## 🗂️ Diagrama de entidades (ER)

<img src="./frontend/public/Rustica.png" alt="Diagrama de entidades" width="300">

---

## ☁️ Deploy

🚧 En construcción — el deploy está pendiente para una próxima etapa del proyecto.

---

## 📋 Gestión del proyecto

🔗 [Tablero Trello](https://trello.com/b/mNOHFcSS/desafio-profesional-professional-developer)

---

## 👤 Autor

- [@FedericoPedro](https://github.com/Federico-Pedro)

---

## 📞 Soporte

¿Encontraste un bug o tenés una sugerencia?

- 🐛 [Reportar un bug](#)
- 💡 [Solicitar una feature](#)
- 📧 Email: federicopedroroveda@gmail.com