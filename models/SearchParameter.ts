import SynNode from '~/models/SynNode'

export interface SearchParameterBaum {
  treeId: number
  SearchParameter: SearchParameter[]
}

export interface SearchParameter {
  EbeneID: number
  EbeneSpalteID: number
  SearchValue: any
}

export interface SearchChildren {
  treeId: number
  ParentNode: Parent
  Sfs: SearchParameterBaum
}

export interface Parent {
  EbeneID: number
  PKID: number[]
  sPKID: string[]
  BelegTypID: number
  parent: SynNode
}

export interface LoadedChildren {
  nodes: SynNode[]
  images: LoadedImages
}

export interface LoadedImages {
  files: string[]
  images: string[]
}

export interface SearchImageBinary {
  serverpath: string
  size: number
}
