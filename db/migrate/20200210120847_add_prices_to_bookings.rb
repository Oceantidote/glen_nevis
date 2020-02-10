class AddPricesToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :base_cents, :integer
    add_column :bookings, :party_cents, :integer
    add_column :bookings, :add_on_cents, :integer
    add_column :bookings, :discount_cents, :integer
  end
end
