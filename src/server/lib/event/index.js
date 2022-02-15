import {default as Entry} from 'src/server/models/moodleEntry'
import {default as Event} from 'src/server/models/Event'
// import { Types } from 'mongoose' import request from 'request'; import
// Constants from 'src/server/constants';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas

export function addEventsBooks(date, userId, callback) {

  getMoodleLessons((err, resp)=>{
    if(err){
      console.log('err', err);
      return callback(err)
    }

    console.log('resp', resp);

    if (!resp.hasOwnProperty("Lessons")) {
      return callback("No hay lecciones")
    }

    let lessons = resp.Lessons

    let arrLessonsMonth = {};
    let events = [];

    let daysMonth = 30;
    let dateTemp = date
      ? new Date(parseInt(date))
      : new Date();
    dateTemp.setDate(dateTemp.getDate() + 1); //Se le suma un día a la fecha para que empiece al otro día

    for (var lesson in lessons) {
      if (lessons.hasOwnProperty(lesson)) {
        if (!arrLessonsMonth[lessons[lesson].subNivel])
          arrLessonsMonth[lessons[lesson].subNivel] = [];

        arrLessonsMonth[lessons[lesson].subNivel].push(lessons[lesson]); //Json con key del id del sublevel
      }
    }

    for (let month in arrLessonsMonth) {

      let numberEntriesMonth = arrLessonsMonth[month].length + 1 ;
      let numberEntriesForDay = Math.round(numberEntriesMonth / daysMonth);
      let numberDaysForEntries = 0;
      let isEntriesForDay = true;
      if (numberEntriesForDay == 0) { //Si numberEntriesForDay es cero es porque son muy pocas entries en un mes
        numberDaysForEntries = Math.round(daysMonth / numberEntriesMonth);
        isEntriesForDay = false;
      }
      let numberEntries = 1;
      for (let lesson in arrLessonsMonth[month]) {
        if (isEntriesForDay) { //Se pregunta si se van a hacer entries por día, en caso contrario es días por entry
          if (numberEntries > numberEntriesForDay) {
            numberEntries = 1;
            dateTemp.setDate(dateTemp.getDate() + 1);
          }
        } else if (numberEntries > 1)
          dateTemp.setDate(dateTemp.getDate() + numberDaysForEntries); //Se suma a la fecha el número de días por entry

        let levelName = ""

        switch (arrLessonsMonth[month][lesson].Nivel) {
        case "1":
          levelName = "Inicial"
          break;
        case "2":
          levelName = "Fundamental"
          break;
        case "3":
          levelName = "Operacional"
          break;
        }

        // levelName=Fundamental
        // subName=Fundamental%203
        // subId=7
        // lessonId=66
        // lastLesson=false
        // lessonName=I%20haven%27t%20seen%20you%20for%20years.
        // lessonIndex=8

        console.log('arrLessonsMonth[month].length', arrLessonsMonth[month].length);

        let lastLesson = false;
        if(numberEntriesMonth == arrLessonsMonth[month][lesson].lessonIndex){
          lastLesson = true;
        }

        let event = { //Se crea un nuevo evento con la fecha, la entrada, el usuario y todos los datos necesarios
          levelName: levelName,
          subLevelName: arrLessonsMonth[month][lesson].subLevelName,
          sublevelMoodleId: arrLessonsMonth[month][lesson].subNivel,
          lessonMoodleId: arrLessonsMonth[month][lesson].lessonId,
          lastLesson: lastLesson.toString(),
          lessonName: arrLessonsMonth[month][lesson].lessonName,
          lessonTranslate: arrLessonsMonth[month][lesson].lessonTranslate,
          lessonIndex: arrLessonsMonth[month][lesson].lessonIndex,
          date: dateTemp.toISOString(),
          userId: userId,
        }

        events.push(event);

        numberEntries++;
      }

      dateTemp.setDate(dateTemp.getDate() + numberDaysForEntries); //Se suma a la fecha el número de días por entry
      events.push({examEvent: true, date: dateTemp.toISOString(), userId: userId})

      dateTemp.setDate(dateTemp.getDate() + 1); //Se suma un día para el nuevo subnivel
    }
    deleteEventsUser(events, userId, callback);


    // callback(null, events)
  })

}

export function getMoodleLessons(callback){
  request({
    uri: Constants.API_BASE_URL + 'all_lessons/',
    method: "GET"
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let jsonResponse = JSON.parse(body);
      callback(null, jsonResponse)
    } else if (error) {
      callback(error)
    } else
      callback(body)
  });
}

/*
 * Esta función crear los eventos con su respectiva fecha
 */
