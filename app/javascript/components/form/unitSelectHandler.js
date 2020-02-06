import { anytimeHeaders } from './anytimeHeaders'

export const unitSelectHandler = () => {
  $('#unit-dropdown').change(async e => {
    const response = await fetch('https://api.anytimebooking.eu/unit', {
      method: 'POST',
      headers: anytimeHeaders,
      body: JSON.stringify({
        parent_id: [Number(e.currentTarget.value)]
      })
    })
    const data = await response.json()

    console.log(data)
  })
}
