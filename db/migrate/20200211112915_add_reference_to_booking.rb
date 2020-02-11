class AddReferenceToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :anytime_booking_id, :integer
    add_column :bookings, :anytime_booking_reference, :integer
  end
end
