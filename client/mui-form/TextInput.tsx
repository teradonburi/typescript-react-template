import React from 'react'
import clsx from 'clsx'
import { TextField, InputAdornment, TextFieldProps } from '@material-ui/core'
import { FieldRenderProps } from 'react-final-form'
import { makeStyles } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

interface AddtionalTextFieldProps {
  beforeLabel?: string;
  afterLabel?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3 / 2),
  },
}))

const useAdditonalStyles = makeStyles(() => ({
  warn: {
    color: orange[500],
  },
}))

type TextFieldPropsEx = TextFieldProps & AddtionalTextFieldProps
type RenderProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

const TextInput = ({input, meta, ...rest}: RenderProps): JSX.Element => {
  const {
    variant,
    fullWidth = true,
    margin = 'dense',
    label,
    autoFocus,
    disabled,
    required,
    placeholder,
    select,
    multiline,
    rows,
    rowsMax,
    children,
    classes = {},
    className,
    inputProps,
    InputProps,
    InputLabelProps,
    FormHelperTextProps,
    SelectProps,
    ref,
    // additional
    beforeLabel,
    afterLabel,
  }: TextFieldPropsEx = rest

  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched
  const showWarn = meta.touched && meta.data && meta.data.warning

  const baseClasses = useStyles()
  const addtionalClasses = useAdditonalStyles()

  const props = {
    fullWidth,
    margin,
    // input
    type: input.type,
    name: input.name,
    value: input.value,
    onChange: input.onChange,
    onFocus: input.onFocus,
    onBlur: input.onBlur,
    // TextField props
    classes: {
      ...baseClasses,
      root: clsx(baseClasses.root, classes.root, className),
    },
    label,
    autoFocus,
    disabled,
    required,
    placeholder,
    select,
    multiline,
    rows,
    rowsMax,
    error: showError,
    helperText: showError ? (meta.error || meta.submitError) : showWarn ? meta.data?.warning : null,
    inputRef: ref,
    inputProps: inputProps,
    // children props
    InputProps: {
      startAdornment: beforeLabel ? <InputAdornment position='start'>{beforeLabel}</InputAdornment> : undefined,
      endAdornment: afterLabel ? <InputAdornment position='end'>{afterLabel}</InputAdornment> : undefined,
      ...InputProps,
    },
    InputLabelProps: {
      shrink: true, // always shrink the label
      ...InputLabelProps,
    },
    FormHelperTextProps: {
      classes: showWarn ? {root: addtionalClasses.warn} : {},
      ...FormHelperTextProps,
    },
    SelectProps,
  }

  return (
    <>
      {variant === 'outlined' ? <TextField variant='outlined' {...props}>{children}</TextField> :
      variant === 'filled' ? <TextField variant='filled' {...props}>{children}</TextField> :
      <TextField variant='standard' {...props}>{children}</TextField>}
    </>
  )
}

export default TextInput