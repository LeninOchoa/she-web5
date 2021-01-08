import SynNodeData from '@/models/SynNodeData'
import { DysplaySynNodeInfo } from '~/models/SysNodeInfo'

export default interface SynNode {
  ico: string
  name: string
  children: SynNode[] | null
  data: SynNodeData
  id: number
  files: string[] | null
  imageUrls: string[] | null
  parent: SynNode | null
  Information: DysplaySynNodeInfo[] | null
}
