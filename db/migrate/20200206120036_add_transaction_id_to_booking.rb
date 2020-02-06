class AddTransactionIdToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :transaction_id, :string
  end
end
