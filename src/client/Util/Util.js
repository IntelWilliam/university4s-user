export function formatDate(dateTo) {
  let date = new Date(dateTo);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  let mm = date.getMinutes()

  if (dt < 10) {
      dt = '0' + dt;
  }
  if (month < 10) {
      month = '0' + month;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }

  return (year + '-' + month + '-' + dt + ' ' + date.getHours() + ':' + mm);
}
