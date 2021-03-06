import { has, isEmpty, length } from 'ramda'
import { isValid as cnpjIsValid } from '@fnando/cnpj'
import { isValid as cpfIsValid } from '@fnando/cpf'
import { string, setLocale } from 'yup'

import { getAddressByZipCode } from '../services/fornecedores'
import { getSerial } from '../services/serialNumber'

setLocale({
  mixed: {
    default: 'Não é válido',
  },
  string: {
    email: 'Email inválido',
  },
})

export const validateConfirmPassword = ({ getFieldValue }) => (_, value) => {
  const confirmPassword = getFieldValue('newPassword')

  if (confirmPassword && confirmPassword !== value) {
    return Promise.reject(new Error('Nova senha estão diferente'))
  }
}

export const validateCEP = async (form, value) => {
  try {
    const { status, data } = await getAddressByZipCode(value)

    if (status !== 200 || has('erro', data)) {
      return Promise.reject(new Error('Cep inválido'))
    }
  } catch (err) {
    return Promise.reject(new Error('Cep inválido'))
  }
}

export const validateCNPJ = (form, value) => {
  if (!cnpjIsValid(value)) {
    return Promise.reject(new Error('CNPJ inválido'))
  } else {
    return Promise.resolve(form.setFields([{ name: 'cnpj', value, errors: [] }]))
  }
}

export const validateCPFOrCNPJ = (form, value) => {
  if (cnpjIsValid(value) || cpfIsValid(value)) {
    return Promise.resolve(form.setFields([{ name: 'cnpj', value, errors: [] }]))
  } else {
    return Promise.reject(new Error('CNPJ ou CPF inválido'))
  }
}

export const validateEmail = async (value) => {
  try {
    await string().email().validate(value)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const validateSerialNumberForEntry = async (
  currentTargetValue,
  options = {
    limit: undefined,
    noRequest: false,
    reserve: false,
  }
) => {
  const { noRequest, limit, reserve } = options
  const currentValueSerialNumber = currentTargetValue.split(/\n/)
  const lastPosition = length(currentValueSerialNumber) - 1

  const findSerialNumber = currentValueSerialNumber.filter(
    (serialNumber) => serialNumber === currentValueSerialNumber[lastPosition]
  )

  const setSerialNumberModal = (error) => {
    currentValueSerialNumber.splice(lastPosition, 1)
    return {
      error,
      length: length(currentValueSerialNumber),
      serialNumbers: currentValueSerialNumber.join('\n'),
    }
  }

  if (isEmpty(currentValueSerialNumber[lastPosition])) {
    return setSerialNumberModal('Insira um número!')
  }

  if (findSerialNumber && length(findSerialNumber) > 1) {
    return setSerialNumberModal('Número de série já foi adicionado!')
  }

  if (length(currentValueSerialNumber) > limit) {
    return setSerialNumberModal('Limite atingido!')
  }

  if (!noRequest) {
    const { data } = await getSerial(currentValueSerialNumber[lastPosition])

    if (reserve && !data) {
      return setSerialNumberModal('Número de série não registrado!')
    }

    if (!reserve && data) {
      return setSerialNumberModal('Número de série já registrado!')
    }
  }

  return {
    length: length(currentValueSerialNumber),
    serialNumbers: currentValueSerialNumber,
  }
}

export const validateNewPassword = ({ getFieldValue, setFields }) => (
  _,
  value
) => {
  const confirmPassword = getFieldValue('confirmPassword')
  const currentPassword = getFieldValue('currentPassword')

  if (currentPassword === value) {
    return Promise.reject(new Error('Nova senha dev ser diferente da antiga'))
  }

  if (confirmPassword && confirmPassword !== value) {
    setFields([
      {
        errors: ['Nova senha estão diferente'],
        name: ['confirmPassword'],
      },
    ])
  } else {
    setFields([
      {
        errors: [],
        name: ['confirmPassword'],
      },
    ])
  }
}

export const validatePlate = async (value) => {
  if (/\W/.test(value)) {
    return Promise.reject(new Error('Digite apenas caracteres alfanumérico'))
  }
}
