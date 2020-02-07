import {
  dateHandler,
  clearFormHandler,
  postcodeSearchHandler,
  unitSelectHandler,
  emailEntryHandler,
  postcodeButtonEnabler,
  priceHandler
} from './form'

export const initForm = () => {
  const form = document.getElementById('quick_book')
  if (!form) {
    return
  }
  emailEntryHandler()
  dateHandler()
  clearFormHandler()
  postcodeSearchHandler()
  unitSelectHandler()
  postcodeButtonEnabler()
  priceHandler()
}
