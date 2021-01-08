export interface SynNodeInfo {
  Bezeichnung: string
  EbeneID: number
  InfoEbeneSpalten: SynNodeInfoEbeneSpalten[] | null
  OberEbeneID: number
}

export interface SynNodeInfoEbeneSpalten {
  CdDocDatPos: number
  ColumnValue: string | null
  EbeneSpalteID: number
  Edit: boolean
  Name: string
  SpaltenTypID: number
  UseId: boolean
  ValueMemberValue: number
}

export interface DysplaySynNodeInfo {
  ebene: string
  name: string
  value: string
}
