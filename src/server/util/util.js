import sha512 from 'sha512'

/*
 * Esta función permite encriptar en sha512
 */
export function shaEncryp(msg) {
  // se encripta el mensaje
  let hash = sha512(msg)
  // se convierte a hexadecimal y se retorna
  return hash.toString('hex')
}

export function removeCodeType(code) {
  if(!code){
    return ""
  }

  if(code[0] === "A"){
    return removeNewType(code)
  }else{
    return removeOldType(code)
  }
}

function removeNewType(code) {
  if(code[code.length - 1] === "B"){
    return code.substring(0, code.length - 1)
  }else if (code[code.length - 2] === "B") {
    return code.substring(0, code.length - 2)
  }else{
    return code
  }
}

function removeOldType(code) {
  return code.substring(0, 10);
}