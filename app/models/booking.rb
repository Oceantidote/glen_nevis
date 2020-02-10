class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg
  validates :arrival, :departure, :first_name, :last_name, :unit_id, :subunit_id, :email, :postcode, :address1, :country, :base_cents, :party_cents, :add_on_cents, :discount_cents, :price_cents, presence: true
  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end

  def set_payment_reference
    self.update(payment_reference: "test-#{id}-#{Time.now.strftime('%Y%m%d%H%M')}")
  end
end
