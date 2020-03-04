import { anytimeHeaders } from './anytimeHeaders'
import { handlePostcodeFindResponse } from './postcodeSearchHandler'

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
      try {
        const email_response = await response.json()
        $('#customer_id').val(email_response['id'])
        const response_two = await fetch(`https://api.anytimebooking.eu/user/${email_response["id"]}`, {
          method: 'GET',
          headers: anytimeHeaders
        })
        const user_response = await response_two.json()
        $('#postcode').val(user_response['zip'])
        $.post(
          'https://api.addressy.com/Capture/Interactive/Find/v1.10/json3.ws',
          {
            Key: process.env.LOQATE_API_KEY,
            Text: user_response['zip']
          },
          handlePostcodeFindResponse
        )
      }
      catch {
        try {
          document.querySelectorAll('.loqate-btn').forEach((i) => {
            i.remove()
          })
        }
        catch {

        }
      }
    }
  })
}

