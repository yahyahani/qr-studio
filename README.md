# 🔳 QR Generator

مولّد QR Codes متقدم — يدعم روابط، نصوص، واي فاي، أرقام تليفونات، إيميلات، وبطاقات تعارف (vCard)، مع إمكانية تخصيص الشكل والألوان وتحميل الكود بصيغة PNG أو SVG، **و حفظ سجل بكل الأكواد اللي عملتها (Dashboard)**.

## المميزات

- 6 أنواع محتوى: رابط، نص، واي فاي، تليفون، إيميل، بطاقة تعارف
- تخصيص لون النقاط، لون الخلفية، وشكل النقاط (مربع / دائري / حواف ناعمة / كلاسيك)
- معاينة فورية (Live Preview)
- تحميل بصيغة PNG و SVG
- **Dashboard/Geschiedenis**: كل الأكواد اللي حفظتها متخزنة في قاعدة بيانات، تقدر تشوفها وتمسحها لاحقاً
- واجهة عربية (RTL) بالكامل
- جاهز للتشغيل على Docker

## التقنيات المستخدمة

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- [Prisma](https://www.prisma.io/) + [SQLite](https://www.sqlite.org/) (database)
- [Docker](https://www.docker.com/) + Docker Compose

---

## Optie A: Draaien met Docker (aanbevolen)

Dit is de makkelijkste manier — je hebt alleen Docker nodig, geen Node.js installatie.

### Vereisten
- [Docker](https://www.docker.com/products/docker-desktop/) en Docker Compose (zit al in Docker Desktop)

### Starten

```bash
cd qr-generator
docker compose up --build
```

Open daarna: **http://localhost:3000**

Dat is alles. Bij de eerste start:
- Wordt de Docker image gebouwd (duurt een paar minuten)
- Wordt automatisch de database aangemaakt (SQLite) in een Docker volume
- De data in dat volume **blijft bewaard** ook als je de container stopt of herstart

### Stoppen

```bash
docker compose down
```

(Je QR-geschiedenis blijft bewaard — het volume wordt niet verwijderd door `down`.)

### Stoppen én alle data verwijderen

```bash
docker compose down -v
```

### Container draait al, alleen herstarten

```bash
docker compose restart
```

### Logs bekijken

```bash
docker compose logs -f
```

### Belangrijk: build hier niet end-to-end getest

Ik heb dit Dockerfile en docker-compose.yml met zorg en volgens de officiële Next.js + Prisma best practices opgebouwd, en de code zelf gecontroleerd op fouten. Door een netwerkbeperking in mijn eigen werkomgeving kon ik de `docker compose up --build` hier niet zelf laten draaien (Prisma's downloadserver was niet bereikbaar). **Test het dus even bij jou, en als er een foutmelding opduikt, plak die in de chat — dan lossen we het samen op.**

---

## Optie B: Lokaal draaien zonder Docker (met Node.js)

### Vereisten
- Node.js 18 of hoger ([download hier](https://nodejs.org/))

### Stappen

```bash
# 1. Naar de projectmap
cd qr-generator

# 2. Env-bestand aanmaken (voor lokale SQLite database)
cp .env.example .env

# 3. Dependencies installeren
npm install

# 4. Database aanmaken/synchroniseren
npx prisma db push

# 5. Dev-server starten
npm run dev
```

Open: **http://localhost:3000**

### Andere nuttige commando's

```bash
npm run build          # production build maken
npm run start           # production build draaien
npx prisma studio       # grafische database-viewer in de browser
```

---

## 2. Project naar GitHub pushen

### a. Git instellen (eenmalig)

```bash
git config --global user.name "jouw naam"
git config --global user.email "jouw@email.com"
```

### b. Repository initialiseren

```bash
cd qr-generator
git init
git add .
git commit -m "Initial commit: QR Generator met Docker en geschiedenis"
git branch -M main
```

### c. Repository aanmaken op GitHub

1. Ga naar [github.com/new](https://github.com/new)
2. Geef een naam (bv. `qr-generator`)
3. **Niet** "Add a README file" aanvinken (we hebben er al een)
4. Klik **Create repository**
5. Kopieer de URL die getoond wordt, bv. `https://github.com/USERNAME/qr-generator.git`

### d. Pushen

```bash
git remote add origin https://github.com/USERNAME/qr-generator.git
git push -u origin main
```

### Latere wijzigingen pushen

```bash
git add .
git commit -m "omschrijving van de wijziging"
git push
```

---

## Hoe werkt de database/geschiedenis?

- Elke keer als je op **"Opslaan in geschiedenis"** klikt bij een QR code, wordt die opgeslagen in een SQLite-database (een gewoon bestand, geen losse databaseserver nodig)
- Op de pagina `/history` (knop "Geschiedenis" rechtsboven) zie je een overzicht van alles wat je hebt opgeslagen
- Je kunt items daar verwijderen
- **Met Docker:** de database staat in een Docker volume (`qr-data`), dus blijft bewaard na een herstart van de container
- **Zonder Docker:** de database staat in `prisma/dev.db` op je eigen schijf

---

## Projectstructuur

```
qr-generator/
├── app/
│   ├── layout.js              # de hoofd-layout
│   ├── page.js                 # hoofdpagina (QR generator)
│   ├── globals.css             # algemene stijlen + Tailwind
│   ├── history/
│   │   └── page.js             # Dashboard: geschiedenis van opgeslagen QR codes
│   └── api/
│       └── qrcodes/
│           ├── route.js        # GET (lijst) + POST (opslaan)
│           └── [id]/route.js   # DELETE (verwijderen)
├── components/
│   ├── ContentTypeSelector.js  # knoppen om type content te kiezen
│   ├── DynamicFields.js        # invoervelden die per type veranderen
│   ├── QrPreview.js            # interactieve preview + opslaan/downloaden
│   └── QrThumbnail.js          # kleine read-only QR voor de geschiedenislijst
├── lib/
│   ├── qrFormatters.js         # omzetten van invoer naar correcte QR-data
│   └── prisma.js               # Prisma client (database-verbinding)
├── prisma/
│   └── schema.prisma           # database-structuur (tabel QrCode)
├── Dockerfile                  # multi-stage build voor productie-image
├── docker-compose.yml          # start de app + database-volume
├── docker-entrypoint.sh        # synchroniseert database bij opstarten
├── .env.example                # voorbeeld env-variabelen
├── package.json
├── tailwind.config.js
└── next.config.js
```

## Ideeën om later uit te breiden

- [ ] Logo toevoegen in het midden van de QR code
- [ ] Zoeken/filteren in de geschiedenis (op type of datum)
- [ ] QR voor Bitcoin/crypto-adressen
- [ ] Dark/Light mode toggle
- [ ] Authenticatie, als je de app met meerdere mensen wilt delen

