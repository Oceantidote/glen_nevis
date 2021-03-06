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
    Dog: [0, 1, 2, 3, 4, 5],
    'Cleaning Charge': [1],
    Gazebo: [0, 1, 2, 3, 4, 5],
    'Booking Fee': [1, 0],
    'Tent Size': ['Small', 'Medium', 'Large'],
    Motorbike: [0, 1, 2, 3, 4, 5],
    'Number of Tents': [1, 2, 3, 4, 5, 6, 7, 8],
    MOTORBIKE: [0, 1, 2, 3, 4, 5],
    'Additional Tent': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    'Pup Tent': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    'Additional Car': [0, 1, 2, 3, 4, 5]
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
      const sel_length = types[ele['name']].length > 0
      const select = `<select class="addon-select ui fluid dropdown">${types[ele['name']].map(
        x => `<option value=${x}>${x}</option>`
      )}</select>`
      let addon_form = `<div class='addon field' data-id='${
        ele['id']
      }' data-rate='${rate}'><label class='addon-name'>${
        ele['name']
      }</label>${
        formatted_rate == '£0.00' ? '£0.00' : formatted_rate
      }${sel_length ? select : ''}</div>`
      $('#addons').append(addon_form)
    })
    updateInput()
    updatePrices()
    $('.addon-select').on('change', function(e) {
      updatePrices()
      updateInput()
    })
  })
}
