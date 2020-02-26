import { anytimeHeaders } from './anytimeHeaders'
import { priceFormatter } from './priceFormatter'
import moment from 'moment'
import twix from 'twix'

export const priceHandler = () => {
  $('#unit-dropdown').change(async e => {
    const response = await fetch('https://api.anytimebooking.eu/price', {
      method: 'POST',
      headers: anytimeHeaders,
      body: JSON.stringify({
        unit_id: [Number(e.currentTarget.value)]
      })
    })
    const data = await response.json()
    dealWithData(data)
  })
}

export const datePriceHandler = () => {
  $('#arrival_date').on('change', async function(e) {
    let unit_id = $('#unit-dropdown').val()
    if (unit_id) {
      const response = await fetch('https://api.anytimebooking.eu/price', {
        method: 'POST',
        headers: anytimeHeaders,
        body: JSON.stringify({
          unit_id: [Number(unit_id)]
        })
      })
      const data = await response.json()
      dealWithData(data)
    }
  })
  $('#nights').on('change', async function(e) {
    let unit_id = $('#unit-dropdown').val()
    if (unit_id) {
      const response = await fetch('https://api.anytimebooking.eu/price', {
        method: 'POST',
        headers: anytimeHeaders,
        body: JSON.stringify({
          unit_id: [Number(unit_id)]
        })
      })
      const data = await response.json()
      dealWithData(data)
    }
  })
}

const dealWithData = data => {
  const arrival = moment($('#arrival_date').val(), 'DD/MM/YYYY').format(
    'YYYY-MM-DD'
  )
  const departure = $('#departure_date').val()
  var itr = moment.twix(new Date(arrival), new Date(departure)).iterate('days')
  var range = []
  while (itr.hasNext()) {
    range.push(itr.next().toDate())
  }
  range.pop()
  let prices = []
  range.forEach(date => {
    let price = data.filter(
      x => new Date(new Date(x['day']) - 3600000) <= new Date(date) && new Date(x['day2']) >= new Date(date)
    )
    try {
      prices.push(price[0]['rate'])
    } catch {
      prices.push(data[0]['rate'])
    }
  })
  let sum = prices.reduce((a, b) => a + b, 0)
  document.getElementById('base').innerHTML = priceFormatter.format(sum)
  $('#base').val(sum * 100)
  $('#base_cents').val(sum * 100)
}
