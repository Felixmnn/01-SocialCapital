# SocialCapital

SocialCapital ist eine React-Native/Expo-App zur Reflexion von Beziehungen im Alltag.
Die App hilft dabei, Beziehungen sichtbar zu machen, Aktionen zu tracken und ein besseres Gleichgewicht zwischen Geben und Nehmen zu entwickeln.

## Hauptfeatures

- Onboarding-Flows fur neue Nutzer (z. B. "About Us" und "Getting Started").
- Personlicher Avatar und Profilbereich.
- Beziehungen anlegen, bearbeiten und verwalten.
- Daily Entry mit Timer-Logik fur "you" und "them" inklusive Aktionsauswahl.
- Punkte- und Balance-Logik fur jede Beziehung.
- Badge-/Ink-Badge-System als Motivation.
- Statistik- und Ubersichts-Komponenten (Streak, Punkte, Verlaufe).
- Mehrsprachigkeit uber i18n (DE, EN, ES, FRA).
- Integration von Rewarded Ads.

## Tech Stack

- Expo + React Native
- TypeScript
- Expo Router (file-based routing)
- NativeWind/Tailwind fur Styling
- i18next/react-i18next fur Lokalisierung
- EAS Build fur Store- und Release-Builds

## Projektstruktur (Kurzuberblick)

- `app/`: Screens und Routing-Struktur
- `components/`: Wiederverwendbare UI-Bausteine
- `context/`: Globaler State (`GlobalProvider`)
- `functions/`: Fachlogik (Scoring, Daily Entry, Stats)
- `constants/`: Theme, Typen, statische Konfiguration
- `assets/`: Bilder, Lokalisierungsdateien und weitere Ressourcen

## Screenshots und App-Aufbau

Die folgende Reihenfolge zeigt den typischen Ablauf in der App und macht den Aufbau der wichtigsten Bereiche sichtbar.

### 1) Onboarding

Der Einstieg erklart den Zweck der App und leitet in die ersten Schritte.

<img src="assets/screenshots/aboutus.jpg" alt="Onboarding - About Us" width="300" />

### 2) Beziehungs-Ubersicht

Hier siehst du alle angelegten Beziehungen auf einen Blick.

<img src="assets/screenshots/friendsOverview.jpg" alt="Friends Overview" width="300" />

### 3) Relationship-Ansicht (pro Person)

Diese Detailansicht zeigt den Status aus deiner Perspektive fur einzelne Beziehungen.

<img src="assets/screenshots/releationshipYouWithFriendX.jpg" alt="Relationship - Friend X" width="240" />
<img src="assets/screenshots/releationshipYouWithFriendY.jpg" alt="Relationship - Friend Y" width="240" />
<img src="assets/screenshots/releationshipYouWithFriendZ.jpg" alt="Relationship - Friend Z" width="240" />

### 4) Beziehungsstarke und Balance

Visualisierung der Beziehungsdynamik und des aktuellen Gleichgewichts.

<img src="assets/screenshots/relationshipStrength.jpg" alt="Relationship Strength" width="300" />

### 5) Entwicklung nach ersten Eintragen

So verandert sich die Ubersicht nach den ersten Daily Entries.

<img src="assets/screenshots/friendsOverviewAfterFirstEntrys.jpg" alt="Friends Overview after first entries" width="300" />

### 6) Avatar- und Profilbearbeitung

Du kannst sowohl den eigenen Avatar als auch den Avatar einer Beziehung anpassen.

<img src="assets/screenshots/editAvatar.jpg" alt="Edit own avatar" width="240" />
<img src="assets/screenshots/editAvarFriend.jpg" alt="Edit friend avatar" width="240" />

### Architektur in einem Satz

Onboarding -> Ubersicht -> Relationship-Details -> Daily Entry/Balance -> Avatar-Anpassung.

## Setup und Entwicklung

### Voraussetzungen

- Node.js (LTS empfohlen)
- npm
- Expo CLI (optional, alternativ uber `npx expo`)
- Android Studio / Xcode (je nach Zielplattform)

### Installation

```bash
npm install
```

### Development-Server starten

```bash
npm run start
```

Optionale Targets:

```bash
npm run android
npm run ios
npm run web
```

## Bundlen und Builds

Es gibt zwei gängige Wege, die App zu bundlen bzw. Release-Artefakte zu bauen.

### 1) EAS Build (empfohlen)

Die Konfiguration liegt in `eas.json` mit den Profilen `development`, `preview` und `production`.

Android APK fur internes Testing:

```bash
eas build --platform android --profile preview
```

Android App Bundle (AAB) fur Play Store:

```bash
eas build --platform android --profile production
```

iOS Release-Build:

```bash
eas build --platform ios --profile production
```

Wichtig:

- Vor dem ersten Build bei Expo anmelden: `eas login`
- Falls benotigt, Umgebungsvariablen in EAS/CI setzen (z. B. `EXPO_PUBLIC_API_URL`)

### 2) Lokales Android Bundling (Gradle)

Da ein `android/`-Ordner vorhanden ist, kannst du auch lokal ein AAB bauen:

```bash
cd android
./gradlew bundleRelease
```

Windows PowerShell:

```powershell
cd android
.\gradlew.bat bundleRelease
```

Das Ergebnis liegt typischerweise unter:

```text
android/app/build/outputs/bundle/release/
```

## Qualitatssicherung

Linting ausfuhren:

```bash
npm run lint
```

## Hinweise

- Routing erfolgt uber Expo Router mit Dateistruktur in `app/`.
- Lokalisierungen liegen unter `assets/images/languages/locales/`.
- App-Verhalten und Scoring sind stark an den globalen Context und die Funktionen in `functions/` gekoppelt.
