import { anytimeHeaders } from './anytimeHeaders'

export const emailEntryHandler = () => {
  $('#email').keyup(async e => {
    if (e.currentTarget.value.match(/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm)) {
      const response = await fetch('https://api.anytimebooking.eu/user', {
        method: 'POST',
        headers: anytimeHeaders,
        body: JSON.stringify({
          email: e.currentTarget.value
        })
      })
      const data = await response.json()
      console.log(data)
    }
    // const data = await response.json()
    // console.log(data)
    // $('#subunit-dropdown').empty()
    // if (data.length > 0) {
    //   data.forEach(subunit => {
    //     $('#subunit-dropdown')
    //       .removeAttr('disabled')
    //       .append('<option value="" disabled selected></option>')
    //     const option = `<option value="${subunit.id}">${subunit.name}</option>`
    //     $('#subunit-dropdown').append(option)
    //   })
    // } else {
    //   $('#subunit-dropdown').attr('disabled', true)
    // }
  })
}

