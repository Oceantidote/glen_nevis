export const extrasHandler = () => {
  const extras = $('#extras').data('extras')
  let addons = []
  $('#unit-dropdown').change(e => {
    $('#addons').html("")
    addons = extras.filter(x => x['unit_id'] == e.currentTarget.value )
    addons.forEach(ele => {
      let addon_form = "<div class='btn btn-primary addon'><div class='addon-desc'></div></div>"
      $('#addons').append(addon_form)
    })
  })
}
