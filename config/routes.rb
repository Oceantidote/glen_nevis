Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :passwords]
  resources :bookings, only: [:new, :create, :show] do
    member do
      get :print
      get :payment
      post :payment, to: 'bookings#process_payment'
      get :secure
      get :secure_form
      post :callback
      get :iframe_redirect
    end
    collection do
      get :fetch_merchant_key
    end
  end
  authenticated :user do
    root 'bookings#new', as: :home
  end
  namespace :admin do
    resources :users, except: [:index]
    root 'pages#home'
  end
  devise_scope :user do
    root 'devise/sessions#new'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
