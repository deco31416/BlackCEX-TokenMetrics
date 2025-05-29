"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Servicio } from "@/lib/types"
import { useState } from "react"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface IndicadoresPerformanceProps {
  servicios: Servicio[]
}

export function IndicadoresPerformance({ servicios }: IndicadoresPerformanceProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("24h")

  const periodos = [
    { value: "1h", label: "1 hora" },
    { value: "6h", label: "6 horas" },
    { value: "8h", label: "8 horas" },
    { value: "12h", label: "12 horas" },
    { value: "24h", label: "24 horas" },
  ]

  const calcularRevenueEstimado = (servicio: Servicio) => {
    const spreadAbsoluto = servicio.precioVenta - servicio.precioCompra
    const spreadPorcentual = (spreadAbsoluto / servicio.precioBase) * 100
    return (servicio.volumen24h * spreadPorcentual) / 100
  }

  const calcularEstadoFinanciero = (servicio: Servicio) => {
    const revenue = calcularRevenueEstimado(servicio)
    return revenue > 0 ? "success" : "danger"
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

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "success":
        return "Generando ingresos"
      case "danger":
        return "Pérdida potencial"
      default:
        return "Neutral"
    }
  }

  // Datos para gráficos
  const datosVolumen = servicios.map((servicio) => ({
    name: servicio.nombre,
    volumen: servicio.volumen24h,
    margen: (servicio.margenCompra + servicio.margenVenta) / 2,
    revenue: calcularRevenueEstimado(servicio),
    fill: servicio.color || "#8884d8",
  }))

  const datosMargenVolumen = servicios.map((servicio) => ({
    name: servicio.nombre,
    margen: (servicio.margenCompra + servicio.margenVenta) / 2,
    volumen: servicio.volumen24h / 1000, // Escalar para visualización
    revenue: calcularRevenueEstimado(servicio) / 1000, // Escalar para visualización
    fill: servicio.color || "#8884d8",
  }))

  // Datos históricos simulados para el gráfico de línea
  const generarDatosHistoricos = () => {
    const periodos = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]
    return periodos.map((periodo) => {
      const datos: any = { name: periodo }
      servicios.forEach((servicio) => {
        // Simular datos con variación aleatoria
        const variacion = 0.8 + Math.random() * 0.4 // Entre 0.8 y 1.2
        datos[servicio.id] = Math.round((servicio.volumen24h * variacion) / 6)
      })
      return datos
    })
  }

  const datosHistoricos = generarDatosHistoricos()

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Indicadores de Performance</h2>
        <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent>
            {periodos.map((periodo) => (
              <SelectItem key={periodo.value} value={periodo.value}>
                {periodo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servicios.slice(0, 4).map((servicio) => {
          const revenue = calcularRevenueEstimado(servicio)
          const estado = calcularEstadoFinanciero(servicio)

          return (
            <Card key={servicio.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{servicio.nombre}</CardTitle>
                <CardDescription>
                  Volumen {periodoSeleccionado}: {formatCurrency(servicio.volumen24h)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue estimado:</span>
                    <span className="font-medium">{formatCurrency(revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Margen promedio:</span>
                    <span className="font-medium">
                      {((servicio.margenCompra + servicio.margenVenta) / 2).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge variant="outline" className={getEstadoColor(estado)}>
                      {getEstadoLabel(estado)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="volumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volumen">Volumen por Servicio</TabsTrigger>
          <TabsTrigger value="margen">Margen vs Volumen</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Volumen</TabsTrigger>
        </TabsList>
        <TabsContent value="volumen">
          <Card>
            <CardHeader>
              <CardTitle>Volumen Operado por Servicio</CardTitle>
              <CardDescription>
                Comparativa de volumen operado en el periodo seleccionado ({periodoSeleccionado})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    volumen: {
                      label: "Volumen",
                      color: "hsl(var(--chart-1))",
                    },
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosVolumen} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="volumen" name="Volumen" fill="hsl(var(--chart-1))" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="margen">
          <Card>
            <CardHeader>
              <CardTitle>Relación Margen vs Volumen</CardTitle>
              <CardDescription>Análisis de la relación entre margen aplicado y volumen generado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    margen: {
                      label: "Margen (%)",
                      color: "hsl(var(--chart-3))",
                    },
                    volumen: {
                      label: "Volumen (K)",
                      color: "hsl(var(--chart-4))",
                    },
                    revenue: {
                      label: "Revenue (K)",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosMargenVolumen} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-3))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-4))" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="margen" name="Margen (%)" fill="hsl(var(--chart-3))" />
                      <Bar yAxisId="right" dataKey="volumen" name="Volumen (K)" fill="hsl(var(--chart-4))" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue (K)" fill="hsl(var(--chart-5))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Volumen (24h)</CardTitle>
              <CardDescription>Evolución del volumen operado en las últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosHistoricos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      {servicios.map((servicio, index) => (
                        <Line
                          key={servicio.id}
                          type="monotone"
                          dataKey={servicio.id}
                          name={servicio.nombre}
                          stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
