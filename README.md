# Mingki Office

A single-page personal workspace web app built with plain HTML, CSS and JavaScript — no server,
no build step. It can be hosted on any static host as-is.

An isometric 3D-miniature office map holds five rooms (command room · golf studio · blog &
clip room · design & goods room · travel lounge). Tapping a room or a character opens that
part's status sheet.

## Files

```
index.html            layout (header · 5 tabs · part detail sheets)
style.css             design (cream + deep navy, 3D miniature office, responsive)
app.js                tab switching · map pins / character bubbles · motion toggle · memo storage
manifest.json         PWA settings for "Add to Home Screen" — app name, icons, theme color
robots.txt            search engine opt-out (Disallow: /)
assets/
  office-map.png      office map (1254×1254)
  office-map.webp     lighter version of the same image (used first)
  icon-180.png        iPhone home screen icon
  icon-192.png / icon-512.png / icon-1024.png
  icon-maskable-512.png
```

> `index.html` carries `<meta name="robots" content="noindex, nofollow">`, and `robots.txt`
> disallows crawling, so the page does not appear in search results.

## Tabs

| Tab | Contents |
|---|---|
| Office | 3D miniature map · 5 room pins (tap for details) · character bubbles · `Motion ON/OFF` toggle · 5 status rows |
| Meeting room | today's 3 agenda items + per-part reports |
| Workroom | 7 project cards (published / draft / in review / waiting on a decision), including a 4-character emoticon sample tracker · travel D-day counter |
| Status | counts + channel shortcuts |
| Memo | quick memo + today's checklist, saved in browser `localStorage` |

## Running locally

Open `index.html` in a browser. To view it on a phone, host the folder on a static host.

## Deploy (GitHub Pages)

1. Push the files to a repository.
2. Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`.
3. The site is served a minute or two later.

> In Safari, open the URL, then Share → Add to Home Screen to get a full-screen app-like window.

## Notes on data

- Memos and checklists stay in that browser only (nothing is uploaded). Clearing site data or
  switching devices loses them.
- Safari private browsing may not persist them.

## Design tokens

| Name | Value | Used for |
|---|---|---|
| cream | `#F7F3EC` | background |
| paper | `#FFFEFB` | cards |
| navy | `#2B3440` | toggle on / emphasis pills / pin labels |
| green | `#2FA96B` | live / done |
| sky | `#9FD3EC` / `#4E8CA9` | characters · in progress |
| pink | `#F3BCCB` / `#B4657C` | everyday · blog |
| amber | `#C98A4B` | waiting · review |

Fonts: the device's system Korean font (Pretendard → Apple SD Gothic Neo → Malgun Gothic).
