class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg

  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end

  def set_payment_reference
    self.update(payment_reference: "test-#{id}-#{Time.now.strftime('%Y%m%d%H%M')}")
  end

  def to_submit
    {
      base: {
        site_id: 0,
        category_id: category_id,
        unit_id: subunit_id || unit_id,
        arrival: arrival.strftime('%Y-%m-%d'),
        departure: departure.strftime('%Y-%m-%d'),
        referral_id: marketing_source_id,
        party_size: adults + children + infants,
      }
    }
  end
end
