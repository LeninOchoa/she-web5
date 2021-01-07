export default interface SynNodeData {
  AblagePfad: string | null
  AkteID: number
  AktenEbene: boolean
  BelegEbene: boolean
  BelegTyp: string | null
  BelegTypID: 0
  Childs: []
  EbeneID: number
  EbeneTyp: number
  ElektronischerStatus: number | null
  ElektronischerStatusID: number
  Files: []
  IsDummy: boolean
  KnotenEbene: number
  OcrEbene: boolean
  PKID: string[]
  PKSpalte: null
  PapieraktenStatus: null
  PapieraktenStatusID: number
  PdfAkteDruckenEbene: boolean
  RechtEbeneID: number
  RechtSpalte: null
  SammelakteID: number
  Sternstruktur: boolean
  Text: string
  TitelA: string | null
  TitelB: string | null
  sPKID: string | null
}
