import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { route } from 'interface'
import { loadAction } from '../action/user'


interface ReduxState {
  users?: route.User[];
}

// 初期化オブジェクト
const initialState: ReduxState = {
  users: [],
}

const reducer = reducerWithInitialState(initialState)
    .case(loadAction.done, (state, data) => ({...state, users: data.result.users}))
    .case(loadAction.failed, (state, data) => ({...state, error: data.error}))

export default reducer