import { anytimeHeaders } from './anytimeHeaders'
import { checkAvailability } from './availabilityHandler'
import { discountHandler } from './discountHandler'

export const unitSelectHandler = () => {
  $('#unit-dropdown').change(async e => {
    $('#category_id').val(
      $(e.currentTarget).children(`option[value="${e.currentTarget.value}"]`)[0]
        .dataset.category
    )
    const response = await fetch('https://api.anytimebooking.eu/unit', {
      method: 'POST',
      headers: anytimeHeaders,
      body: JSON.stringify({
        parent_id: [Number(e.currentTarget.value)]
      })
    })
    const data = await response.json()

    $('#subunit-dropdown').empty()
    discountHandler()
    $('#subunit-dropdown').append(
      '<option disabled value="" selected></option>'
    )
    if (data.length > 0) {
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
