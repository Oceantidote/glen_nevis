export const updateInput = () => {
  const input = $('#extras-input')
  let string = ''
  document.querySelectorAll('.addon').forEach(ele => {
    if (ele.childNodes[1].childNodes[0].checked) {
      if (
        ele.childNodes[0].childNodes[0].innerHTML == 'Booking Fee' ||
        ele.childNodes[0].childNodes[0].innerHTML == 'Type of unit' ||
        ele.childNodes[0].childNodes[0].innerHTML == 'Cleaning Charge'
      ) {
        let new_string =
          '|' +
          ele.dataset.id +
          ',' +
          ele.childNodes[1].childNodes[1].value +
          ',' +
          ele.dataset.rate / 100
        string += new_string
      } else {
        let new_string =
          '|' +
          ele.dataset.id +
          ',' +
          ele.childNodes[1].childNodes[1].value * $('#nights') +
          ',' +
          ele.dataset.rate / 100
        string += new_string
      }
    }
  })
  input.val(string)
}
