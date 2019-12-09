import React from 'react'
import { TextField } from '@material-ui/core'
import { FieldRenderProps } from 'react-final-form'

const TextInput = ({input, meta}: FieldRenderProps<string, HTMLInputElement>): JSX.Element => (
  <TextField
    error={meta.touched && meta.error}
    value={input.value}
  />
)

export default TextInput