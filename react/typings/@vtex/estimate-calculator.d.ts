declare module '@vtex/estimate-calculator' {
  interface SLA {
    id: string
    shippingEstimate: string
  }

  function getFastestSla(slas: SLA[]): SLA | undefined
}
