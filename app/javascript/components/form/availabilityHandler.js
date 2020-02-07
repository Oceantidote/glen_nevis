import moment from 'moment'
import { anytimeHeaders } from './anytimeHeaders'

export const availabilityHandler = () => {
  $('.availability-update').on({
    input: () => {
      if (!$('#unit-dropdown').val()) return

      setTimeout(checkAvailability, 100)
    }
  })
}

export const checkAvailability = async () => {
  let ids = []
  populateIds(ids)
  const arrival = moment($('#arrival_date').val(), 'DD/MM/YYYY').format(
    'YYYY-MM-DD'
  )
  const departure = $('#departure_date').val()
  const response = await fetch('https://api.anytimebooking.eu/availability', {
    method: 'POST',
    headers: anytimeHeaders,
    body: JSON.stringify({
      from_date: arrival,
      to_date: departure,
      unit: ids
    })
  })

  const data = await response.text()

  console.log(data)
}

const populateIds = ids => {
  if ($('#subunit-dropdown').attr('disabled')) {
    ids.push(Number($('#unit-dropdown').val()))
  } else {
    $('#subunit-dropdown')
      .children()
      .each((_i, child) => {
        if (child.value) ids.push(Number(child.value))
      })
  }
}
