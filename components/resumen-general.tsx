"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, ArrowDown, ArrowUp, Info, RefreshCw } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Servicio } from "@/lib/types"

interface ResumenGeneralProps {
  servicios: Servicio[]
  actualizarMargen: (id: string, tipo: "compra" | "venta", valor: number) => void
  restaurarValoresPorDefecto: (id: string) => void
}

export function ResumenGeneral({ servicios, actualizarMargen, restaurarValoresPorDefecto }: ResumenGeneralProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "success":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "danger":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  const getEstadoIcon = (estado: string) => {
    if (estado === "danger") {
      return <AlertTriangle className="h-4 w-4 mr-1" />
    }
    return null
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "success":
        return "Óptimo"
      case "warning":
        return "Atención"
      case "danger":
        return "Alerta"
      default:
        return "Normal"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servicios.map((servicio) => (
        <Card key={servicio.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Precio base: {formatCurrency(servicio.precioBase)}</p>
                    <p>Precio promedio mercado: {formatCurrency(servicio.precioPromedio)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Volumen 24h: {formatCurrency(servicio.volumen24h)}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm font-medium">Compra</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{formatCurrency(servicio.precioCompra)}</span>
                    <Badge variant="outline" className={getEstadoColor(servicio.estadoCompra)}>
                      {getEstadoIcon(servicio.estadoCompra)}
                      {getEstadoLabel(servicio.estadoCompra)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-16">{servicio.margenCompra}%</span>
                  <Slider
                    defaultValue={[servicio.margenCompra]}
                    max={30}
                    min={-10}
                    step={0.5}
                    onValueChange={(value) => actualizarMargen(servicio.id, "compra", value[0])}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-sm font-medium">Venta</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{formatCurrency(servicio.precioVenta)}</span>
                    <Badge variant="outline" className={getEstadoColor(servicio.estadoVenta)}>
                      {getEstadoIcon(servicio.estadoVenta)}
                      {getEstadoLabel(servicio.estadoVenta)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-16">{servicio.margenVenta}%</span>
                  <Slider
                    defaultValue={[servicio.margenVenta]}
                    max={30}
                    min={-10}
                    step={0.5}
                    onValueChange={(value) => actualizarMargen(servicio.id, "venta", value[0])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => restaurarValoresPorDefecto(servicio.id)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Restaurar valores por defecto
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
