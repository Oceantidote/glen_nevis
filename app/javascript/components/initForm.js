import {
  dateHandler,
  clearFormHandler,
  postcodeSearchHandler,
  unitSelectHandler,
  availabilityHandler,
  emailEntryHandler,
  postcodeButtonEnabler,
  priceHandler,
  totalUpdater,
  extrasHandler,
  datePriceHandler,
  partyHandler,
  errorRemover,
  frontEndValidator,
  pitchnameSetter
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
  availabilityHandler()
  postcodeButtonEnabler()
  priceHandler()
  totalUpdater()
  extrasHandler()
  datePriceHandler()
  partyHandler()
  errorRemover()
  frontEndValidator()
  pitchnameSetter()
}
