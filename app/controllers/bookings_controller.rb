class BookingsController < ApplicationController
  skip_after_action :verify_authorized

  def new
    @booking = Booking.new
  end

  def create
    @booking = Booking.new(booking_params)
    if @booking.save
      if params.dig(:booking, :print) == 'true'
        redirect_to print_booking_path(@booking)
      else
        redirect_to home_path
      end
    else
      render :new
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:first_name, :last_name, :arrival, :departure)
  end
end
