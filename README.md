# The Developer Universe — Adilur Rahman Portfolio

An interactive, cinematic 3D portfolio built with React, TypeScript, Three.js (via React Three Fiber), GSAP ScrollTrigger, and Tailwind CSS. A persistent WebGL scene — featuring the real `avatar.glb` character — evolves as the page scrolls through each chapter of the site, while all professional content lives in accessible, semantic HTML.

## Tech stack

- React 19 + TypeScript + Vite
- Three.js + @react-three/fiber + @react-three/drei
- GSAP + ScrollTrigger (scroll choreography, text reveals)
- Lenis (smooth scroll, with a native-scroll fallback for reduced motion)
- Tailwind CSS v4
- lucide-react (icons)

No paid APIs, no required third-party services, no external model/font CDNs at runtime beyond Google Fonts (self-hostable if you want a fully offline build — see below).

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run typecheck # tsc -b
npm run lint      # eslint .
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Project structure

```text
src/
  components/
    layout/      Navbar, Footer, ScrollProgress
    ui/          Button, SectionHeading, ResumeSelector, LoadingScreen, DevTerminal
    three/       Experience (Canvas root), Avatar, AvatarAnimator, CameraController,
                 SceneLighting, Environment, FloatingObjects, TechnologyOrbit,
                 ProjectShowroom, Particles, PointerTracker, WebGLFallback
    sections/    Hero, About, Skills, WorkExperience, Projects, Services, Education, Contact
    icons/       Hand-authored GitHub/LinkedIn glyphs (lucide-react no longer ships brand icons)
  animations/
    avatarPoses.ts    Procedural pose library (bind-pose-relative bone offsets)
    sceneStates.ts    Per-chapter camera / avatar / lighting keyframes
    scrollTimeline.ts GSAP + Lenis + ScrollTrigger choreography, built once per section's
                       measured scroll position and rebuilt on resize
    orbitLayout.ts    Skills "technology orbit" node positions, shared between the 3D
                       scene and the DOM skill grid's hover-to-look-at wiring
  state/sceneStore.ts  Mutable, non-React store the scroll timeline writes into every
                       frame and R3F components read every frame (no React re-renders
                       from scrolling)
  hooks/               useReducedMotion, useDeviceCapabilities, useWebglSupport,
                       usePointerTracking, useScrollProgress, useScrollReveal
  data/                profile, skills, experience, projects, services, education, sections
                       — edit these to update site content; nothing else needs to change
  types/               Shared content types
public/
  models/avatar.glb
  resumes/*.pdf
  images/, favicon.svg, robots.txt, sitemap.xml
```

## How the 3D choreography works

1. `animations/sceneStates.ts` defines one keyframe per chapter (home, about, skills,
   experience, projects, contact): camera position/target/fov, avatar root
   position/rotation, a single named rest pose, lighting, and environment params.
2. `animations/scrollTimeline.ts` measures each chapter's actual scroll position in the
   DOM, then builds **one GSAP timeline** scrubbed by **one ScrollTrigger** spanning the
   whole document. Each chapter transition is a tween segment on that timeline, so
   scrolling backward is just as smooth as scrolling forward (GSAP timelines are
   fully reversible/scrubbable by construction — nothing here is a one-shot animation).
3. Pose blending chains cleanly: each segment interpolates from the previous chapter's
   rest pose to the next chapter's rest pose over that chapter's scroll range, so there
   is never a discontinuity at a chapter boundary.
4. `AvatarAnimator` reads the current pose blend from the shared store every frame and
   reconstructs every tracked bone's rotation **fresh from its original bind-pose
   quaternion** (captured once at load) — poses and overlays (breathing, idle sway,
   cursor/selection head-tracking, the waving arm oscillation) are all small rotations
   *relative to the bind pose*, so the rig can never drift or distort over time.
5. Lenis provides inertial smooth scrolling; `prefers-reduced-motion` (or the nav's
   manual toggle) disables Lenis and freezes the camera/avatar/lighting at the hero
   state, while scroll-linked DOM text reveals degrade to instant appearance.

## Content editing

All real content lives in `src/data/*.ts`, typed and separated from rendering/animation
code:

- `profile.ts` — name, tagline, summary, about copy, socials, résumé file list
- `skills.ts` — skill categories (also drives the 3D orbit nodes in Skills)
- `experience.ts` — work history (verify the Stackifya end date — see below)
- `projects.ts` — named projects + the Shopify capabilities showcase
- `services.ts`, `education.ts`, `sections.ts`

Update these files to change site content; no component code needs to change for a
normal content edit.

## Known items to review before publishing

- **Stackifya end date**: all three source CVs list "August 2025 – Present" with no end
  date. This is flagged in `src/data/experience.ts` (`needsVerification: true`) — please
  confirm whether this role has ended before the site goes live, and update
  `experience.ts` accordingly. The site does not display any internal "unverified" notice
  publicly; this is a data-accuracy flag for you, not a user-facing warning.
- **Résumé PDFs** in `public/resumes/` contain your phone number and other personal
  contact details (as in the original CVs). Review them before public deployment if you
  want to redact anything beyond what's already shown on the site. The phone number on
  the site itself is hidden behind an explicit "Show phone number" toggle in the Contact
  section, not displayed by default.
- **Mobile viewport**: this build was authored and screenshot-tested at desktop width in
  this environment (the available browser automation here could not resize below desktop
  resolution). All layouts use Tailwind responsive classes (`sm:`/`lg:` breakpoints) and
  the 3D scene adapts object count/shadows/DPR via `useDeviceCapabilities`, but you should
  do a pass on a real phone or with browser dev tools' device toolbar before launch.
- **Clipboard / file-download testing**: "Copy Email Address" and the résumé download
  links use the standard Clipboard API and `<a download>` respectively — both are
  standards-based and will work in a normal browser session. They could not be fully
  exercised end-to-end in this sandboxed test environment (clipboard permission prompts
  and automated downloads are restricted there), so give them one manual click-through
  after deploying.

## Accessibility & fallbacks

- All professional content (bio, skills, experience, projects, services, education,
  contact) exists as real semantic HTML — nothing is locked inside the canvas.
- `prefers-reduced-motion` is respected automatically; there's also a manual toggle in
  the navbar for users who want to turn down motion regardless of OS setting.
- If WebGL is unavailable, or the 3D scene throws, an error boundary swaps in a static
  gradient background (`WebGLFallback`) and the rest of the page functions identically.
- Keyboard: all nav links, the mobile menu (closes on Escape), skill chips, and resume
  links are focusable with visible focus rings; skip-to-content link is the first
  focusable element on the page.

## Deployment

This is a static Vite build — deploy the `dist/` folder anywhere static:

**Vercel**
```bash
npm run build
vercel deploy --prod   # or connect the repo in the Vercel dashboard (framework: Vite)
```

**Netlify**
```
Build command: npm run build
Publish directory: dist
```

**Cloudflare Pages**
```
Build command: npm run build
Build output directory: dist
```

Any static host works — just serve `dist/` with `index.html` as the SPA fallback (not
required here since there's no client-side router, but harmless to set).

Before going live, update `index.html`'s canonical/OG URLs and `public/sitemap.xml` /
`public/robots.txt` if the production domain differs from `butechbd.com`.
