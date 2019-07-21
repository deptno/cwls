import {credentials} from '../lib/aws/credential'
import t from 'tap'
import {createGetLogEvents$, getLogStreamHead$} from '../lib/aws/cloudwatch'
import {CxConfig} from '../lib/config'
import {switchMap} from 'rxjs/operators'
import {printEvent} from '../lib/format/printEvent'
import {merge} from 'rxjs'

const config: CxConfig = {
  name   : 'name',
  profile: 'profile',
  region : 'ap-northeast-2',
  polling: {
    stream: 15000,
    event : 3000,
  },
  logs   : [
    '/aws/lambda/1',
    '/aws/lambda/2',
  ]
}
credentials(config)

const {logs} = config

merge(
  ...logs.map(logGroupName =>
    getLogStreamHead$(config, logGroupName).pipe(
      switchMap(createGetLogEvents$(config, logGroupName)),
    )
  )
).subscribe(printEvent)

