# Neurova

**AI-powered academic companion** — silence distractions, organise tasks, and actually achieve your goals.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## Preview

Neurova is a beautifully designed landing page for an AI-powered student productivity app featuring:

- **LiquidEther WebGL background** -> interactive fluid simulation (ReactBits)
- **Framer Motion animations** -> blur text reveals, tilt cards, scroll effects, click sparks
- **10 app screen showcases** -> onboarding, auth, and confirmation flows
- **Design system section** -> color tokens, typography scale
- **Coming Soon section** -> with notify CTA
- **Fully responsive** dark theme with the Candy Orchid Twist palette

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations
- **Three.js** for LiquidEther WebGL fluid simulation
- **Syne** font (700 Bold & 800 ExtraBold)

## Color Palette

| Token | Hex | Role |
|-------|-----|------|
| Lilac Orchid | `#C8A2C8` | Primary Light |
| Deep Orchid | `#B284BE` | Primary |
| Periwinkle | `#A2ADD0` | Secondary |
| Cream | `#ECEBBD` | Accent Light |
| Peach | `#F8B878` | CTA / Warm |
| Dark Base | `#0D0B14` | Background |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
app/
├── public/
│   └── images/
│       ├── logo.png
│       └── screens/          # 10 app screenshots
├── src/
│   ├── App.jsx               # Main landing page
│   ├── components/
│   │   └── LiquidEther/      # ReactBits WebGL fluid sim
│   ├── index.css             # Tailwind + shadcn variables
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js
```

## License

This project is licensed under the [MIT License](LICENSE).

---

Built by [Rezouali Imane](https://github.com/Rezouali-Imane)
