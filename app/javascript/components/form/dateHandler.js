import flatpickr from 'flatpickr'
import moment from 'moment'
import { updatePrices } from './updatePrices'
import { updateInput } from './updateInput'
import { discountHandler } from './discountHandler'

export const dateHandler = () => {
  flatpickr('#arrival_date', {
    dateFormat: 'D d/m/Y',
    minDate: Date.now() - (24*60*60*1000)*7
  })
  updateDeparture()
  $('#arrival_cal').change(updateDeparture)
  $('#arrival_cal').change(updatePrices)
  $('#arrival_cal').change(updateInput)
  $('#arrival_cal').change(discountHandler)
  $('#nights').change(updateDeparture)
  $('#nights').change(updateInput)
  $('#nights').change(updatePrices)
  $('#nights').change(discountHandler)
}

const updateDeparture = () => {
  const arrival_element = document.getElementById('arrival_date')
  const nights = document.getElementById('nights').value
  const departure_element = document.getElementById('departure_date')
  const arrival_date = moment(arrival_element.value.substring(4,14), 'DD/MM/YYYY')
  if (isNaN(arrival_date)) {
    return
  }
  departure_element.value = arrival_date.add(nights, 'days').format('ddd DD/MM/YYYY')
}
