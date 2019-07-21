import AWS, {CloudWatch, CloudWatchLogs, SharedIniFileCredentials} from 'aws-sdk'
import {CxConfig} from '../config'

export const instance = {} as CxInstance
export const credentials = (config: CxConfig): void => {
  const {name, profile = 'default', region} = config

  const credentials = new SharedIniFileCredentials({profile})
  AWS.config.credentials = credentials

  instance.cwlog = new CloudWatchLogs({region})
}

export type CxInstance = {
  cwlog: CloudWatchLogs
}
