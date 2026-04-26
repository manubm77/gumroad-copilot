class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.references :user, null: false, foreign_key: true
      t.string :gumroad_customer_id
      t.string :email, null: false
      t.integer :total_spent_cents, default: 0
      t.integer :purchase_count, default: 0
      t.datetime :first_purchase_at
      t.datetime :last_purchase_at

      t.timestamps
    end

    add_index :customers, [:user_id, :email], unique: true
    add_index :customers, [:user_id, :total_spent_cents]
    add_index :customers, [:user_id, :last_purchase_at]
  end
end
