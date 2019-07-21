import {loadConfig} from '../lib/config'
import path from 'path'
import t from 'tap'

const config = loadConfig(path.resolve(path.join(process.env.PWD!, 'test', 'cwls.config.js')))

t.true(config, 'load config')
t.true(config.name)
t.true(config.profile)

