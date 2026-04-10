<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f6df14f3-8ac9-4867-bd83-40111f6809ec

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Android APK erstellen (Capacitor)

Voraussetzungen: Node.js + npm, Android Studio (mit Android SDK) und JDK installiert.

Kurzanleitung (Windows):

1. Abhängigkeiten installieren:

```powershell
npm install
```

2. Web-Build erstellen:

```powershell
npm run build
```

3. Capacitor (einmalig) installieren und Android-Projekt erzeugen:

```powershell
npm install @capacitor/core @capacitor/cli --save
npx cap init "WAVEIQ" com.waveiq.app   # nur beim ersten Mal nötig
npx cap add android
npx cap copy
npx cap open android
```

4. In Android Studio: Build → Generate Signed Bundle / APK → Release (oder per Gradle):

```powershell
cd android
.\gradlew.bat assembleDebug
.\gradlew.bat assembleRelease
```

Hinweis: Für einen signierten Release-Build müssen Sie ein Keystore erstellen und die Signierung in den Android-Gradle-Einstellungen konfigurieren.

Wenn Sie möchten, kann ich die Schritte automatisiert in Ihrem Repo vorbereiten (Scripts, config). Führen Sie zuerst `npm install` lokal aus.
