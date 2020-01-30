export const postcodeSearchHandler = () => {
  $('#find_address').click(e => {
    e.preventDefault()
    const postcode = $('#postcode').val()
    $.post(
      'https://api.addressy.com/Capture/Interactive/Find/v1.10/json3.ws',
      {
        Key: process.env.LOQATE_API_KEY,
        Text: postcode
      },
      handlePostcodeFindResponse
    )
  })
}

const handlePostcodeFindResponse = ({ Items }) => {
  if (Items.length < 1) {
    // Respond to nothing found
  } else {
    const { Id, Text } = Items[0]
    $.post(
      'https://api.addressy.com/Capture/Interactive/Find/v1.10/json3.ws',
      {
        Key: process.env.LOQATE_API_KEY,
        Text,
        Container: Id
      },
      handleAddressFindResponse
    )
  }
}

const handleAddressFindResponse = ({ Items }) => {
  Items.forEach(({ Text, Id, Type }) => {
    let button = $('<button></button>')
      .text(Text)
      .addClass(['fluid', 'ui', 'primary', 'button', 'loqate-btn'])
    $(button).click(e => {
      e.preventDefault()
      retrieveAddress(Id, Text, Type)
    })
    $('.address-holder').append(button)
  })
}

const retrieveAddress = (Id, Text, Type) => {
  if (Type === 'Address') {
    $.post(
      'https://api.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws',
      {
        Key: process.env.LOQATE_API_KEY,
        Id
      },
      updateAddressInformation
    )
  } else {
    handlePostcodeFindResponse([{ Id, Text }])
  }
}

const updateAddressInformation = ({ Items }) => {
  const { Line1, Line2, City, ProvinceName, CountryName } = Items[0]
  $('#address_1').val(Line1)
  $('#address_2').val(Line2)
  $('#city').val(City)
  $('#county').val(ProvinceName)
  $('#country').val(CountryName)
  $('.address-holder').empty()
}
