import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { redux } from 'interface'
import { loadAction, createAction } from '../action/user'

// 初期化オブジェクト
const initialState: redux.User = {
  users: [],
  user: null,
}

const reducer = reducerWithInitialState(initialState)
    .case(loadAction.done, (state, data) => ({...state, users: data.result.users}))
    .case(loadAction.failed, (state, data) => ({...state, error: data.error}))
    .case(createAction.done, (state, data) => ({...state, user: data.result.user}))
    .case(createAction.failed, (state, data) => ({...state, error: data.error}))

export default reducer