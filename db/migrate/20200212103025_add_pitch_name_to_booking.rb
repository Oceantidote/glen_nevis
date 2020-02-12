class AddPitchNameToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :pitch_name, :string
  end
end
