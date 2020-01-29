class CreateBookings < ActiveRecord::Migration[6.0]
  def change
    create_table :bookings do |t|
      t.datetime :arrival
      t.datetime :departure
      t.string :first_name
      t.string :last_name

      t.timestamps
    end
  end
end
