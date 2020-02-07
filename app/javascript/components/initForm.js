import {
  dateHandler,
  clearFormHandler,
  postcodeSearchHandler,
  unitSelectHandler,
  emailEntryHandler
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
}
