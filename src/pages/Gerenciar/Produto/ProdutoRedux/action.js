import action from '../../../../store/actions'

export function redirectValueProduto(value) {
  return (dispatch) =>
    dispatch({
      type: action.REDIRECT.PRODUTO,
      payload: value,
    })
}

export function redirectValueFornecedor(value) {
  return (dispatch) =>
    dispatch({
      type: action.REDIRECT.FORNECEDOR,
      payload: value,
    })
}

export function redirectValueUsuario(value) {
  return (dispatch) =>
    dispatch({
      type: action.REDIRECT.USUARIO,
      payload: value,
    })
}

export function redirectValueTecnico(value) {
  return (dispatch) =>
    dispatch({
      type: action.REDIRECT.TECNICO,
      payload: value,
    })
}

export function clearValueFornecedor() {
  return (dispatch) =>
    dispatch({
      type: action.CLEAR.PROVIDER,
    })
}

export function clearValueTecnico() {
  return (dispatch) =>
    dispatch({
      type: action.CLEAR.TECNICO,
    })
}
