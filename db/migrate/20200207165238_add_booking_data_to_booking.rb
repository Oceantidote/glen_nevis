class AddBookingDataToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :unit_id, :integer
    add_column :bookings, :subunit_id, :integer
    add_column :bookings, :price_cents, :integer
    add_column :bookings, :payment_type, :string
    add_column :bookings, :marketing_source_id, :integer
    add_column :bookings, :email, :string
    add_column :bookings, :postcode, :string
    add_column :bookings, :address1, :string
    add_column :bookings, :address2, :string
    add_column :bookings, :city, :string
    add_column :bookings, :county, :string
    add_column :bookings, :country, :string
    add_column :bookings, :mobile_phone, :string
    add_column :bookings, :home_phone, :string
    add_column :bookings, :work_phone, :string
    add_column :bookings, :gdpr, :boolean
    add_column :bookings, :customer_note, :string
    add_column :bookings, :admin_note, :string
  end
end
