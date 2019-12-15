import actionCreatorFactory from 'typescript-fsa'
import { AxiosInstance } from 'axios'
import { Store } from 'redux'
import { route } from 'interface'

const actionCreator = actionCreatorFactory()

// typescript-fsaで<params,result,error>の型を定義
export const loadAction = actionCreator.async<{}, {users: route.User[]}, {error: Error}>('user/LOAD')
export const createAction = actionCreator.async<{user: route.User}, {user: route.User}, {error: Error}>('user/CREATE')

// actionの定義
export function load() {
  // clientはaxiosの付与したクライアントパラメータ
  // 非同期処理をPromise形式で記述できる
  return (dispatch: Store['dispatch'], getState: Store['getState'], client: AxiosInstance): Promise<void> => {
    return client
      .get('/api/users')
      .then(res => res.data)
      .then(users => {
        // 成功
        dispatch(loadAction.done({
          params: {},
          result: { users },
        }))
      })
      .catch(error => {
        // 失敗
        dispatch(loadAction.failed({params: {}, error}))
      })
  }
}

export function create(user: route.User) {
  // clientはaxiosの付与したクライアントパラメータ
  // 非同期処理をPromise形式で記述できる
  return (dispatch: Store['dispatch'], getState: Store['getState'], client: AxiosInstance): Promise<void> => {
    return client
      .post('/api/users', user)
      .then(res => res.data)
      .then(user => {
        // 成功
        dispatch(createAction.done({
          params: { user },
          result: { user },
        }))
      })
      .catch(error => {
        // 失敗
        dispatch(createAction.failed({params: { user }, error}))
      })
  }
}