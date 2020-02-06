class AddPaymentReferenceToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :payment_reference, :string
  end
end
