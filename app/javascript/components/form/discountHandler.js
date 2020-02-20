import moment from 'moment'
import { priceFormatter } from './priceFormatter'
const discounts = $('#quick_book').data("discounts")

export const discountHandler = () => {
  setTimeout(() => {
    const arrival = moment($('#arrival_date').val(), 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    )
    const departure = $('#departure_date').val()
    const unit = $('#unit-dropdown').val()
    const nights = $('#nights').val()
    const discount_matches = discounts.filter( x => x.units.includes(parseInt(unit)) && x.dates.some( y => y.date_from <= arrival && y.date_to >= departure))
    const type_four = discount_matches.filter( x => x.details.type == 4 )
    const correct = type_four.filter( x => x.details.duration_from == parseInt(nights))
    const base = $('#base_cents').val()
    const party = $('#party_cents').val()
    const discount_hidden = $('#discount_cents')
    const discount_show = $('#discount')
    if (correct.length > 0) {
      const free_days = correct[0].details.duration_from - correct[0].details.duration_to
      const discount_percentage = free_days / correct[0].details.duration_from
      const discount = (parseInt(base) * discount_percentage) + (parseInt(party) * discount_percentage)
      const ceil_discount = Math.floor(discount / 50) * 50;
      discount_hidden.val(ceil_discount)
      discount_show.html(priceFormatter.format(ceil_discount / 100))
    } else {
      discount_hidden.val(0)
      discount_show.html('£0.00')
    }
  }, 400)
}
