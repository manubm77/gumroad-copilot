class CreateSales < ActiveRecord::Migration[8.1]
  def change
    create_table :sales do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.string :gumroad_sale_id, null: false
      t.string :email
      t.integer :amount_cents, default: 0
      t.string :currency, default: "usd"
      t.boolean :refunded, default: false
      t.datetime :sold_at

      t.timestamps
    end

    add_index :sales, :gumroad_sale_id, unique: true
    add_index :sales, [:user_id, :sold_at]
    add_index :sales, [:product_id, :refunded]
  end
end
