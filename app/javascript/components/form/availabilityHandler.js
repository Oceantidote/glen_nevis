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
  if (!departure) return
  const response = await fetch('https://api.anytimebooking.eu/availability', {
    method: 'POST',
    headers: anytimeHeaders,
    body: JSON.stringify({
      from_date: arrival,
      to_date: departure,
      unit: ids
    })
  })

  const data = await response.json()

  updateAvailabilities(data)
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

const updateAvailabilities = data => {
  $('.unit-availability-holder').empty()
  if ($('#subunit-dropdown').attr('disabled')) {
    if (data.length === 0 || data.find(avail => avail.level === 0)) {
      $('.unit-availability-holder').append('<h6>Unit Unavailable</h6>')
    }
  } else {
    $('#subunit-dropdown')
      .children('option')
      .each((_i, option) => {
        if (!option.value) return
        const unitData = data.filter(
          avail => avail.unit_id === Number(option.value)
        )
        if (
          unitData.length === 0 ||
          unitData.find(avail => avail.level === 0)
        ) {
          const text = option.textContent
          if (text.match(/unavailable/)) return
          $(option)
            .attr('disabled', true)
            .text(`${text} -unavailable-`)
        } else {
          const text = option.textContent
            .replace(/\s\-unavailable\-/, '')
            .trim()
          $(option)
            .removeAttr('disabled')
            .text(text)
        }
      })
  }
}
