# Utopia Admin

ადმინ პანელი Utopia Vip Travel-ისთვის · Next.js + MongoDB

## გაშვება

```bash
npm install
npm run seed:demo   # ადმინი + ტურები + 28 სატესტო შეკვეთა
npm run dev         # http://localhost:3001
```

`npm run seed` — მხოლოდ ადმინი და ტურები, სატესტო შეკვეთების გარეშე.
სატესტო შეკვეთების ნომრები იწყება `UT-DEMO-`-ით, ასე რომ მერე ადვილად წაიშლება.

## სტრუქტურა

```
src/
  app/
    layout.jsx, globals.css      ფონტები და საერთო სტილი
    login/page.jsx               /login
    (admin)/layout.jsx           მენიუ + ჩარჩო ყველა შიდა გვერდისთვის
    (admin)/dashboard/page.jsx   /dashboard
    (admin)/orders/page.jsx      /orders
    (admin)/tours/page.jsx       /tours
    api/auth/login|logout        შესვლა / გამოსვლა (httpOnly cookie)
    api/orders, api/orders/[id]  შეკვეთები, სტატუსის შეცვლა
    api/tours, api/stats         ტურები, მიმოხილვის ციფრები
  components/<Name>/<Name>.jsx + <Name>.css
  lib/        db, auth, format, constants...
  models/     Admin, Tour, Order (mongoose)
  middleware.js                  ყველა გვერდი დაცულია, გარდა /login-ისა
scripts/seed.js
```

## .env.local

იხილე `.env.example`. `.env.local` git-ში არ იტვირთება.
