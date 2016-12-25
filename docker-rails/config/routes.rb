Rails.application.routes.draw do
  resources :posts, only: :show

  root 'pages#home'
end
