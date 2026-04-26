# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_04_26_000004) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "customers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.datetime "first_purchase_at"
    t.string "gumroad_customer_id"
    t.datetime "last_purchase_at"
    t.integer "purchase_count", default: 0
    t.integer "total_spent_cents", default: 0
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id", "email"], name: "index_customers_on_user_id_and_email", unique: true
    t.index ["user_id", "last_purchase_at"], name: "index_customers_on_user_id_and_last_purchase_at"
    t.index ["user_id", "total_spent_cents"], name: "index_customers_on_user_id_and_total_spent_cents"
    t.index ["user_id"], name: "index_customers_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "currency", default: "usd"
    t.text "description"
    t.string "gumroad_id", null: false
    t.integer "health_score", default: 50
    t.string "name", null: false
    t.string "permalink"
    t.integer "price_cents", default: 0
    t.boolean "published", default: true
    t.integer "refund_count", default: 0
    t.integer "revenue_cents", default: 0
    t.integer "sales_count", default: 0
    t.string "thumbnail_url"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.integer "views_count", default: 0
    t.index ["gumroad_id"], name: "index_products_on_gumroad_id", unique: true
    t.index ["user_id", "health_score"], name: "index_products_on_user_id_and_health_score"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "sales", force: :cascade do |t|
    t.integer "amount_cents", default: 0
    t.datetime "created_at", null: false
    t.string "currency", default: "usd"
    t.string "email"
    t.string "gumroad_sale_id", null: false
    t.bigint "product_id", null: false
    t.boolean "refunded", default: false
    t.datetime "sold_at"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["gumroad_sale_id"], name: "index_sales_on_gumroad_sale_id", unique: true
    t.index ["product_id", "refunded"], name: "index_sales_on_product_id_and_refunded"
    t.index ["product_id"], name: "index_sales_on_product_id"
    t.index ["user_id", "sold_at"], name: "index_sales_on_user_id_and_sold_at"
    t.index ["user_id"], name: "index_sales_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.text "gumroad_access_token"
    t.text "gumroad_refresh_token"
    t.string "gumroad_user_id"
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["gumroad_user_id"], name: "index_users_on_gumroad_user_id", unique: true
  end

  add_foreign_key "customers", "users"
  add_foreign_key "products", "users"
  add_foreign_key "sales", "products"
  add_foreign_key "sales", "users"
end
