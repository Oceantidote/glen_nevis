import { priceFormatter } from './priceFormatter'

export const updatePrices = () => {
  let sum = 0
  document.querySelectorAll('.addon').forEach(ele => {
    if (
      ele.querySelector('.addon-name').innerHTML == 'Booking Fee' ||
      ele.querySelector('.addon-name').innerHTML == 'Cleaning Charge'
    ) {
      sum +=
        parseInt(ele.querySelector('.addon-select').value) *
        parseInt(ele.dataset.rate)
    } else if (
      ele.querySelector('.addon-name').innerHTML != 'Type of unit' &&
      ele.querySelector('.addon-name').innerHTML != 'Tent Size'
    ) {
      sum +=
        parseInt(ele.querySelector('.addon-select').value) *
        parseInt(ele.dataset.rate) *
        $('#nights').val()
    }
  })
  $('#addon').val(sum)
  $('#addon').html(priceFormatter.format(sum / 100))
}
