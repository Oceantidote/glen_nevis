export const postcodeButtonEnabler = () => {
  $("#postcode").keyup(e => {
    document.getElementById('address-holder').innerHTML = ""
    if (e.currentTarget.value.length >= 5 ) {
      document.getElementById('find_address').classList.remove("disabled")
    }
    if (e.currentTarget.value.length < 5 ) {
      document.getElementById('find_address').classList.add("disabled")
    }
  })
  $("#postcode").change(e => {
    document.getElementById('address-holder').innerHTML = ""
    if (e.currentTarget.value.length >= 5 ) {
      document.getElementById('find_address').classList.remove("disabled")
    }
    if (e.currentTarget.value.length < 5 ) {
      document.getElementById('find_address').classList.add("disabled")
    }
  })
}
