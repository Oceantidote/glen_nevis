class AddPeopleToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :adults, :integer
    add_column :bookings, :children, :integer
    add_column :bookings, :infants, :integer
  end
end
