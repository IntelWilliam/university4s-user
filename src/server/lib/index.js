import _ from 'lodash'

/**
* Función responsable de armar el query para un campo en particular
*/
let buildFieldQuery = (query, modelKey) => {
  let fieldQuery = ''
  let searchQuery = ''

  // se verifica si se especifica buscar exactamente por una palabra
  if (!_.isUndefined(query._matchExactly) && query._matchExactly === '1') {
    // se indica a la consulta que la busqueda debe ser exacta
    fieldQuery = query[modelKey]
  } else {
    // por defecto se busca que la palabra este entre el campo, con case-sensitive
    fieldQuery = {
      // la palabra debe estar entre el valor del campo
      $regex: query[modelKey],
      $options: 'i' // i: case sensitive, x: ignorar los espacios
    }

    // se verifica si se especifica ignorar el case sensitive, para indicarlo
    // en la consulta
    if (!_.isUndefined(query._caseSensitive) && query._caseSensitive === '0') {
      // se indica ahora que la query no debe de ser case-sensitive
      fieldQuery.$options = ''
    }

    // se verifica si se especifica ignorar los espacios en blanco
    if (!_.isUndefined(query._ignoreSpaces) && query._ignoreSpaces === '1') {
      // se indica ahora que la query debe ignorar los espacios
      fieldQuery.$options = fieldQuery.$options + 'x'
    }
  }

  return fieldQuery
}
/**
* Función responsable de filtrar los parámetros que llegan desde el request de
* tal forma que sólo queden los que pertenecen al modelo para que no vayan a
* existir errores en la consulta.
*/
export function filterQuery (query, modelKeys) {
  var fullQuery = {}
  let filteredQuery = {}
  let searchQuery = {}
  // variable que sirve para saber si se debe buscar un texto por todos los fields
  let fullSearch = false
  // variable que indica si la búsqueda por campos específicos es un $or
  let isOrOperation = false

  if (!_.isUndefined(query) && !_.isUndefined(modelKeys) && _.isObject(query) && _.isArray(modelKeys)) {
    // keys del query
    let queryKeys = Object.keys(query)
    // variable temporal para usar en el forEach
    let indexOf
    // varible temporal que tiene la consulta de un field
    let fieldQuery = {}

    // si llega el parámetro search es para buscar por todos los campos
    if (!_.isUndefined(query.search) && !_.isEmpty(query.search)) {
      fullSearch = true
      searchQuery = []
    }

    // se verifica si se esta especificando que la operacion es un $or, por
    // default es $and
    if (!_.isUndefined(query._isOrOperation) && query._isOrOperation === '1') {
      isOrOperation = true
      filteredQuery = []
    }

    // se recorre el erray de keys del modelo
    modelKeys.forEach((modelKey) => {
      // se verifica si la modelKey i existe en la query
      indexOf = _.indexOf(queryKeys, modelKey)

      // si el index existe, entonces se guarda su valor para enviarlo a la consulta
      if (indexOf >= 0) {
        // se verifica si es un $or o un $and la operación que se debe ejecutar
        if (isOrOperation) {
          // or, se arma el query
          fieldQuery[modelKey] = buildFieldQuery(query, modelKey)
          filteredQuery.push(fieldQuery)
          fieldQuery = {}
        } else {
          // and, se arma el query para el campo modelKey
          filteredQuery[modelKey] = buildFieldQuery(query, modelKey)
        }
      }

      // se arma la consulta por todos los campos si llega el param search
      if (fullSearch) {
        fieldQuery[modelKey] = buildFieldQuery(query, 'search')
        searchQuery.push(fieldQuery)
        fieldQuery = {}
      }
    })
  }

  // se verifica si se esta buscando con el operador or
  if (isOrOperation) {
    filteredQuery = { $or: filteredQuery }
  }

  // se verifica si se esta buscando en todos los fields
  if (fullSearch) {
    fullQuery = {
      $or: [filteredQuery, { $or: searchQuery }]
    }
  } else {
    fullQuery = filteredQuery
  }

  return fullQuery
}
