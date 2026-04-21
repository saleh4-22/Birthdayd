# Rain's 21st Birthday Web Experience 🎂

A mobile-first, interactive, and visually stunning web application designed specifically to celebrate Rain's 21st birthday. The app features premium UI design, smooth micro-interactions, an interactive canvas cake-cutting experience, and celebratory mechanics.

## ✨ Features
- **Touch-Interactive Cake Slicing**: Users swipe across the screen to dynamically cut a realistically rendered birthday cake. Includes an integrated glowing particle slice trail.
- **Dynamic Lottie/GSAP Animations**: Fluid transition animations bridging the landing screen smoothly into the birthday presentation.
- **Interactive Floating Balloons**: Automatically spawning balloons that can be physically tapped/clicked to pop into an explosion of confetti.
- **Custom Soundtrack Integration**: Configurable background music (`.m4a` integration) toggled seamlessly by a glassmorphism button orb, alongside dynamic localized sound effects upon cake destruction.
- **Premium Aesthetics**: Engineered using modern HTML5, optimized CSS3 variables, deep dimensional background gradients, and high-fidelity mix-blend imagery.

## 🚀 Tech Stack
- Vanilla **HTML, CSS, JavaScript**
- **GSAP (GreenSock)** for sophisticated sequential rendering and fluid entry tweens.
- **Howler.js** for robust cross-browser audio control.
- **Canvas-Confetti** for lightweight celebration particles.

## 🛠 Usage
Since this is a client-side vanilla JavaScript app, there are no complex build steps!

1. Clone or download the repository to your local machine.
2. Spin up a local development server in the root of the directory to prevent CORS issues with local asset loading. Using VS Code Live Server or Node's `serve`:
   ```bash
   npx serve .
   ```
3. Open up your `localhost` via a Chrome or Safari Browser. 
4. *Tip*: Test it via Developer Tools Mobile Viewport (Portrait mode) for the intended layout experience. 

## 📁 File Structure
- `index.html` — The main presentation structure
- `css/style.css` — Core responsive styling and animations
- `js/app.js` — All interactive logic and hardware-accelerated animations 
- `assets/` — Directory holding generated art and local sound files
