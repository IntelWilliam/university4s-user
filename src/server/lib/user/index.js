import { default as User, UserKeys } from 'src/server/models/User';
import { getParsedInt } from 'src/server/common/utilities';
import { filterQuery } from 'src/server/lib';
import { shaEncryp } from 'src/server/util/util';
import { getFirstLesson } from 'src/server/lib/lesson';
import {
  getFirstSubLevel,
  getNextSubLevelFromArray,
} from 'src/server/lib/sublevel';
import { getFirstPractice } from 'src/server/lib/practice';
import { getFirstSection } from 'src/server/lib/section';
import { addUserLesson } from 'src/server/lib/userlesson';
import { addUserPractice } from 'src/server/lib/userpractice';
import { addUserSection } from 'src/server/lib/usersection';
import { getFirstLevel, getNextLevelFromArray } from 'src/server/lib/level';
import uniqid from 'uniqid';
import _ from 'lodash';

import Constants from 'src/server/constants';
import request from 'request';
import { updateCoupleBuyerData } from '../validateCode';

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getUserDev(query, callback, full) {
  console.log(
    "Constants.API_BASE_URL + 'login'",
    (process.env.API_BASE_URL || Constants.API_BASE_URL) + 'login'
  );

  request(
    {
      uri: (process.env.API_BASE_URL || Constants.API_BASE_URL) + 'login',
      method: 'POST',
      form: {
        username: query.username,
        password: query.password,
      },
    },
    (error, response, body) => {
      console.log('error, body', error, body);

      let userDev = JSON.parse(body);
      if (error || userDev.status === false) {
        return callback(true);
      }

      User.findOne(
        {
          userIdDev: userDev.id,
        },
        function (err, userFound) {
          if (err) return console.log(err);

          if (!userFound) {
            let index = userDev.email.indexOf('@');
            let username = userDev.email.substring(0, index);
            let userTypeAux =
              userDev.userType == 'student' ? 'learner' : userDev.userType;
            var newUser = {
              userIdDev: userDev.id,
              role: userTypeAux,
              status: 1,
              username: username,
              email: userDev.email,
              name: userDev.name,
              lastname: userDev.lastname,
              password: query.password,
              lastConection: new Date(),
            };

            addUser(newUser, (err, user) => {
              if (err) return callback(err);
              return callback(null, user);
            });
          } else {
            userFound.lastConection = new Date();
            userFound.isMonthDisconnectNotify = false;
            userFound.save(() => {});
            return callback(null, userFound);
          }
        }
      );
    }
  );
}

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getUser(query, callback, full) {
  // objeto que se usa para almacenar el criterio de ordenamiento de la lista
  let sort = {};
  let sortField = _.isUndefined(query.sortField)
    ? 'createdAt'
    : query.sortField;
  let sortType = _.isUndefined(query.sortType)
    ? 1
    : query.sortType === '1'
    ? 1
    : -1;
  sort[sortField] = sortType;

  // variables para paginación
  let offset = getParsedInt(query.offset, null);
  let page = getParsedInt(query.page, null);
  let limit = getParsedInt(query.limit, null);

  // se filtra el query para que sólo queden los que son necesarios para un
  // criterio de búsqueda
  query = filterQuery(query, UserKeys);

  // opciones para la query
  let options = {
    select: full
      ? {}
      : {
          password: 0,
          createdAt: 0,
          status: 0,
          updatedAt: 0,
          salt: 0,
        },
    sort: sort,
  };

  // si hay algun offset se indica
  if (!_.isNull(offset)) {
    options.offset = offset;
  }

  // si hay algun page se indica
  if (!_.isNull(page)) {
    options.page = page;
  }

  // si hay algun límite se indica
  if (!_.isNull(limit)) {
    options.limit = limit;
  }
  // se obtienen los resultados paginados
  User.paginate(query, options, (err, result) => {
    if (err) return callback(err);
    result.data = result.docs;
    delete result.docs;
    callback(null, result);
  });
}

/*
 * Esta función crea un nuevo registro
 */
