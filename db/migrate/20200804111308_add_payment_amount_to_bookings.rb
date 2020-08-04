class AddPaymentAmountToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :payment_amount, :string
  end
end