export function addEvents(date, userId, callback) {
  Entry.find({
    isEnabled: true
  }, {
    sublevelMoodleId: 1,
    lessonMoodleId: 1,
    sectionObjId: 1,
    nameLesson: 1,
    nameSubLevel: 1,
    nameLevel: 1,
    entryType: 1,
    lessonWebLessonId: 1,
    subWebSublevelId: 1,
    levelWebLevelId: 1,
    name: 1
  }).sort({sublevelMoodleId: 1, lessonMoodleId: 1, sectionObjId: 1}).exec((err, entries) => {
    if (err)
      return callback(err)

    let events = [];
    let arrEntriesMonth = {};
    let daysMonth = 30;
    let dateTemp = date
      ? new Date(parseInt(date))
      : new Date();
    dateTemp.setDate(dateTemp.getDate() + 1); //Se le suma un día a la fecha para que empiece al otro día

    for (let entry in entries) {
      if (!arrEntriesMonth[entries[entry].sublevelMoodleId])
        arrEntriesMonth[entries[entry].sublevelMoodleId] = [];

      arrEntriesMonth[entries[entry].sublevelMoodleId].push(entries[entry]); //Json con key del id del sublevel
    }
    // let numberMonths = Object.keys(arrEntriesMonth).length;

    for (let month in arrEntriesMonth) {

      let numberEntriesMonth = arrEntriesMonth[month].length;
      let numberEntriesForDay = Math.round(numberEntriesMonth / daysMonth);
      let numberDaysForEntries = 0;
      let isEntriesForDay = true;
      if (numberEntriesForDay == 0) { //Si numberEntriesForDay es cero es porque son muy pocas entries en un mes
        numberDaysForEntries = Math.round(daysMonth / numberEntriesMonth);
        isEntriesForDay = false;
      }
      let numberEntries = 1;
      for (let entry in arrEntriesMonth[month]) {
        if (isEntriesForDay) { //Se pregunta si se van a hacer entries por día, en caso contrario es días por entry
          if (numberEntries > numberEntriesForDay) {
            numberEntries = 1;
            dateTemp.setDate(dateTemp.getDate() + 1);
          }
        } else if (numberEntries > 1)
          dateTemp.setDate(dateTemp.getDate() + numberDaysForEntries); //Se suma a la fecha el número de días por entry

        let event = { //Se crea un nuevo evento con la fecha, la entrada, el usuario y todos los datos necesarios
          entryId: arrEntriesMonth[month][entry]._id,
          lessonMoodleId: arrEntriesMonth[month][entry].lessonMoodleId,
          lessonName: arrEntriesMonth[month][entry].nameLesson,
          sublevelMoodleId: arrEntriesMonth[month][entry].sublevelMoodleId,
          subLevelName: arrEntriesMonth[month][entry].nameSubLevel,
          levelName: arrEntriesMonth[month][entry].nameLevel,
          entryType: arrEntriesMonth[month][entry].entryType,
          entryName: arrEntriesMonth[month][entry].name,
          userId: userId,
          date: dateTemp.toISOString()
        }
        if (arrEntriesMonth[month][entry].subWebSublevelId) {
          event['subWebSublevelId'] = arrEntriesMonth[month][entry].subWebSublevelId;
        }
        if (arrEntriesMonth[month][entry].lessonWebLessonId) {
          event['lessonWebLessonId'] = arrEntriesMonth[month][entry].lessonWebLessonId;
        }
        if (arrEntriesMonth[month][entry].levelWebLevelId) {
          event['levelWebLevelId'] = arrEntriesMonth[month][entry].levelWebLevelId;
        }
        events.push(event);
        numberEntries++;
      }
      dateTemp.setDate(dateTemp.getDate() + 1); //Se suma un día para el nuevo subnivel
    }

    deleteEventsUser(events, userId, callback);
  });
}

/*
 * Esta función permite eliminar todos los eventos relacionados a un cliente
 */
export function deleteEventsUser(events, userId, callback) {
  Event.remove({
    userId: userId
  }, (err, response) => {
    if (err)
      return callback(err)

    createEvents(events, userId, callback);
  });
}

/*
 * Esta función permite insertar todos los eventos relacionados a un cliente
 */
export function createEvents(events, userId, callback) {
  Event.create(events, (err, response) => {
    if (err)
      return callback(err)

    // callback(null, events);
    callback(null, { ok: "Events created" });
  });
}

/*
 * Esta función retorna todos los eventos de un cliente en unas fechas determinadas
 */
export function getEvents(firstDate, secondDate, userId, callback) {
  let dateFirst = new Date();
  if (firstDate) {
    dateFirst = new Date(parseInt(firstDate));
  } else {
    dateFirst = new Date(dateFirst.getFullYear(), dateFirst.getMonth(), dateFirst.getDate(), 0, 0, 0);
  }

  let dateSecond = new Date();
  let limit = 2;

  let query = {
    userId: userId,
    date: {
      $gte: dateFirst.toISOString()
    }
  };


  if (secondDate) {
    limit = 0;
    dateSecond = new Date(parseInt(secondDate));
    query = {
      userId: userId,
      date: {
        $gte: dateFirst.toISOString(),
        $lte: dateSecond.toISOString()
      }
    };
  }

  Event.find(query).sort({date: 1}).limit(limit).exec((err, events) => {
    if (err)
      return callback(err)

    // console.log('events', events);
    callback(null, events);
  });
}
