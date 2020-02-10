import flatpickr from 'flatpickr'
import moment from 'moment'
import { updatePrices } from './updatePrices'
import { updateInput } from './updateInput'

export const dateHandler = () => {
  flatpickr('#arrival_date', {
    dateFormat: 'd/m/Y',
    minDate: Date.now()
  })
  $('#arrival_cal').change(updateDeparture)
  $('#arrival_cal').change(updatePrices)
  $('#arrival_cal').change(updateInput)
  $('#nights').change(updateDeparture)
  $('#nights').change(updateInput)
  $('#nights').change(updatePrices)
}

const updateDeparture = () => {
  const arrival_element = document.getElementById('arrival_date')
  const nights = document.getElementById('nights').value
  const departure_element = document.getElementById('departure_date')
  const arrival_date = moment(arrival_element.value, 'DD/MM/YYYY')
  if (isNaN(arrival_date)) {
    return
  }
  departure_element.value = arrival_date.format('YYYY-MM-DD')
  departure_element.stepUp(nights)
}
