import { anytimeHeaders } from './anytimeHeaders'
import { checkAvailability } from './availabilityHandler'

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

    $('#subunit-dropdown').empty()
    if (data.length > 0) {
      $('#subunit-dropdown').append(
        '<option value="" disabled selected></option>'
      )
      data.forEach(subunit => {
        $('#subunit-dropdown').removeAttr('disabled')
        const option = `<option value="${subunit.id}">${subunit.name}</option>`
        $('#subunit-dropdown').append(option)
      })
    } else {
      $('#subunit-dropdown').attr('disabled', true)
    }

    checkAvailability()
  })
}
