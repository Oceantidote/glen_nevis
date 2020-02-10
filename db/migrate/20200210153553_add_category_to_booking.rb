class AddCategoryToBooking < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :category_id, :integer
  end
end
