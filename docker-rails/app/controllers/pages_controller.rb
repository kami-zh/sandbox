class PagesController < ApplicationController
  def home
    binding.pry
    head :ok
  end
end
