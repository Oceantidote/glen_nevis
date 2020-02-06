class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg

  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end

  def set_payment_reference
    self.update(payment_reference: "test-#{id}-#{Time.now.strftime('%Y%m%d%H%M')}")
  end
end
