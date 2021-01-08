import {
  LoadedChildren,
  SearchChildren,
  SearchParameterBaum,
  SearchImageBinary,
  LoadedImages,
} from '@/models/SearchParameter'
import SynNodeData from '@/models/SynNodeData'
import { $axios } from '@/utils/axios'
import SynNode from '@/models/SynNode'
import { SynNodeInfo } from '~/models/SysNodeInfo'

export async function searchRootNodes(
  params: SearchParameterBaum,
  token: string
): Promise<SynNode[]> {
  if (token === null) return []

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

      const keys = Object.keys(result.data)
      for (const index in keys) {
        const temp: SynNode = {
          ico: 'pat',
          name: result.data[index].Text,
          children: [],
          data: result.data[index] as SynNodeData,
          id: result.data[index].PKID[0],
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

export async function loadChildren(
  parameter: SearchChildren,
  token: string
): Promise<LoadedChildren> {
  if (token === null) return { nodes: [], images: { files: [], images: [] } }

  const apiUrl =
    process.env.baseUrl + '/api/DocumentViewer/LoadChildren/' + parameter.treeId
  const items = {
    ParentNode: parameter.ParentNode,
    Sfs: parameter.Sfs,
  }
  return await $axios({
    method: 'post',
    url: apiUrl,
    data: items,
    headers: {
      authorization: `Bearer  ${token}`,
      'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    },
  })
    .then(async (result) => {
      const rest = result.data.map((x: { ElektronischerStatusID: number }) => {
        if (x.ElektronischerStatusID === 2) {
          return { ...x, ico: 'auf' }
        } else if (x.ElektronischerStatusID === 4) {
          return { ...x, ico: 'rest' }
        } else if (x.ElektronischerStatusID === 1) {
          return { ...x, ico: 'rest' }
        } else if (x.ElektronischerStatusID === 100) {
          return { ...x, ico: 'allg' }
        } else {
          return { ...x, ico: 'rest' }
        }
      })
      let files: string[] = []
      const nodes: SynNode[] = []
      const keys = Object.keys(rest)
      for (const index in keys) {
        if (rest[index].Files !== null) {
          files = [...new Set([...files, ...rest[index].Files])]
          continue
        }

        const temp: SynNode = {
          ico: rest[index].ico,
          name: rest[index].Text,
          children: [],
          data: rest[index],
          id: rest[index].PKID[0],
          files: [],
          imageUrls: [],
          parent: parameter.ParentNode.parent,
          Information: null,
        }
        nodes.push(temp)
      }

      const images: string[] = []
      if (files.length > 0) {
        for (const file in files) {
          const par: SearchImageBinary = {
            serverpath: files[file],
            size: 0,
          }

          await getImageBinary(par, token)
            .then((result: any) => {
              const imageUrl: string = URL.createObjectURL(result)
              images.push(imageUrl)
            })
            // eslint-disable-next-line no-console
            .catch((e: any) => console.log('error', e))
        }
      }

      const img: LoadedImages = { files, images }
      const re: LoadedChildren = {
        nodes,
        images: img,
      }

      return re
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

export async function getImageBinary(
  parameter: SearchImageBinary,
  token: string
): Promise<any> {
  if (token === null) return

  const apiUrl =
    process.env.baseUrl +
    `/api/DocumentViewer/LoadImageBinary?id=${btoa(
      parameter.serverpath
    )}&size=${parameter.size}`

  return await window.$nuxt
    .$axios({
      responseType: 'blob',
      method: 'get',
      url: apiUrl,
      headers: {
        authorization: `Bearer  ${token}`,
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      },
    })
    .then((result) => {
      return result.data
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

export async function GetInformation(
  EbeneIds: number[],
  Pkids: Array<number[]>,
  token: string
): Promise<SynNodeInfo[]> {
  if (token === null) return []

  const apiUrl = process.env.baseUrl + '/api/DocumentViewer/GetInformation/'

  return await $axios({
    method: 'post',
    url: apiUrl,
    data: { EbeneIds, Pkids },
    headers: {
      authorization: `Bearer  ${token}`,
      'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    },
  })
    .then((result) => {
      const keys = Object.keys(result.data)
      const response: SynNodeInfo[] = []
      for (const index in keys) {
        const info = result.data[index]

        response.push(info as SynNodeInfo)
      }

      return response
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}
