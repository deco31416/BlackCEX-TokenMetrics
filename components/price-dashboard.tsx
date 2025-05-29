"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumenGeneral } from "@/components/resumen-general"
import { ConfiguradorMargenes } from "@/components/configurador-margenes"
import { IndicadoresPerformance } from "@/components/indicadores-performance"
import { HistorialCambios } from "@/components/historial-cambios"
import { ThemeProvider } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { serviciosData } from "@/lib/data"

export default function PriceDashboard() {
  const { toast } = useToast()
  const [servicios, setServicios] = useState(serviciosData)

  const actualizarMargen = (id: string, tipo: "compra" | "venta", valor: number) => {
    setServicios(
      servicios.map((servicio) => {
        if (servicio.id === id) {
          const nuevoServicio = { ...servicio }
          if (tipo === "compra") {
            nuevoServicio.margenCompra = valor
            nuevoServicio.precioCompra = calcularPrecioConMargen(nuevoServicio.precioBase, valor)
          } else {
            nuevoServicio.margenVenta = valor
            nuevoServicio.precioVenta = calcularPrecioConMargen(nuevoServicio.precioBase, valor)
          }

          // Calcular estado según diferencia con precio promedio
          const diferenciaCompra = calcularDiferenciaPorcentual(
            nuevoServicio.precioCompra,
            nuevoServicio.precioPromedio,
          )
          const diferenciaVenta = calcularDiferenciaPorcentual(nuevoServicio.precioVenta, nuevoServicio.precioPromedio)

          nuevoServicio.estadoCompra = obtenerEstadoMargen(diferenciaCompra)
          nuevoServicio.estadoVenta = obtenerEstadoMargen(diferenciaVenta)

          // Registrar cambio en historial
          const cambio = {
            id: Date.now().toString(),
            usuario: "operador_actual",
            servicio: nuevoServicio.nombre,
            fecha: new Date(),
            tipo: tipo,
            valorAnterior: tipo === "compra" ? servicio.margenCompra : servicio.margenVenta,
            valorNuevo: valor,
            observaciones: "",
          }

          nuevoServicio.historial = [...(servicio.historial || []), cambio]

          toast({
            title: "Margen actualizado",
            description: `${nuevoServicio.nombre}: Margen de ${tipo} actualizado a ${valor}%`,
          })

          return nuevoServicio
        }
        return servicio
      }),
    )
  }

  const calcularPrecioConMargen = (precioBase: number, margen: number) => {
    return precioBase * (1 + margen / 100)
  }

  const calcularDiferenciaPorcentual = (precio: number, precioPromedio: number) => {
    return ((precio - precioPromedio) / precioPromedio) * 100
  }

  const obtenerEstadoMargen = (diferencia: number) => {
    const diferenciaAbs = Math.abs(diferencia)
    if (diferenciaAbs <= 10) return "success"
    if (diferenciaAbs <= 18) return "warning"
    return "danger"
  }

  const restaurarValoresPorDefecto = (id: string) => {
    setServicios(
      servicios.map((servicio) => {
        if (servicio.id === id) {
          const servicioOriginal = serviciosData.find((s) => s.id === id)
          if (servicioOriginal) {
            toast({
              title: "Valores restaurados",
              description: `${servicio.nombre}: Valores restaurados a configuración por defecto`,
            })
            return {
              ...servicioOriginal,
              historial: [
                ...(servicio.historial || []),
                {
                  id: Date.now().toString(),
                  usuario: "operador_actual",
                  servicio: servicio.nombre,
                  fecha: new Date(),
                  tipo: "restauración",
                  valorAnterior: `C:${servicio.margenCompra}% V:${servicio.margenVenta}%`,
                  valorNuevo: `C:${servicioOriginal.margenCompra}% V:${servicioOriginal.margenVenta}%`,
                  observaciones: "Restauración a valores por defecto",
                },
              ],
            }
          }
        }
        return servicio
      }),
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="blackcex-theme-preference">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 2v20M2 12h20M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
              </svg>
              <span className="hidden font-bold sm:inline-block">BlackCEX TokenMetrics</span>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <span className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Panel de Control de Precios</h1>
            </div>
            <Tabs defaultValue="resumen" className="space-y-4">
              <TabsList>
                <TabsTrigger value="resumen">Resumen General</TabsTrigger>
                <TabsTrigger value="configurador">Configurador de Márgenes</TabsTrigger>
                <TabsTrigger value="indicadores">Indicadores de Performance</TabsTrigger>
                <TabsTrigger value="historial">Historial de Cambios</TabsTrigger>
              </TabsList>
              <TabsContent value="resumen" className="space-y-4">
                <ResumenGeneral
                  servicios={servicios}
                  actualizarMargen={actualizarMargen}
                  restaurarValoresPorDefecto={restaurarValoresPorDefecto}
                />
              </TabsContent>
              <TabsContent value="configurador" className="space-y-4">
                <ConfiguradorMargenes
                  servicios={servicios}
                  actualizarMargen={actualizarMargen}
                  restaurarValoresPorDefecto={restaurarValoresPorDefecto}
                />
              </TabsContent>
              <TabsContent value="indicadores" className="space-y-4">
                <IndicadoresPerformance servicios={servicios} />
              </TabsContent>
              <TabsContent value="historial" className="space-y-4">
                <HistorialCambios servicios={servicios} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
