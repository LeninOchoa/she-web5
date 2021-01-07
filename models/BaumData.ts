export default interface BaumData {
  BaumId: number
  Belegebenen: [number, string][]
  Bezeichnung: string
  Ebenen: [number, string]
  EbenenReihenfolge: number[]
  Recht: any
  UrBaum: boolean
}
