class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg
  validates :arrival, :departure, :first_name, :last_name, :unit_id, :email, :postcode, :address1, :country, :base_cents, :party_cents, :add_on_cents, :discount_cents, :price_cents, presence: true
  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end

  def set_payment_reference
    self.update(payment_reference: "AQB-#{id}-#{Time.now.strftime('%Y%m%d%H%M')}")
  end

  def amount_to_pay
    if payment_type.match?(/deposit/)
      500
    else
      price_cents
    end
  end

  def to_submit
    hash= {
      base: {
        custom_ref: "AQB#{id}",
        site_id: 0,
        telephone_flag: 1,
        agent: 0,
        provisional_flag: false,
        category_id: category_id,
        unit_id: subunit_id || unit_id,
        arrival: arrival.strftime('%Y-%m-%d'),
        balance_due: arrival.strftime('%Y-%m-%d'),
        departure: departure.strftime('%Y-%m-%d'),
        referral_id: marketing_source_id,
        party_size: adults + children + infants,
        note: "Customer: #{customer_note}, Admin: #{admin_note}, Housekeeping: #{housekeeping_note}"
      },
      customer: add_customer,
      cost: {
        base_cost: base_cents/100.to_f,
        agent_fee: 0,
        party_cost: party_cents/100.to_f,
        addon_cost: add_on_cents/100.to_f,
        discount_cost: discount_cents/100.to_f,
        total_cost: price_cents/100.to_f,
      },
      extras: JSON.parse(extras)
    }
  end

  def to_pay
    hash= {
      payment: {
        send_email: 1,
        booking_id: anytime_booking_id,
        amount: payment_type.match?('deposit') ? 5.00 : price_cents/100.to_f,
        type: payment_type.match?('deposit') ? 1 : 2,
        payment_method_id: payment_type.match?('card') ? 1 : 3,
        note: payment_type
      }
    }
  end

  def add_customer
    if customer_id.nil?
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        address1: address1,
        address2: address2,
        city: city,
        zip: postcode,
        state:  county,
        country: ISO3166::Country.find_country_by_name(country).alpha2,
        phone: home_phone,
        mobile: mobile_phone
      }
    else
      {
        id: customer_id
      }
    end
  end
end
