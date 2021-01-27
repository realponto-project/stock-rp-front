import { has, isEmpty, length, path } from 'ramda'
import { isValid as cpnjIsValid } from '@fnando/cnpj'
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
  if (!cpnjIsValid(value)) {
    return Promise.reject(new Error('CNPJ inválido'))
  } else {
    return Promise.resolve(form.setFields([{ name: 'cnpj', value, errors: [] }]))
  }
}

export const validateEmail = async (value) => {
  try {
    await string().email().validate(value)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const validatePlate = async (value) => {
  if (/\W/.test(value)) {
    return Promise.reject(new Error('Digite apenas caracteres alfanumérico'))
  }
}

export const validateSerialNumberForEntry = async (
  currentTargetValue,
  noRequest = false
) => {
  const currentValueSerialNumber = currentTargetValue.split(/\n/)
  const lastPosition = length(currentValueSerialNumber) - 1

  const findSerialNumber = currentValueSerialNumber.filter(
    (serialNumber) => serialNumber === currentValueSerialNumber[lastPosition]
  )

  const setSerialNumberModal = (error) => {
    currentValueSerialNumber.splice(lastPosition, 1)
    return { serialNumbers: currentValueSerialNumber.join('\n'), error }
  }

  if (isEmpty(currentValueSerialNumber[lastPosition])) {
    return setSerialNumberModal('Insira um número!')
  }

  if (findSerialNumber && length(findSerialNumber) > 1) {
    return setSerialNumberModal('Número de série já foi adicionado!')
  }

  if (noRequest) return

  const { data } = await getSerial(currentValueSerialNumber[lastPosition])

  if (data) {
    return setSerialNumberModal('Número de série já registrado!')
  }
}
