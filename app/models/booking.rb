class Booking < ApplicationRecord
  before_create :upcase_vehicle_reg

  def upcase_vehicle_reg
    self[:vehicle_reg] = vehicle_reg.upcase
  end
end
