class AddFieldsToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :print, :boolean
    add_column :bookings, :nights, :integer
  end
end
