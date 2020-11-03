declare module '@vtex/estimate-calculator' {
  interface SLA {
    id: string
    shippingEstimate: string
    price: number
  }

  function getFastestSla(slas: SLA[]): SLA | undefined

  function getCheapestSla(slas: SLA[]): SLA | undefined
}
