# The Amar Resort — Mathura

A luxury resort, wedding venue, and banquet hall website for **The Amar Resort**, Mathura. Built as a single-page, fully responsive marketing site with cinematic scroll-driven 3D depth effects, a polished mobile navigation experience, and zero external framework dependencies.

🔗 Live demo: _(https://amarresortmathura.vercel.app/)_

## Features

- Cinematic hero section with parallax background, floating orbs, and pointer-reactive tilt on desktop
- Scroll-driven 3D depth engine — room cards, amenity cards, testimonials, and wedding feature panels lift and tilt smoothly as they enter the viewport
- Smooth-scrolling single-page navigation with an animated scroll-progress bar
- Fully responsive mobile navigation with an animated hamburger-to-X icon and staggered link entrance
- Lightbox photo gallery with keyboard support (Esc to close, Enter/Space to open)
- Enquiry form with inline success state
- Embedded Google Map with a styled location badge
- SEO-ready: Open Graph tags, JSON-LD structured data (`Resort` schema), canonical URL
- Respects `prefers-reduced-motion` for accessibility

## Tech Stack

- HTML5
- CSS3 (custom properties, CSS Grid & Flexbox, `IntersectionObserver`-driven reveal animations, CSS-variable-powered 3D transforms)
- Vanilla JavaScript (no build step, no frameworks, no dependencies)
- Google Fonts: Cormorant Garamond, Cormorant, DM Sans

## Project Structure

```
.
├── index.html      # Page markup, content, and SEO/meta tags
├── styles.css       # All styling, animations, and responsive rules
├── script.js        # Navigation, lightbox, scroll reveal, and 3D depth engine
└── README.md
```

## Getting Started

No build tools or dependencies required.

1. Clone the repo
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```
2. Open `index.html` directly in a browser, **or** serve it locally for the best experience (recommended, since some browsers restrict certain features on `file://` URLs):

   ```bash
   # Python
   python3 -m http.server 5500

   # Node (with the `serve` package)
   npx serve .
   ```

3. Visit `http://127.0.0.1:5500` (or whichever port your server prints).

## Customization

- **Colors & fonts** — defined as CSS custom properties at the top of `styles.css` under `:root`
- **Contact details, address, and social links** — update directly in `index.html` (search for `+91`, `instagram.com`, and the address block)
- **Gallery images** — replace the Unsplash URLs in both `index.html` (inline `onclick` handlers) and the `sources` array in `script.js`
- **Map embed** — replace the Google Maps `iframe` `src` in the Location section with your own embed URL

## Notes on the 3D Depth Engine

The scroll-driven tilt/parallax effects work by writing CSS custom properties (`--lift`, `--rx`, `--ry`, `--scale`, etc.) onto elements via `requestAnimationFrame`, smoothed with linear interpolation for a buttery feel. Each `<section>` defines its own `perspective`, so depth is scoped per-section rather than applied globally on `<body>` — this is intentional, since a global `perspective`/`transform-style: preserve-3d` on `<body>` breaks `position: fixed` for overlays like the mobile menu, lightbox, and floating action buttons.

If you add new elements that need this depth effect, add them to the `depthTargets` array in `script.js` and give them a matching CSS rule consuming `--lift` / `--rx` / `--ry` / `--scale`.

## Browser Support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). Uses `backdrop-filter`, CSS custom properties, and `IntersectionObserver` — all widely supported, with `-webkit-` prefixes included for Safari where needed.

## License

This project is provided as-is for The Amar Resort. Adapt freely for your own use; please don't redistribute the resort's specific branding, copy, or photos without permission.

## Contact

The Amar Resort, Mathura
📍 Managal Bazar, Near Township, Indupuram Colony, Mathura – 281006, UP, India
📞 +91 70426 71269 · +91 98370 52274 · +91 80770 05303
📸 [@theamarresortmathura](https://www.instagram.com/theamarresortmathura)
