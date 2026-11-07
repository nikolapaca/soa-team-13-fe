# Turistička aplikacija – frontend (SOA, tim 13)

Klijentski deo turističke aplikacije urađene u okviru predmeta **Servisno orijentisane arhitekture (SOA)**.

Backend (mikroservisi) se nalazi u repozitorijumu [soa-team-13](https://github.com/nikolapaca/soa-team-13).
Frontend komunicira sa backendom isključivo preko API gateway-a (`http://localhost:8070`).

## O projektu

Korisnici mogu da se registruju i prijave, pregledaju i kupuju ture, prate svoje kretanje na mapi, pišu blogove
o putovanjima, lajkuju ih i komentarišu. Aplikacija je podeljena na module po funkcionalnostima (blog, ture,
korpa, profil).

## Tehnologije

- Angular 20, Angular Material
- Leaflet i Leaflet Routing Machine (mapa, rute, računanje rastojanja i vremena)
- JWT autentifikacija (HTTP interceptor)

## Struktura

```
ClientApp/src/app
├── feature-modules
│   ├── blog            – blogovi, komentari, lajkovi
│   ├── tour            – ture i ključne tačke
│   └── shopping-cart   – korpa i kupovina
├── shared              – zajedničke komponente (mapa) i interceptor
├── profile, all-accounts, login, navbar
└── models
```

## Pokretanje

Potreban je pokrenut backend (gateway na portu `8070`).

```
cd ClientApp
npm install
ng serve
```

Aplikacija je dostupna na `http://localhost:4200/`.

## Moj doprinos

### 1. Mapa i simulator pozicije
- Zajednička komponenta `MapComponent` (Leaflet) koja se koristi na više mesta u aplikaciji.
- **Simulator pozicije:** klikom na mapu korisnik postavlja svoju trenutnu poziciju; pozicija se emituje
  roditeljskoj komponenti (`pointSelected`) i čuva u `localStorage`, pa se mapa pri sledećem otvaranju
  centrira na poslednju postavljenu poziciju.
- Prikaz ključnih tačaka i iscrtavanje rute između njih (Leaflet Routing Machine), uz izračunavanje
  rastojanja i vremena (`distanceAndTime`).
- Uklonjen je neiskorišćen server-side rendering kod i pojednostavljen `app.html`.

### 2. Blogovi
- Forma za kreiranje bloga (`add-blog`): naslov i sadržaj (obavezna polja, Reactive Forms) i opciona slika.
  Slika se pretvara u Base64 i šalje zajedno sa nazivom fajla, da bi se mogla preneti kroz gRPC poziv ka
  Blog servisu.
- Prikaz detalja bloga (`blogs-details`): slika, datum objave, broj lajkova, dugme za lajk, forma za ostavljanje
  komentara i lista komentara sa imenom autora.
- Servis `BlogService` i modeli `blog.model.ts`, `comment.model.ts`.

### 3. Autentifikacija zahteva
- `authInterceptor` dodaje JWT token u zaglavlje `Authorization` svakog zahteva ka backendu.
