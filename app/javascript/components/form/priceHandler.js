import { anytimeHeaders } from './anytimeHeaders'
import { priceFormatter } from './priceFormatter'

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
    document.getElementById('base').innerHTML = priceFormatter.format(data[0]['rate'])
    console.log(data[0]['rate'])
  })
}

