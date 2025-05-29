"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Servicio, HistorialCambio } from "@/lib/types"
import { useState } from "react"
import { formatDate } from "@/lib/utils"

interface HistorialCambiosProps {
  servicios: Servicio[]
}

export function HistorialCambios({ servicios }: HistorialCambiosProps) {
  const [filtroServicio, setFiltroServicio] = useState<string>("todos")
  const [filtroUsuario, setFiltroUsuario] = useState<string>("")

  // Extraer todos los cambios de todos los servicios
  const todosLosCambios: (HistorialCambio & { servicio: string })[] = servicios.flatMap((servicio) =>
    (servicio.historial || []).map((cambio) => ({
      ...cambio,
      servicio: servicio.nombre,
    })),
  )

  // Ordenar por fecha, más reciente primero
  const cambiosOrdenados = [...todosLosCambios].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )

  // Aplicar filtros
  const cambiosFiltrados = cambiosOrdenados.filter((cambio) => {
    const pasaFiltroServicio = filtroServicio === "todos" || cambio.servicio === filtroServicio
    const pasaFiltroUsuario = !filtroUsuario || cambio.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())
    return pasaFiltroServicio && pasaFiltroUsuario
  })

  // Extraer usuarios únicos para el filtro
  const usuarios = Array.from(new Set(todosLosCambios.map((cambio) => cambio.usuario)))

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "compra":
        return "bg-green-500/20 text-green-500"
      case "venta":
        return "bg-blue-500/20 text-blue-500"
      case "restauración":
        return "bg-yellow-500/20 text-yellow-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cambios y Auditoría</CardTitle>
          <CardDescription>Registro de todas las modificaciones realizadas en los márgenes de precios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por Servicio</label>
                <Select value={filtroServicio} onValueChange={setFiltroServicio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los servicios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los servicios</SelectItem>
                    {servicios.map((servicio) => (
                      <SelectItem key={servicio.id} value={servicio.nombre}>
                        {servicio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por Usuario</label>
                <Input
                  placeholder="Buscar por usuario"
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor Anterior</TableHead>
                  <TableHead>Valor Nuevo</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cambiosFiltrados.length > 0 ? (
                  cambiosFiltrados.map((cambio) => (
                    <TableRow key={cambio.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(new Date(cambio.fecha))}</TableCell>
                      <TableCell>{cambio.usuario}</TableCell>
                      <TableCell>{cambio.servicio}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTipoBadgeColor(cambio.tipo)}>
                          {cambio.tipo.charAt(0).toUpperCase() + cambio.tipo.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{cambio.valorAnterior}%</TableCell>
                      <TableCell>{cambio.valorNuevo}%</TableCell>
                      <TableCell className="max-w-[200px] truncate">{cambio.observaciones || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No se encontraron registros que coincidan con los filtros
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
