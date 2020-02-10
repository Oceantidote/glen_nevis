class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg

  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end

  def set_payment_reference
    self.update(payment_reference: "test-#{id}-#{Time.now.strftime('%Y%m%d%H%M')}")
  end

  def to_submit
    hash= {
      base: {
        site_id: 0,
        category_id: category_id,
        unit_id: subunit_id || unit_id,
        arrival: arrival.strftime('%Y-%m-%d'),
        departure: departure.strftime('%Y-%m-%d'),
        referral_id: marketing_source_id,
        party_size: adults + children + infants,
      }, cost: {
        base_cost: base_cents/100.to_f,
        party_cost: party_cents/100.to_f,
        addon_cost: add_on_cents/100.to_f,
        discount_cost: discount_cents/100.to_f,
        total_cost: price_cents/100.to_f,
      }, payment: {
        amount: price_cents/100.to_f,
        type: 1
      }
    }
    add_customer(hash)
    hash
  end

  def add_customer(hash)
    hash[:customer] = {
      first_name: first_name,
      last_name: last_name,
      address1: address1,
      address2: address2,
      zip: postcode,
      state:  county,
      country: ISO3166::Country.find_country_by_name(country).alpha2,
      phone: home_phone,
      mobile: mobile_phone
    }
  end
end
