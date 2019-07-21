export const config = {} as CxConfig
export const loadConfig = (path: string): CxConfig => {
  try {
    for (const [key, value] of Object.entries(require(path))) {
      config[key] = value
    }
  } catch (e) {
    console.error(e)
  }
  return config
}


export type CxConfig = {
  name: string
  region: string
  logs: string[]
  profile?: string
  polling?: {
    stream?: number
    event?: number
  }
}
