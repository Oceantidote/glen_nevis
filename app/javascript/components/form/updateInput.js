export const updateInput = () => {
  const input = $('#extras-input')
  let string = ''
  document.querySelectorAll('.addon').forEach(ele => {
    if (ele.querySelector('.addon-select').value !== '0') {
      if (
        ele.querySelector('.addon-name').innerHTML == 'Booking Fee' ||
        ele.querySelector('.addon-name').innerHTML == 'Type of unit' ||
        ele.querySelector('.addon-name').innerHTML == 'Tent Size' ||
        ele.querySelector('.addon-name').innerHTML == 'Cleaning Charge'
      ) {
        let new_string =
          '|' +
          ele.dataset.id +
          ',' +
          ele.querySelector('.addon-select').value +
          ',' +
          ele.dataset.rate / 100
        string += new_string
      } else {
        let new_string =
          '|' +
          ele.dataset.id +
          ',' +
          ele.querySelector('.addon-select').value * $('#nights').val() +
          ',' +
          ele.dataset.rate / 100
        string += new_string
      }
    }
  })
  input.val(string)
}
