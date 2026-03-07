# Android App Links Verification (EduDash Pro)

Use this checklist after deploying the Next.js web app to a real domain.

## 1) Confirm asset links are served
```
curl -I https://YOUR_DOMAIN/.well-known/assetlinks.json
curl https://YOUR_DOMAIN/.well-known/assetlinks.json
```
Expect `200` and JSON containing:
- `package_name`: `com.edudashpro.app`
- `sha256_cert_fingerprints`: release keystore SHA-256(s)

## 2) Verify the intent filter domain
Your Android `app.json` must include:
- `https://YOUR_DOMAIN/invite/*`
- any other deep link paths you want the app to auto-open

## 3) Test a deep link on device (ADB)
```
adb shell am start -a android.intent.action.VIEW -d "https://YOUR_DOMAIN/invite/teacher?token=TEST&email=test@example.com"
```
Expected:
- the EduDash Pro app opens directly
- no browser prompt (after domain verification completes)

## 4) Inspect App Links status (Android 12+)
```
adb shell pm get-app-links com.edudashpro.app
```
Look for your domain with status `verified`.

## 5) Common failures
- `assetlinks.json` missing or cached incorrectly
- SHA-256 fingerprints don’t match the **release** keystore
- domain not listed in the intent filter
- DNS still pointing to old hosting

## 6) If you change keystore or domain
Update `web/public/.well-known/assetlinks.json` and redeploy.
