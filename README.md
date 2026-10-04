# Klienti – Raynet (úkol na pohovor)

Webová aplikace, která zobrazuje klienty evidované v [Raynet CRM](https://raynet.cz) jako **master-detail**: vlevo seznam klientů, vpravo detail vybraného klienta. Záznamy lze vyhledávat přes fulltext. Vzhled co nejvíc kopíruje aplikaci Raynet.

## Co aplikace umí

- **Seznam klientů** podle wireframu ze zadání: název, stav, vztah, rating, vlastník, IČ, město a kategorie.
- **Fulltextové vyhledávání** napříč poli (název, město, část slova…).
- **Stránkování** s volbou 10 / 20 / 50 položek na stránce.
- **Detail klienta:**
  - kategorie, stav a vztah, logo, IČ, DIČ, rating,
  - adresa s odkazem na mapu,
  - poznámka (formátovaný text), kontakty, další adresy a vlastník.
- **Vzhled Raynetu:** rozbalovací postranní panel s bublinami, barvy stavů a kategorií z číselníku Raynetu, profilové fotky vlastníků.
- **Ovládání klávesnicí** (Tab + Enter) a responzivní rozložení. Na užších obrazovkách je detail pod tabulkou.

## Spuštění

### Požadavky

- **Node.js 20.19+ nebo 22.12+** (vyžaduje Vite 8)
- Přístup do Raynet CRM a API klíč

### Postup

1. Nainstalujte závislosti:

   ```bash
   npm install
   ```

2. Vytvořte soubor `.env` podle šablony:

   ```bash
   cp .env.example .env
   ```

3. Doplňte do `.env` přihlašovací údaje k Raynetu:

   | Proměnná          | Co do ní patří                                                                                          |
   | ----------------- | ------------------------------------------------------------------------------------------------------- |
   | `RAYNET_USERNAME` | e-mail, kterým se do Raynetu přihlašujete                                                               |
   | `RAYNET_API_KEY`  | API klíč, vygenerujete ho v Raynetu v nastavení svého uživatelského účtu                                |
   | `RAYNET_INSTANCE` | název instance, tedy část adresy za `app.raynet.cz/` (např. `app.raynet.cz/moje-firma/` → `moje-firma`) |

4. Spusťte vývojový server:

   ```bash
   npm run dev
   ```

   Aplikace poběží na `http://localhost:5173`.

> **Pozor:** po 20 neúspěšných přihlášeních Raynet zablokuje IP adresu na 60 minut. Pokud aplikace hlásí neplatné přihlašovací údaje, nejdřív zkontrolujte `.env` a teprve pak zkoušejte znovu.

### Další příkazy

| Příkaz            | Co dělá                                                    |
| ----------------- | ---------------------------------------------------------- |
| `npm run build`   | kontrola typů a produkční build do `dist/`                 |
| `npm run preview` | náhled produkčního buildu (proxy na Raynet funguje i tady) |
| `npm run lint`    | ESLint                                                     |

## Jak funguje napojení na Raynet API

Raynet API vyžaduje v každém požadavku přihlašovací údaje (HTTP Basic Auth + hlavička `X-Instance-Name`). Kdyby je aplikace posílala přímo z prohlížeče, API klíč by skončil ve veřejném JavaScriptu, který si může kdokoliv přečíst.

Proto aplikace volá jen vlastní adresu `/api/...` a **Vite dev server** požadavek přepošle na Raynet a přihlašovací údaje k němu přidá sám:

```
prohlížeč                      Vite dev server (proxy)                 Raynet
fetch('/api/company/')  ──►    + Authorization, X-Instance-Name  ──►  app.raynet.cz/api/v2/company/
```

Údaje z `.env` čte jen server. Proměnné záměrně nemají prefix `VITE_`, takže se do kódu pro prohlížeč nedostanou.

**Omezení:** proxy existuje jen při `npm run dev` a `npm run preview`. Pro nasazení na veřejný server by její roli musel převzít malý backend nebo serverless funkce, ideálně omezená jen na čtení potřebných endpointů.

## Technologie

|                                  | Proč                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **React 19 + TypeScript + Vite** | základ projektu                                                                                                                            |
| **Tailwind CSS 4**               | styly; barvy Raynetu jsou jako tokeny v `src/index.css`                                                                                    |
| **TanStack Query**               | načítání dat: cache, rušení zastaralých požadavků, stavy načítání a chyb. Šetří limity Raynet API (24 000 požadavků/den, max. 4 souběžné). |
| **Radix UI Tooltip**             | bubliny v postranním panelu; stejnou knihovnu používá Raynet                                                                               |
| **DOMPurify**                    | sanitizace HTML poznámek před vložením do stránky (ochrana proti XSS)                                                                      |

## Struktura projektu

```
src/
├── api/              komunikace s Raynet API
│   ├── client.ts       obecný apiGet(): sestavení URL, chyby (ApiError), rušení přes AbortSignal
│   ├── companies.ts    typy a funkce pro klienty
│   ├── codelists.ts    číselník kategorií (název + barva)
│   ├── persons.ts      osoby (profilová fotka vlastníka)
│   └── images.ts       obrázky (logo, fotka)
├── hooks/            načítání dat přes TanStack Query + useDebouncedValue
├── components/
│   ├── CompanyList.tsx     hledání, stránkování, stav seznamu
│   ├── CompanyTable.tsx    tabulka klientů
│   ├── CompanyDetail.tsx   detail klienta
│   ├── Pagination.tsx      patička se stránkováním
│   ├── Tooltip.tsx         bubliny (Radix UI)
│   ├── RichText.tsx        bezpečné zobrazení HTML poznámek
│   └── layout/AppLayout.tsx  postranní panel a lišta se záložkami
├── App.tsx           rozložení master-detail, drží vybraného klienta
└── main.tsx          nastavení TanStack Query
```

## Rozhodnutí, která stojí za zmínku

- **Filtrování** ze zadání („Záznamy lze filtrovat / vyhledávat přes fulltext“) chápu jako fulltextové vyhledávání. Odpovídá tomu i wireframe, který nad tabulkou ukazuje jen vyhledávací pole.
- **Vyhledávání** je debouncované (300 ms) a rozběhnuté požadavky se ruší přes `AbortSignal`. Při psaní tak neodchází zbytečné požadavky a nezobrazí se zastaralý výsledek.
- **Stránka se při novém hledání vrací na první**, a to bez efektu (`useEffect`). Stránka si pamatuje, ke kterému hledání patří, a aktuální stránka se z toho odvozuje. Hledání i stránka tak do API dorazí současně, jedním požadavkem.
- **Tabulka je z `<div>` s ARIA rolemi**, ne z `<table>`. Řádky v Raynetu mají zaoblení a stín, což řádek HTML tabulky neumí. Role `table`, `row` a `cell` zachovávají význam tabulky pro čtečky obrazovky.
- **Barvy kategorií** se berou z číselníku Raynetu. Číselník se načte jednou a převede na mapu „ID → barva“.
- **Poznámky** jsou v Raynetu HTML. Zobrazují se formátované, ale až po sanitizaci přes DOMPurify.
- **Postranní panel a záložky** jsou jen vizuální kopie Raynetu. Funkční je sekce klientů.
