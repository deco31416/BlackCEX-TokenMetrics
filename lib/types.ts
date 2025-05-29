export interface HistorialCambio {
  id: string
  usuario: string
  servicio: string
  fecha: Date
  tipo: string
  valorAnterior: number | string
  valorNuevo: number | string
  observaciones: string
}

export interface Servicio {
  id: string
  nombre: string
  icono?: string
  color?: string
  precioBase: number
  precioPromedio: number
  precioCompra: number
  precioVenta: number
  margenCompra: number
  margenVenta: number
  volumen24h: number
  volumen1h?: number
  volumen6h?: number
  volumen8h?: number
  volumen12h?: number
  estadoCompra: string
  estadoVenta: string
  historial?: HistorialCambio[]
}
