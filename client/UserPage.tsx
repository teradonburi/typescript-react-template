import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { load } from './action/user'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Form, Field } from 'react-final-form'
import { ValidationErrors, SubmissionErrors } from 'final-form'
import { route } from 'interface'

import { withStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { Email } from '@material-ui/icons'
import { orange } from '@material-ui/core/colors'
import TextInput from './mui-form/TextInput'

interface ReduxState {
  user: { users: route.User[] };
}

interface FormValues {
  gender: string;
  first: string;
  last: string;
  email: string;
}

// connectでwrap
const connector = connect(
  // propsに受け取るreducerのstate
  (state: ReduxState) => ({
    users: state.user.users,
  }),
  // propsに付与するactions
  { load }
)

interface UserPageProps {
  bgcolor: string;
}
interface UserPageState {
  user: route.User | null;
  open: boolean;
}

interface Classes {
  classes: {
    root: string;
    card: string;
    name: string;
    gender: string;
  };
}

type PropsFromRedux = ConnectedProps<typeof connector>;
// propsの型
type Props = PropsFromRedux & Classes & UserPageProps;
// stateの型
type State = UserPageState;

class UserPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      user: null,
      open: false,
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.validate = this.validate.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount(): void {
    // user取得APIコールのactionをキックする
    // SSR時のreduxストアデータがあれば、本来呼ぶ必要がないが、今回はサンプルのためキックする
    this.props.load()
  }

  handleClickOpen(user: route.User): void {
    this.setState({ user })
  }

  handleRequestClose(): void {
    this.setState({ user: null })
  }

  validate(values: FormValues): ValidationErrors {
    const errors = {}
    console.log(values)
    return errors
  }

  submit(values: FormValues): (SubmissionErrors | Promise<SubmissionErrors | undefined> | void) {
    console.log(values)
  }

  render(): JSX.Element {
    const { users, classes } = this.props

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
        <Helmet>
          <title>ユーザページ</title>
          <meta name="description" content="ユーザページのdescriptionです" />
        </Helmet>
        <AppBar position="static" color="primary">
          <Toolbar classes={{ root: classes.root }}>タイトル</Toolbar>
        </AppBar>
        {/* 配列形式で返却されるためmapで展開する */}
        {users &&
          users.map(user => {
            return (
              // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
              <Card key={user.email} style={{ marginTop: '10px' }}>
                <CardContent className={classes.card}>
                  <Avatar src={user.picture?.thumbnail} />
                  <p className={classes.name}>
                    {'名前:' + user?.name?.first + ' ' + user?.name?.last}
                  </p>
                  <p className={classes.gender}>
                    {'性別:' + (user?.gender == 'male' ? '男性' : '女性')}
                  </p>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(): void => this.handleClickOpen(user)}
                    >
                      <Email style={{ marginRight: 5, color: orange[200] }} />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        <Link style={{display: 'block', marginTop: 30}} to="/hoge">存在しないページ</Link>
        {this.state.user && (
          <Dialog
            open={!!this.state.user}
            onClose={(): void => this.handleRequestClose()}
          >
            <DialogTitle>メールアドレス</DialogTitle>
            <DialogContent>{this.state.user?.email}</DialogContent>
          </Dialog>
        )}
        <Dialog
          open={this.state.open}
          onClose={(): void => this.handleRequestClose()}
        >
          <DialogTitle>新規ユーザ</DialogTitle>
          <DialogContent>
            <Form onSubmit={this.submit} validate={this.validate}>
              {({handleSubmit}): JSX.Element =>
                <form onSubmit={handleSubmit}>
                  <Field name='first' component={TextInput} />
                </form>
              }
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(theme => ({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
    // 画面サイズがモバイルサイズのときのスタイル
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
    },
  },
  card: {
    background: (props: UserPageProps): string => `${props.bgcolor}`, // props経由でstyleを渡す
  },
  name: {
    margin: 10,
    color: theme.palette.primary.main,
  },
  gender: {
    margin: 10,
    color: theme.palette.secondary.main, // themeカラーを参照
  },
}))(connector(UserPage))
