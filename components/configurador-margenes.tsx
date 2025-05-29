"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, RefreshCw, Save } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Servicio } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ConfiguradorMargenesProps {
  servicios: Servicio[]
  actualizarMargen: (id: string, tipo: "compra" | "venta", valor: number) => void
  restaurarValoresPorDefecto: (id: string) => void
}

export function ConfiguradorMargenes({
  servicios,
  actualizarMargen,
  restaurarValoresPorDefecto,
}: ConfiguradorMargenesProps) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>(servicios[0]?.id || "")
  const [margenCompra, setMargenCompra] = useState<number>(servicios[0]?.margenCompra || 0)
  const [margenVenta, setMargenVenta] = useState<number>(servicios[0]?.margenVenta || 0)
  const [observaciones, setObservaciones] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const servicio = servicios.find((s) => s.id === servicioSeleccionado)

  const handleServicioChange = (value: string) => {
    setServicioSeleccionado(value)
    const servicio = servicios.find((s) => s.id === value)
    if (servicio) {
      setMargenCompra(servicio.margenCompra)
      setMargenVenta(servicio.margenVenta)
    }
  }

  const handleGuardarCambios = () => {
    if (servicio) {
      actualizarMargen(servicio.id, "compra", margenCompra)
      actualizarMargen(servicio.id, "venta", margenVenta)
      setDialogOpen(false)
    }
  }

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

  const precioCompraSimulado = servicio ? calcularPrecioConMargen(servicio.precioBase, margenCompra) : 0
  const precioVentaSimulado = servicio ? calcularPrecioConMargen(servicio.precioBase, margenVenta) : 0

  const diferenciaCompra = servicio ? calcularDiferenciaPorcentual(precioCompraSimulado, servicio.precioPromedio) : 0
  const diferenciaVenta = servicio ? calcularDiferenciaPorcentual(precioVentaSimulado, servicio.precioPromedio) : 0

  const estadoCompraSimulado = obtenerEstadoMargen(diferenciaCompra)
  const estadoVentaSimulado = obtenerEstadoMargen(diferenciaVenta)

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurador de Márgenes Personalizados</CardTitle>
          <CardDescription>Configure los márgenes de compra y venta para cada servicio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Seleccionar Servicio</label>
                <Select value={servicioSeleccionado} onValueChange={handleServicioChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicios.map((servicio) => (
                      <SelectItem key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Margen de Compra (%)</label>
                <Input
                  type="number"
                  value={margenCompra}
                  onChange={(e) => setMargenCompra(Number.parseFloat(e.target.value) || 0)}
                  step={0.5}
                  min={-10}
                  max={30}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Margen de Venta (%)</label>
                <Input
                  type="number"
                  value={margenVenta}
                  onChange={(e) => setMargenVenta(Number.parseFloat(e.target.value) || 0)}
                  step={0.5}
                  min={-10}
                  max={30}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex space-x-2 w-full">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar cambios</DialogTitle>
                        <DialogDescription>
                          ¿Está seguro de que desea aplicar estos cambios de margen?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          Servicio: <span className="font-medium text-foreground">{servicio?.nombre}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Margen de compra: <span className="font-medium text-foreground">{margenCompra}%</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Margen de venta: <span className="font-medium text-foreground">{margenVenta}%</span>
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleGuardarCambios}>Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (servicio) {
                        restaurarValoresPorDefecto(servicio.id)
                        const servicioActualizado = servicios.find((s) => s.id === servicio.id)
                        if (servicioActualizado) {
                          setMargenCompra(servicioActualizado.margenCompra)
                          setMargenVenta(servicioActualizado.margenVenta)
                        }
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restaurar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observaciones</label>
              <Textarea
                placeholder="Añadir notas o comentarios sobre los cambios realizados"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>

            {servicio && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vista previa del impacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Precio base</span>
                          <span className="font-medium">{formatCurrency(servicio.precioBase)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Precio promedio mercado</span>
                          <span className="font-medium">{formatCurrency(servicio.precioPromedio)}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Precio compra calculado</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{formatCurrency(precioCompraSimulado)}</span>
                            <Badge variant="outline" className={getEstadoColor(estadoCompraSimulado)}>
                              {getEstadoIcon(estadoCompraSimulado)}
                              {getEstadoLabel(estadoCompraSimulado)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Diferencia con promedio: {diferenciaCompra.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Spread actual</span>
                          <span className="font-medium">
                            {formatCurrency(servicio.precioVenta - servicio.precioCompra)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Spread simulado</span>
                          <span className="font-medium">
                            {formatCurrency(precioVentaSimulado - precioCompraSimulado)}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Precio venta calculado</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{formatCurrency(precioVentaSimulado)}</span>
                            <Badge variant="outline" className={getEstadoColor(estadoVentaSimulado)}>
                              {getEstadoIcon(estadoVentaSimulado)}
                              {getEstadoLabel(estadoVentaSimulado)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Diferencia con promedio: {diferenciaVenta.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabla de Configuración de Servicios</CardTitle>
          <CardDescription>Vista general de todos los servicios y sus márgenes actuales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead>Margen Compra</TableHead>
                <TableHead>Margen Venta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="font-medium">{servicio.nombre}</TableCell>
                  <TableCell>{formatCurrency(servicio.precioBase)}</TableCell>
                  <TableCell>{servicio.margenCompra}%</TableCell>
                  <TableCell>{servicio.margenVenta}%</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className={getEstadoColor(servicio.estadoCompra)}>
                        {getEstadoIcon(servicio.estadoCompra)}C
                      </Badge>
                      <Badge variant="outline" className={getEstadoColor(servicio.estadoVenta)}>
                        {getEstadoIcon(servicio.estadoVenta)}V
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setServicioSeleccionado(servicio.id)
                        setMargenCompra(servicio.margenCompra)
                        setMargenVenta(servicio.margenVenta)
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
