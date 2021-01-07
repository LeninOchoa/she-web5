import { SearchParameterBaum } from '@/models/SearchParameter'
import SynNodeData from '@/models/SynNodeData'
import { $axios } from '@/utils/axios'
import SynNode from '@/models/SynNode'

export async function searchRootNodes(
  params: SearchParameterBaum,
  token: string
): Promise<SynNode[] | null> {
  if (token === null) return null

  const apiUrl =
    process.env.baseUrl + '/api/DocumentViewer/Search/' + params.treeId

  return await $axios({
    method: 'post',
    url: apiUrl,
    data: params.SearchParameter,
    headers: {
      authorization: `Bearer  ${token}`,
      'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    },
  })
    .then((result) => {
      const nodes: SynNode[] = []

      for (const data in result.data) {
        console.log('ViewerService/searchRootNodes', result.data[data])
        const temp: SynNode = {
          ico: 'pat',
          name: result.data[data].Text,
          children: [],
          data: result.data[data] as SynNodeData,
          id: result.data[data].PKID[0],
          files: [],
          imageUrls: [],
          parent: null,
          Information: null,
        }
        nodes.push(temp)
      }

      return nodes
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}
