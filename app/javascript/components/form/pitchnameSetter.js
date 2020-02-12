export const pitchnameSetter = () => {
  const subunit = document.getElementById('subunit-dropdown')
  const pitch_name = document.getElementById('pitch_name')
  subunit.addEventListener("change", (e) => {
    const kids = Array.from(subunit.children)
    const selected = kids.find(x => x.value == subunit.value)
    pitch_name.value = selected.innerHTML
  })
}
