class BookingsController < ApplicationController
  skip_after_action :verify_authorized

  def new
  end
end
