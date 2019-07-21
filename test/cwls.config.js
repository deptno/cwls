module.exports = {
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
