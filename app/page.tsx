import type { Metadata } from "next"
import PriceDashboard from "@/components/price-dashboard"

export const metadata: Metadata = {
  title: "BlackCEX - Panel de Control de Precios",
  description: "Panel de administración para configuración de márgenes de precios en servicios de BlackCEX",
}

export default function Home() {
  return <PriceDashboard />
}
