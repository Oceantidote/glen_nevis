import { priceFormatter } from './priceFormatter'
import { updateInput } from './updateInput'
import { updatePrices } from './updatePrices'
export const extrasHandler = () => {
  const extras = $('#extras').data('extras')
  const prices = $('#extras').data('prices')
  let addons = []
  const types = {
    'Type of unit': ['Caravan', 'Motorhome', 'Campervan', 'Trailer Tent'],
    'Extra Car': [0, 1, 2, 3, 4, 5],
    Dog: [1, 2, 3, 4, 5],
    'Cleaning Charge': [1],
    Gazebo: [1, 2, 3, 4, 5],
    'Booking Fee': [1],
    'Tent Size': [1, 2, 3, 4, 5, 6, 7, 8, 9],
    Motorbike: [1, 2, 3, 4, 5],
    'Number of Tents': [1, 2, 3, 4, 5, 6, 7, 8],
    MOTORBIKE: [1, 2, 3, 4, 5],
    'Additional Tent': [1, 2, 3, 4, 5, 6, 7, 8, 9],
    'Additional Car': [1, 2, 3, 4, 5]
  }
  $('#unit-dropdown').change(e => {
    $('#addons').html('')
    addons = extras.filter(x => x['unit_id'] == e.currentTarget.value)
    addons.forEach(ele => {
      const arrival = $('#arrival_date').val() || $('#extras').data('date')
      const price_find = prices.find(x => x['id'] == ele['id'])['rates']
      const price =
        price_find.find(x => x['day'] <= arrival && x['day2'] >= arrival) ||
        price_find[0]
      const rate = price ? price['rate'] * 100 : 0
      const formatted_rate = priceFormatter.format(rate / 100)
      const checkbox = `<input class='addon-checkbox' type='checkbox' ${
        ele['mandatory_flag'] == 1 ? 'checked' : ''
      }></input>`
      const sel_length = types[ele['name']].length > 0
      const select = `<select class="addon-select">${types[ele['name']].map(
        x => `<option value=${x}>${x}</option>`
      )}</select>`
      let addon_form = `<div class='addon' data-id='${
        ele['id']
      }' data-rate='${rate}'><div class='addon-lhs'><div class='addon-name'>${
        ele['name']
      }</div><div class='addon-desc'>${
        ele['description']
      }</div></div><div class='addon-rhs'>${checkbox}${
        sel_length ? select : ''
      }${formatted_rate == '£0.00' ? '' : formatted_rate}</div></div>`
      $('#addons').append(addon_form)
    })
    updatePrices()
    $('.addon-select').on('change', function(e) {
      updatePrices()
      updateInput()
    })
    $('.addon-checkbox').on('change', function(e) {
      updatePrices()
      updateInput()
    })
  })
}

