class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :gumroad_id, null: false
      t.string :name, null: false
      t.text :description
      t.integer :price_cents, default: 0
      t.string :currency, default: "usd"
      t.integer :sales_count, default: 0
      t.integer :revenue_cents, default: 0
      t.integer :refund_count, default: 0
      t.integer :views_count, default: 0
      t.integer :health_score, default: 50
      t.string :permalink
      t.boolean :published, default: true
      t.string :thumbnail_url

      t.timestamps
    end

    add_index :products, :gumroad_id, unique: true
    add_index :products, [:user_id, :health_score]
  end
end