export function addUser(newUser, callback) {
  newUser['salt'] = uniqid();
  newUser['password'] = shaEncryp(newUser['salt'] + newUser['password']);

  User.create(newUser, (err, user) => {
    if (err) {
      return callback(err);
    }
    // Si se va a crear un aprendiz se le inserta la primera lección
    if (newUser['role'] == 'learner') {
      // se obtiene el primer nivel
      getFirstLevel((err, level) => {
        if (err) return callback(err);
        changeUserSubLevel(level, user, callback);
      });
    }
  });
}

/*
 * Esta función actualiza un registro
 */
export function updateUser(id, newData, callback) {
  if (newData['password']) {
    newData['salt'] = uniqid();
    newData['password'] = shaEncryp(newData['salt'] + newData['password']);
  }

  User.findByIdAndUpdate(
    id,
    {
      $set: newData,
    },
    {
      safe: true,
      upsert: true,
      new: true,
    },
    (err, user) => {
      if (err) return callback(err);

      callback(null, 'success');

      updateCoupleBuyerData(user, (err) => {
        if (err) console.log(err);
      });
    }
  );
}

/*
 * Esta función elimina un nuevo registro
 */
export function removeUser(id, callback) {
  User.remove(
    {
      _id: id,
    },
    (err, info) => {
      if (err) return callback(err);
      callback(null, info);
    }
  );
}

/*
 * Esta función crea un nuevo indice en el arreglo realcionado
 */
export function addRelationLanguage(id, idLanguage, callback) {
  var idref = mongoose.Types.ObjectId(idLanguage);
  User.findByIdAndUpdate(
    id,
    {
      $push: {
        learningLanguages: idref,
      },
    },
    {
      safe: true,
      upsert: true,
      new: true,
    },
    (err, info) => {
      if (err) return callback(err);
      callback(null, info);
    }
  );
}

/*
 * Esta función elimina un indice especifico del array relacionado
 */
export function removeRelationLanguage(id, idLanguage, callback) {
  var idref = mongoose.Types.ObjectId(idLanguage);
  User.findByIdAndUpdate(
    id,
    {
      $pull: {
        learningLanguages: idref,
      },
    },
    {
      safe: true,
      upsert: true,
      new: true,
    },
    (err, info) => {
      if (err) return callback(err);
      callback(null, info);
    }
  );
}

export function changeUserSubLevel(level, user, callback) {
  // se obtiene el primer subnivel de ese nivel
  getFirstSubLevel(level._id, (error, subLevel) => {
    if (error) return callback(error);
    changeUserLesson(subLevel, user, callback);
  });
}

export function changeUserLesson(subLevel, user, callback) {
  // se obtiene la primera lección de ese subnivel
  getFirstLesson(subLevel._id, (lessonError, lesson) => {
    if (lessonError) return callback(lessonError);
    addUserLesson(
      user._id,
      subLevel._id,
      lesson._id,
      (userLessonError, userLessons) => {
        if (userLessonError) return callback(userLessonError);
        changeUserPractice(lesson, user, callback);
      }
    );
  });
}

export function changeUserPractice(lesson, user, callback) {
  // se obtiene la primera practice de esa lección
  getFirstPractice(lesson._id, (practiceError, practice) => {
    if (practiceError) return callback(practiceError);
    addUserPractice(
      lesson._id,
      user._id,
      practice._id,
      (userPracticeError, userPractices) => {
        if (userPracticeError) return callback(userPracticeError);
        changeUserSection(practice, user, callback);
      }
    );
  });
}

export function changeUserSection(practice, user, callback) {
  // se obtiene la primera seccion de esa practica
  getFirstSection(practice._id, (sectionError, section) => {
    addUserSection(
      practice._id,
      user._id,
      section._id,
      (userSectionError, userSections) => {
        if (userSectionError) return callback(userSectionError);
        callback(null, user);
      }
    );
  });
}

export function unlockNextSubLevel(levelId, user, subLevelId, callback) {
  getNextSubLevelFromArray(levelId, subLevelId, (error, subLevel) => {
    if (error) return;
    changeUserLesson(subLevel, user, callback);
  });
}

export function unlockNextLevel(levelId, user, callback) {
  getNextLevelFromArray(levelId, (error, level) => {
    if (error) return;
    changeUserSubLevel(level, user, callback);
  });
}
