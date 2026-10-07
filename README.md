This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


```md
# Pehnam MVP

Pehnam is a private combat-sports coaching marketplace MVP for Halifax.

The current MVP allows customers to browse trainers, create an account, book a private coaching session, pay through Stripe, and view their booking status. An admin can view bookings and update booking statuses.

## Current Features

- Trainer directory
- Individual trainer profile pages
- Discipline filtering
- Random featured trainers on the homepage
- Customer signup
- Customer login/logout
- Booking creation
- Customer booking dashboard
- Stripe Checkout integration
- Stripe webhook payment confirmation
- Automatic payment status updates
- Admin dashboard
- Admin booking status management
- Persistent navigation across pages

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Stripe

## Local Setup

Clone the repository:

```bash
git clone https://github.com/Naved-Fardeen-Khan/pehnam.git
```

Enter the project folder:

```bash
cd pehnam
```

Install dependencies:

```bash
npm install
```

Create a file called:

```text
.env.local
```

Use `.env.example` as a reference.

The required environment variables are:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

SUPABASE_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

ADMIN_EMAIL=
```

Do not commit `.env.local`.

## Run the Development Server

Start Next.js:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Supabase

Supabase is currently used for:

- Trainer data
- User authentication
- Booking data
- Row Level Security
- Admin-side database access

The main database tables are:

```text
trainers
bookings
```

Customer accounts are managed through Supabase Authentication.

## Stripe Testing

Stripe is currently configured in test mode.

Start the Next.js development server:

```bash
npm run dev
```

In a second terminal, start the Stripe webhook listener:

```bash
stripe listen \
  --events checkout.session.completed \
  --forward-to localhost:3000/api/stripe/webhook
```

Stripe CLI will provide a webhook signing secret similar to:

```text
whsec_...
```

Add that value to:

```env
STRIPE_WEBHOOK_SECRET=
```

Then restart the Next.js development server.

For a successful Stripe test payment, use:

```text
Card number:
4242 4242 4242 4242
```

Use any future expiry date and any valid-looking 3-digit CVC.

No real money is charged in Stripe test mode.

## Payment Flow

The current payment flow is:

```text
Customer creates booking
        ↓
Booking stored in Supabase
payment_status = unpaid
        ↓
Customer clicks Pay
        ↓
Next.js creates Stripe Checkout Session
        ↓
Customer completes Stripe Checkout
        ↓
Stripe sends checkout.session.completed webhook
        ↓
Pehnam verifies webhook
        ↓
Supabase booking updated
payment_status = paid
```

## Booking Status

Payment status and booking status are separate.

Example:

```text
payment_status: paid
booking_status: pending
```

Current booking statuses:

```text
pending
confirmed
completed
cancelled
```

The admin can update the booking status from the admin dashboard.

## Admin

The admin account is controlled using:

```env
ADMIN_EMAIL=
```

The admin must log in using the same email address configured in `ADMIN_EMAIL`.

Admin dashboard:

```text
http://localhost:3000/admin
```

The admin can currently:

- View all bookings
- View payment status
- View booking status
- Confirm bookings
- Mark bookings as completed
- Cancel bookings
- View trainers

## Main Routes

```text
/                     Homepage

/trainers             All trainers

/trainers/[slug]      Individual trainer profile

/signup               Customer signup

/login                Customer login

/book/[slug]          Booking form

/bookings             Customer booking dashboard

/admin                Admin dashboard
```

## Environment Variable Security

Never commit:

```text
.env.local
```

The following values are sensitive and must remain private:

```text
SUPABASE_SECRET_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Variables beginning with:

```text
NEXT_PUBLIC_
```

are accessible to the browser and must never contain secret credentials.

## Known Limitations

This is currently an MVP.

Known limitations include:

- Trainers are currently managed by the admin
- Trainers do not have their own accounts
- Trainer payouts are not automated
- Stripe Connect is not implemented
- No trainer messaging system
- No reviews system
- No advanced availability/calendar system
- No automatic refunds
- No production deployment configuration yet
- UI still requires final polish
- Trainer images are currently placeholders
- Admin trainer creation/editing is not yet fully implemented

## Current MVP Flow

The main working flow is:

```text
Customer signs up
        ↓
Customer logs in
        ↓
Customer browses trainers
        ↓
Customer chooses a trainer
        ↓
Customer creates booking
        ↓
Customer pays through Stripe
        ↓
Stripe confirms payment
        ↓
payment_status becomes paid
        ↓
Admin sees booking
        ↓
Admin confirms booking
        ↓
Customer sees confirmed booking
```

## Project Status

The core booking and payment MVP is functional.

The remaining work is mainly:

- UI polish
- Trainer management through admin
- Mobile responsiveness
- Final testing
- Production deployment preparation
