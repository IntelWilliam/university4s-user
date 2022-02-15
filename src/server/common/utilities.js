/**
* Utilidades de la aplicación
*/
import _ from 'lodash'

/**
* Función responsable de obtener un parámetro y devolver su valor numérico, en
* caso de que la entrada no corresponda a un número retorna un valor por
* defecto que tambien llega como parámetro
*/
export function getParsedInt (value, defaultValue = 0) {
  let response = defaultValue

  if (!_.isUndefined(value)) {
    let valueParsed = parseInt(value, 10)

    if (_.isInteger(valueParsed)) {
      response = valueParsed
    }
  }

  return response
}
