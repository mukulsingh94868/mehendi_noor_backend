# Mehndi Noor API

Express 5 and MongoDB API for the Mehndi Noor website. Public visitors can read
published website content and submit a booking enquiry. Admin endpoints require
a signed bearer token.

## Setup

1. Copy `.env.example` to `.env` and configure MongoDB, website origins and admin
   credentials. Generate a bcrypt password hash with:

   ```powershell
   node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "your-admin-password"
   ```

   Set the output as `ADMIN_PASSWORD_HASH`. Set `ADMIN_JWT_SECRET` to a private,
   random value of at least 32 characters.
2. Run `npm install`, then `npm run dev`.
3. Seed the existing website gallery and services once with `npm run seed:content`.

Uploaded images are stored in `uploads/` and served from `/api/uploads`. This
requires persistent disk storage in production; on ephemeral hosting, replace
the local Multer disk storage with a persistent object-storage provider.

## API

All responses use `{ "success": boolean, "data": ... }`; errors also include a
`message`. Admin routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Health check |
| `POST` | `/api/admin/login` | Public | Exchange admin email/password for an 8-hour JWT |
| `POST` | `/api/contact` | Public | Save a booking enquiry |
| `GET` | `/api/gallery` | Public | List gallery items |
| `GET` | `/api/gallery?category=Bridal` | Public | List one gallery category |
| `GET` | `/api/gallery/categories` | Public | List supported gallery categories |
| `GET` | `/api/services` | Public | List service cards |
| `GET` | `/api/testimonials` | Public | List published testimonials |
| `GET` | `/api/admin/contacts` | Admin | List enquiries, newest first |
| `PUT`, `PATCH`, `DELETE` | `/api/admin/contacts/:id` | Admin | Manage an enquiry |
| `GET`, `POST` | `/api/admin/gallery` | Admin | List all / create gallery items |
| `PUT`, `PATCH`, `DELETE` | `/api/admin/gallery/:id` | Admin | Manage a gallery item |
| `GET`, `POST` | `/api/admin/services` | Admin | List / create services |
| `PUT`, `PATCH`, `DELETE` | `/api/admin/services/:id` | Admin | Manage a service |
| `GET`, `POST` | `/api/admin/testimonials` | Admin | List all / create testimonials |
| `PUT`, `PATCH`, `DELETE` | `/api/admin/testimonials/:id` | Admin | Manage a testimonial |
| `POST` | `/api/admin/uploads` | Admin | Upload one JPEG, PNG, WebP or AVIF image (max 5 MB) |

Gallery items use `id`, `title`, `category`, `src`, `width` and `height`.
Services use `id`, `title`, `description`, `image`, and an icon name from
`/api/admin/service-icons`. Testimonials use `name`, `event`, `quote`, `rating`
(1–5), and `isPublished` (false by default). Contact fields are `name`, `phone`,
`eventType`, `eventDate`, `location` and `message`; admin updates may also change
`status` (`new`, `read`, `contacted`, or `archived`).

After uploading an image, use the returned absolute `url` in a gallery item's
`src` or service's `image`. Set `PUBLIC_API_URL` to the public backend base URL
so image URLs resolve correctly behind a reverse proxy.

The public contact POST only stores the enquiry. The website then opens WhatsApp
with a pre-filled message; it does not send a WhatsApp message automatically.