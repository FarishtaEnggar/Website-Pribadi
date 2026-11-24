# Personal Website

A personal website built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma and SQLite.

Public pages: home, certifications, portfolio, portfolio detail, contact.
Private area: admin login, dashboard, profile editor, CRUD for certifications and projects, message inbox.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
```

Create your environment file from the example:

```bash
copy .env.example .env
```

The example already points to a local SQLite database:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin12345"
```

Replace `AUTH_SECRET` with a long random string.

Create the database, generate the Prisma client and seed demo content:

```bash
npm run db:push
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000

## Admin login

- URL: http://localhost:3000/login
- Email: `admin@example.com`
- Password: `admin12345`

To change the credentials, edit `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, then run:

```bash
npm run db:seed
```

The seed updates the password of the existing admin account. `AUTH_SECRET` should be replaced with a long random string in any non-local environment.

## Content

All content is managed from `/admin`:

- **Profile** — name, title, photo, biography, contact details and social links.
- **Certifications** — featured flag, publish flag, display order, credential link.
- **Portfolio** — cover image, technologies, links, featured/published flags.
- **Messages** — contact form submissions; open a message to mark it as read.

Images (profile photo, project cover, certification logo) can be uploaded directly from your computer or set with a path/URL.

## Light and dark mode

The public site and the admin dashboard each remember their own theme.

- Public default: **dark** (terminal palette).
- Admin default: **light** (editorial palette).
- The login screen follows the admin theme.
- Use the toggle in the public navbar (or mobile menu) and in the admin sidebar.

Preferences are stored in `public_theme` and `admin_theme` cookies for one year, so the correct theme is rendered on the server and there is no flash of the wrong palette. Clearing cookies resets both to their defaults.

## Using your own photo

You can upload photos straight from your laptop in the dashboard — no manual file copying needed.

1. Sign in and open `/admin/profile`.
2. Under **Photo**, click the file picker and choose a JPG, PNG, WebP, GIF or AVIF image (max 6 MB).
3. The image uploads immediately and the preview updates.
4. Click **Save profile**.

Uploaded files are stored in the `uploads/` folder and served from `/media/<filename>`.

The same control is available for project cover images (`/admin/portfolio`) and certification logos (`/admin/certifications`).

You can still paste a path like `/images/profile.jpg` or an external image URL instead of uploading.

### If you prefer to use a file already in the project

Place the image in `public/images/` and set the field to `/images/your-file.jpg`.

## Useful commands

```bash
npm run dev        # development server
npm run build      # production build (runs prisma generate)
npm start          # start the production server
npm run db:push    # sync the Prisma schema with SQLite
npm run db:seed    # seed admin account and demo content
npm run db:studio  # open Prisma Studio
```

## Backups

The whole database is a single file:

```
prisma/dev.db
```

Copy that file to back up all content and messages. Uploaded images live in `uploads/` — copy that folder too.

## Notes

- This build targets local usage. SQLite on serverless platforms such as Vercel does not persist writes; use a hosted database (for example PostgreSQL or Turso) before deploying there.
- Uploaded images are written to the local `uploads/` folder. On serverless hosts that filesystem is ephemeral, so use object storage there.
- Only one admin account is supported. There is no public registration or password reset flow.
