const discounts = $('#quick_book').data("discounts")

export const discountHandler = () => {
  const arrival = $('#arrival_date').val()
  const departure = $('#departure_date').val()
  const unit = $('#unit-dropdown').val()
  console.log(arrival)
  console.log(departure)
  console.log(unit)
  const discount_matches = discounts.filter( x => x.units.includes(parseInt(unit)))
  console.log(discount_matches)
}
