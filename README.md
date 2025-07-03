![deco31416](https://github.com/deco31416/deco31416/blob/main/public/31416-white.svg)

# BlackCEX TokenMetrics

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/deco31416/BlackCEX-TokenMetrics/pulls)
[![Issues](https://img.shields.io/github/issues/deco31416/BlackCEX-TokenMetrics)](https://github.com/deco31416/BlackCEX-TokenMetrics/issues)
[![Stars](https://img.shields.io/github/stars/deco31416/BlackCEX-TokenMetrics)](https://github.com/deco31416/BlackCEX-TokenMetrics/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/deco31416/BlackCEX-TokenMetrics)](https://github.com/deco31416/BlackCEX-TokenMetrics/commits/main)

**BlackCEX TokenMetrics** is an advanced price governance and performance management platform for BlackCEX. It provides a powerful centralized dashboard to monitor and configure prices, margins, performance indicators, and audit trails across multiple services, including:

- P2P Market  
- Spot Market  
- Fiat Exchange  
- Wallet  
- Launchpad  
- Market Maker  
- Staking  
- Swap  
- Payments  
- Business Plugins  
- Referrals  
- Cashback

## ✨ Features

- Centralized **Price Control Panel**  
- Customizable buy/sell margins per service  
- Real-time 24h trading volumes and price tracking  
- Margin and spread simulation tools  
- Service-wide margin overview table  
- Revenue estimates and margin performance  
- Historical change tracking with user and timestamp  
- Clean, modern dark-mode–friendly UI  
- Fully modular architecture for future growth

## 📦 Tech Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Radix UI** / ShadCN
- **Recharts** (visual performance charts)
- **Zod** + **React Hook Form** (validation and forms)
- **Sonner** (toast notifications)
- **Embla Carousel** (sliders)
- **Vaul** (bottom sheets / modals)
- **PNPM** for dependency management

## 🚀 Getting Started

> **Requirements**  
> Node.js >= 18  
> pnpm >= 8

1. Install pnpm globally if you do not have it:  

```bash
npm install -g pnpm
```

2. Clone the repository:  

```bash
git clone https://github.com/deco31416/BlackCEX-TokenMetrics.git
cd BlackCEX-TokenMetrics
```

3. Install dependencies:  

```bash
pnpm install
```

4. Start the development server:  

```bash
pnpm dev
```

By default, the app will be running on [http://localhost:3000](http://localhost:3000).

## ⚙️ Project Structure

```
/app
  - main pages and routes
/components
  - reusable React components
/web3
  - smart contract connection hooks
/hooks
  - custom React hooks
/lib
  - shared libraries and utilities
/public
  - static assets (images, icons)
/styles
  - Tailwind base styles and overrides
```

## 🛠️ Environment Variables

Create a `.env.local` file in the project root and define your environment variables, for example:  

```env
NEXT_PUBLIC_API_URL=https://yourapi.example.com
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0xD6CCb894Eb0164a99d72F815BCb3e9f5CaC47675
```

These values are automatically loaded with Next.js.

## 📊 Performance & Auditing

- Price control with preview of simulated margins  
- Base prices vs. market average tracking  
- Revenue estimates based on configured spreads  
- Historical audit log by user, date, and service  
- Volume analysis by service over selected periods

## 📝 Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `pnpm dev`      | Start development server         |
| `pnpm build`    | Build for production             |
| `pnpm start`    | Start production server          |
| `pnpm lint`     | Lint and fix code style issues   |

## 👨‍💻 Contributing

Contributions, suggestions, and PRs are always welcome! To contribute:  

1. Fork this repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m 'feat: add new feature'`)  
4. Push to your branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

Please make sure your code follows the existing style and is properly tested.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**BlackCEX TokenMetrics**  
_Made with ❤️ by [deco31416](https://github.com/deco31416)_

📬 **Contact:**
- **Email:** [contacto@deco31416.com](mailto:contacto@deco31416.com)
- **Website:** [https://www.deco31416.com/](https://www.deco31416.com/)

[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white)](https://www.facebook.com/deco31416)
[![Medium](https://img.shields.io/badge/Medium-%2312100E.svg?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@deco31416)
[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://x.com/deco31416)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=Discord&logoColor=white)](https://discord.com/invite/4vwQFmd2)
---
