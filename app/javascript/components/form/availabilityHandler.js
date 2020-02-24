import moment from 'moment'
import { anytimeHeaders } from './anytimeHeaders'

export const availabilityHandler = () => {
  $('.availability-update').on({
    input: () => {
      if (!$('#unit-dropdown').val()) return

      checkAvailability()
    }
  })
}

export const checkAvailability = async () => {
  let ids = []
  populateIds(ids)
  const arrival = moment($('#arrival_date').val(), 'DD/MM/YYYY').format(
    'YYYY-MM-DD'
  )

  const nights = $('#nights').val()
  const departure = moment(arrival)
    .add(nights - 1, 'd')
    .format('YYYY-MM-DD')

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
  // console.log(data.length)
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
          $(option)
            .attr('disabled', true)
            .attr('hidden', true)
        } else {
          $(option)
            .removeAttr('disabled')
            .removeAttr('hidden')
        }
      })

    const option = $('#subunit-dropdown')
      .children('option[value]:not([disabled])')
      .sort(() => 0.5 - Math.random())[0]

    if (!option) return

    // console.log(option)
    // console.log(option.value)
    $('#subunit-dropdown').val(option.value)
    $('#pitch_name').val(option.innerHTML)
  }
}
