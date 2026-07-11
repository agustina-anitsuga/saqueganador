// Backend Lambda function URLs — ported verbatim from the website environment.ts
export const environment = {
  rankingUrl: 'https://7zy5pgudsjcwhqf64tty3ci5me0nuyfw.lambda-url.us-east-1.on.aws/',
  teamUrl: 'https://mzb7dr2t5jxul64ktntbmr5dau0dsfqn.lambda-url.us-east-1.on.aws/',
  usersUrl: 'https://odjpqrorkgq4tvy2puima2tcra0mpkfb.lambda-url.us-east-1.on.aws/',
  matchesUrl: 'https://fee6tj4mj4pxvjhvox5djlsike0oyxlq.lambda-url.us-east-1.on.aws/',
  playersUrl: 'https://d5r2cwxhlgz4d5ycvt2ezch4fu0nbtbh.lambda-url.us-east-1.on.aws/',
  tournamentUrl: 'https://qfhejpype3xcl3lea3ohsqgyay0yqyxa.lambda-url.us-east-1.on.aws/',
  createTeamsForRoundUrl: 'https://2csqgfheoqffm6jrc6bgf3znsu0whffr.lambda-url.us-east-1.on.aws/',
  moveGameToNextRoundUrl: 'https://z5kjnafwiv3lkqfpbos6efab5a0tudiw.lambda-url.us-east-1.on.aws/',
  raceUrl: 'https://p3zyhxrhycdzi4erbzosaagzgm0gjycq.lambda-url.us-east-1.on.aws/',
  addLuckyLoserUrl: 'https://xejetshz7xakqj65xofgjefmj40yfckd.lambda-url.us-east-1.on.aws/',
};

// AWS Cognito configuration — PRODUCTION pool ("...-main"), the same one the live
// website and the teams/ranking backend use. (The dev pool us-east-1_fb4gWLh0d has
// separate users with no production teams.)
export const cognitoConfig = {
  userPoolId: 'us-east-1_1zv8qzlMB',
  userPoolClientId: 'g8cdtkkv398vqfq69lpsctssb',
  region: 'us-east-1',
};
