class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :name
      t.string :avatar_url
      t.string :gumroad_user_id
      t.text :gumroad_access_token
      t.text :gumroad_refresh_token

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :gumroad_user_id, unique: true
  end
end
