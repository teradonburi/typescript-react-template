/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import { Request, Response, NextFunction } from 'express'
import express from 'express'
import bodyParser from 'body-parser'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import reducer from '../client/reducer/reducer'
import { model, route } from 'interface'

const app = express()

import {default as mongoose} from 'mongoose'
mongoose.connect('mongodb://localhost/typescript-react-template', { useNewUrlParser: true, useUnifiedTopology: true})
import { User } from './models'

// APIエラーハンドリング
const wrap = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<Response | undefined>) => (req: Request, res: Response, next?: NextFunction): Promise<Response | undefined> => fn(req, res, next).catch((err: Error) => {
  console.error(err)
  if (!res.headersSent) {
    return res.status(500).json({message: 'Internal Server Error'})
  }
})
// NodeJSエラーハンドリング
process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const webpackConfig = require('../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')
  /* eslint-enable @typescript-eslint/no-var-requires */

  // サーバ起動時、src変更時にwebpackビルドを行う
  const compiler = webpack(webpackConfig)

  // バックエンド用webpack-dev-middleware
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      // 書き込むファイルの判定
      writeToDisk(filePath: string) {
        return /loadable-stats/.test(filePath)
      },
    }),
  )
  // HMR
  app.use(webpackHotMiddleware(compiler))
}

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

import { users } from './routes'

app.use(
  '/api/users',
  express.Router()
    .get('/', wrap(users.index))
    .post('/', wrap(users.create))
)

// Redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// StaticRouter
import { StaticRouter } from 'react-router-dom'
import { Router } from '../client/Router'
// Material-UI SSR
import { ServerStyleSheets, MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../client/theme'
// Helmet
import { HelmetProvider } from 'react-helmet-async'
import { HelmetData } from 'react-helmet'


const nodeStats = path.resolve(
  __dirname,
  '../dist/loadable-stats.json',
)

app.get(
  '*',
  async (req: Request, res: Response) => {

    // 疑似ユーザ作成（本来はDBからデータを取得して埋め込む)
    let initialData: ({user?: {users: route.User[]}} | {}) = {}
    if (req.url === '/') {
      const users: model.User[] = await User.find().lean({virtuals: true})
      initialData = {user: {users: users.map(u => ({
        gender: u.gender,
        name: {
          first: u.first,
          last: u.last,
        },
        email: u.email,
        picture: {
          thumbnail: u.thumbnail,
        },
      }))}}
    }

    // Redux Storeの作成(initialDataには各Componentが参照するRedux Storeのstateを代入する)
    const store = createStore(reducer, initialData)

    const context = {}

    // ChunkExtractorでビルド済みのチャンク情報を取得
    const extractor = new ChunkExtractor({ statsFile: nodeStats })

    // CSS(MUI)
    const sheets = new ServerStyleSheets()

    const helmetContext: {helmet?: HelmetData} = {}

    const App: React.SFC = () => (
      sheets.collect(
        <HelmetProvider context={helmetContext}>
          <MuiThemeProvider theme={theme}>
            <Provider store={store}>
              <StaticRouter location={req.url} context={context}>
                <Router />
              </StaticRouter>
            </Provider>
          </MuiThemeProvider>
        </HelmetProvider>
      )
    )

    // loadable-stats.jsonからフロントエンドモジュールを取得する
    const jsx = extractor.collectChunks(<App />)

    // SSR
    const html = renderToString(jsx)

    // Material-UIのCSSを作成
    const MUIStyles = sheets.toString()

    // Helmetで埋め込んだ情報を取得し、そのページのheaderに追加する
    const { helmet } = helmetContext

    res.set('content-type', 'text/html')
    res.send(`<!DOCTYPE html>
<html lang='ja'>
<head>
<meta charset='utf-8' />
<meta name='viewport' content='width=device-width, initial-scale=1' />
${extractor.getLinkTags()}
${extractor.getStyleTags()}
${helmet ? helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString() : ''}
<style id='jss-server-side'>${MUIStyles}</style>
</head>
<body>
  <div id="root">${html}</div>
  <script id="initial-data">window.__STATE__=${JSON.stringify(initialData)}</script>
  <!-- CSR -->
  ${extractor.getScriptTags()}
</body>
</html>`)
  },
)

// サーバを起動
app.listen(8080, () => console.log('Server started http://localhost:8080'))
