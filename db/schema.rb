# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_10_180014) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bookings", force: :cascade do |t|
    t.datetime "arrival"
    t.datetime "departure"
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "vehicle_reg"
    t.integer "adults"
    t.integer "children"
    t.integer "infants"
    t.string "payment_reference"
    t.string "transaction_id"
    t.integer "unit_id"
    t.integer "subunit_id"
    t.integer "price_cents"
    t.string "payment_type"
    t.integer "marketing_source_id"
    t.string "email"
    t.string "postcode"
    t.string "address1"
    t.string "address2"
    t.string "city"
    t.string "county"
    t.string "country"
    t.string "mobile_phone"
    t.string "home_phone"
    t.string "work_phone"
    t.boolean "gdpr"
    t.string "customer_note"
    t.string "admin_note"
    t.integer "base_cents"
    t.integer "party_cents"
    t.integer "add_on_cents"
    t.integer "discount_cents"
    t.string "housekeeping_note"
    t.string "extras"
    t.integer "customer_id"
    t.integer "category_id"
    t.boolean "print"
    t.integer "nights"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
