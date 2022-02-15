export function sentenceCase(input, lowercaseBefore) {

  if (input && typeof input == "string") {
    input = input.trim()
    if (input[input.length - 1] != ":" && input[input.length - 1] != "." && input[input.length - 1] != "?" && input.length > 0) {
      input = input.concat(".");
    }
  }

  input = (input === undefined || input === null) ? '' : input;
  if (lowercaseBefore) { input = input.toLowerCase(); }


  input = input.toString().replace(/(^|\¿ *)([ña-z])/g, function (match, separator, char) {
    return separator + char.toUpperCase();
  });
  
  return input.toString().replace(/(^|\. *)([ña-z])/g, function (match, separator, char) {
    return separator + char.toUpperCase();
  });

}

export function caseDescription(input, lowercaseBefore) {

  if (input && typeof input == "string") {
    input = input.trim()
    if (input[input.length - 1] != ":" && input[input.length - 1] != "." && input[input.length - 1] != "?" && input.length > 0) {
      input = input.concat(":");
    }
  }

  input = (input === undefined || input === null) ? '' : input;
  if (lowercaseBefore) { input = input.toLowerCase(); }

  input = input.toString().replace(/(^|\¿ *)([ña-z])/g, function (match, separator, char) {
    return separator + char.toUpperCase();
  });


  return input.toString().replace(/(^|\. *)([ña-z])/g, function (match, separator, char) {
    return separator + char.toUpperCase();
  });
}
