/**
 *	Componente que sirve para subir imagenes al servidor que vienen desde la web
 */
import multer from 'multer'
import path from 'path'
import { EXTERNAL_BASE_PATH, FILES, UPLOAD } from 'src/server/constants'

/**
 * @description
 * Función que permite subir un archivo al servidor.
 *
 * @param string fieldname, representa el key con el que llega
 * el archivo al server.
 */
export function uploadSingleFile(req, res, fieldname, cb) {
  // path público donde queda almacenado el archivo
  let publicFilePath = ''
  // nombre con el que se almacena la imagen en el server (es dinamico)
  let fileRenamed = ''

  // protocolo para tener el control de donde se almacena el archivo
  let storage = multer.diskStorage({
    destination: function(req, file, callback) {
      // path donde queda el archivo
      let destination = _rootPath + EXTERNAL_BASE_PATH

      switch (file.fieldname) {
        case FILES.USER.PROFILE_PHOTO.KEY:
          destination += FILES.USER.PROFILE_PHOTO.PATH
          publicFilePath = FILES.USER.PUBLIC_PATH
          break

        default:
          destination += FILES.DEFAULT.PATH
          publicFilePath = FILES.DEFAULT.PUBLIC_PATH
          break
      }

      callback(null, destination)
    },
    filename: function(req, file, callback) {
      // se crea un nombre dinámico para que no se sobreescriban los archivos
      fileRenamed = file.fieldname + '-' + Date.now() + '.jpg'
      // se termina de armar el full path del archivo
      publicFilePath += '/' + fileRenamed
      callback(null, fileRenamed)
    }
  })


  // función para subir la foto
  let upload = multer({ storage: storage }).single(fieldname)
  upload(req, res, function(err) {
    if (err) {
      return cb({ error: err })
    }
    // todo ok!
    cb(null, {
      success: true,
      data: {
        publicFilePath: publicFilePath,
        fileRenamed: fileRenamed
      }
    })
  })
}

/*
 * Permite cargar un archivo y devuleve los datos que han sido enviados
 */
export function uploadFile(req, res, callback) {
  console.log('uploadFileChat');
  let nameFile = '';
  let nameOriginal = ''
  let dest = ''
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      dest = _rootPath + EXTERNAL_BASE_PATH + FILES.DEFAULT.UPLOAD;
      callback(null, dest);
    },
    filename: function(req, file, callback) {
      nameOriginal = file.originalname;
      nameFile = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      callback(null, nameFile);
    }
  })

  var upload = multer({ storage: storage }).single('docFile');

  upload(req, res, function(err) {
    if (err)
      return callback({ error: err })
    // todo ok!
    let resp = req.body;
    if (nameFile) {
      resp['file'] = dest + '/' + nameFile;
      resp['fileName'] = nameOriginal;
    }

    callback(null, resp)
  })
}



export function uploadFileChat(req, res, fieldname, cb) {
  // path público donde queda almacenado el archivo
  var publicFilePath = ''
  // nombre con el que se almacena el archivo en el server (es dinamico)
  var fileRenamed = ''

  // protocolo para tener el control de donde se almacena el archivo
  let storage = multer.diskStorage({
    destination: function(req, file, callback) {
      // path donde queda el archivo
      let destination = '/mnt/akron-volume/uploads_chat'
      publicFilePath += destination

      callback(null, destination)
    },
    filename: function(req, file, callback) {
      // se crea un nombre dinámico para que no se sobreescriban los archivos
      fileRenamed = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      // se termina de armar el full path del archivo
      publicFilePath += '/' + fileRenamed
      console.log('ruta-img: ', publicFilePath);
      callback(null, fileRenamed)
    }
  })


  // función para subir el archivo
  // tamaño maximoen bytes (5mb)
  let upload = multer({ storage: storage , limits: { fileSize: 5242880, files: 1}}).single(fieldname)
  upload(req, res, function(err) {
    if (err) {
      return cb({ error: err })
    }
    // todo ok!
    cb(null, {
      success: true,
      data: {
        publicFilePath: publicFilePath,
        fileRenamed: fileRenamed
      }
    })
  })

}
