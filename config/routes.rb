Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :passwords]
  authenticated :user do
    root 'pages#home', as: :home
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
