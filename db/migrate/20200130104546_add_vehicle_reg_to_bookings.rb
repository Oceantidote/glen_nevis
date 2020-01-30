class AddVehicleRegToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :vehicle_reg, :string
  end
end
