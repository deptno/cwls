import {OutputLogEvent} from 'aws-sdk/clients/cloudwatchlogs'
import chalk from 'chalk'
import {format} from 'date-fns'
import {compose} from 'ramda'
import {identity} from 'rxjs'

const FORMAT_TIME = 'YYYY/MM/DD HH:mm:ss'
const datetime = compose(
  chalk.bgCyan,
  (timestamp) => format(timestamp, FORMAT_TIME))
const colors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
]
const groups = {}
const namedColor = name => {
  if (groups[name]) {
    return groups[name](name)
  }
  groups[name] = chalk[colors.shift()!] || identity

  return namedColor(name.split('/').pop())
}
const groupMessage = (event: OriginOutputLogEvent) => {
  const versionIncluded = event.logStreamName
    .split('/')
    .pop()!
  const version = versionIncluded.substr(0, versionIncluded.indexOf(']') + 1)
  return [
    datetime(event.timestamp),
    namedColor(version),
    namedColor(event.logGroupName),
    event.message!
      .trim()
      .split('\t')
      .pop()
  ].join(' ')
}

export const printEvent = (event: OriginOutputLogEvent) => {
  console.log(groupMessage(event))
}

type OriginOutputLogEvent = OutputLogEvent & {
  logGroupName: string
  logStreamName: string
}
