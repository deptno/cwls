import {CxConfig} from '../config'
import {instance} from './credential'
import {from, interval} from 'rxjs'
import {distinctUntilChanged, filter, map, mergeAll, mergeMap} from 'rxjs/operators'
import chalk from 'chalk'

export const getLogStreamHead$ = (config: CxConfig, logGroupName: string) => {
  const {polling = {}} = config
  const {stream = 5000} = polling

  return interval(stream).pipe(
    mergeMap(() => from(getHeadLogStream(logGroupName))),
    distinctUntilChanged(),
    map(name => {
      console.log(chalk.bold(`connected latest ${logGroupName}:${name}`))
      return name
    }),
  )
}
export const createGetLogEvents$ = (config: CxConfig, logGroupName: string, nextToken?) =>
  (logStreamName: string) => {
    const {event = 3000} = config.polling || {}
    return interval(event).pipe(
      mergeMap(async () => {
          const response = await instance.cwlog
            .getLogEvents({
              logGroupName,
              logStreamName,
              nextToken,
            })
            .promise()
          nextToken = response.nextForwardToken
          if (response.events) {
            return response.events.map(event => {
              return {
                ...event,
                logGroupName,
                logStreamName,
              }
            })
          }
          return []
        }
      ),
      filter(events => events.length > 0),
      mergeAll()
    )
  }

const getHeadLogStream = async (logGroupName: string) => {
  const response = await instance.cwlog
    .describeLogStreams({
      logGroupName,
      descending: true,
      orderBy   : 'LastEventTime',
      limit     : 1
    })
    .promise()
  if (response.logStreams) {
    const [head] = response.logStreams
    if (head) {
      return head.logStreamName
    }
  }
  return
}

