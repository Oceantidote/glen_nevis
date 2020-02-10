class AddHousekeepingNoteToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :housekeeping_note, :string
  end
end
