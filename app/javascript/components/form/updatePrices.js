import { priceFormatter } from './priceFormatter'

export const updatePrices = () => {
  let sum = 0
  document.querySelectorAll('.addon').forEach(ele => {
    if (
      ele.childNodes[1].childNodes[0].checked &&
      (ele.childNodes[0].childNodes[0].innerHTML == "Booking Fee" || ele.childNodes[0].childNodes[0].innerHTML == "Cleaning Charge")
    ) {
      sum +=
        parseInt(ele.childNodes[1].childNodes[1].value) *
        parseInt(ele.dataset.rate)
    } else if (
      ele.childNodes[1].childNodes[0].checked &&
      ele.childNodes[0].childNodes[0].innerHTML != 'Type of unit'
    ) {
      sum +=
        parseInt(ele.childNodes[1].childNodes[1].value) *
        parseInt(ele.dataset.rate) * $('#nights').val()
    }
  })
  $('#addon').val(sum)
  $('#addon').html(priceFormatter.format(sum / 100))
}
