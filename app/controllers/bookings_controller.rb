class BookingsController < ApplicationController
  skip_after_action :verify_authorized
  before_action :set_booking, only: [:print, :payment, :process_payment]

  def new
    @booking = Booking.new
    @units = unit_post([0])
    subunits = unit_post(@units.map { |unit| unit['id'] })
    attach_subunits_to_units(@units, subunits)
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

  def print
  end

  def payment
  end

  def process_payment
    to_upload = payment_upload
    response = RestClient.post('https://pi-test.sagepay.com/api/v1/transactions',
                                to_upload.to_json,
                                {
                                  Authorization: "Basic #{base64_encode_sp_creds}",
                                  'Content-type': 'application/json'
                                }
                              )
    handleResponse(JSON.parse(response.body))
  rescue => e
    redirect_to home_path
  end

  def fetch_merchant_key
    response = RestClient.post("https://pi-test.sagepay.com/api/v1/merchant-session-keys", {
                            vendorName: "#{ENV['SP_VENDOR']}"
                          }.to_json, {
                            Authorization: "Basic #{base64_encode_sp_creds}",
                            'Content-type': 'application/json'
                          })
    render json: JSON.parse(response.body)
  end

  private

  def booking_params
    params.require(:booking).permit(:first_name, :last_name, :arrival, :departure, :vehicle_reg, :adults, :children, :infants)
  end

  def set_booking
    @booking = Booking.find(params[:id])
  end

  def unit_post(parent_ids)
    response = RestClient.post('https://api.anytimebooking.eu/unit', {
      parent_id: parent_ids
  }.to_json, anytime_headers)
    JSON.parse(response.body)
  end

  def attach_subunits_to_units(units, subunits)
    units.map do |unit|
      unit['subunits'] = subunits.select { |subunit| subunit['parent_id'] == unit['id'] }
    end
  end

  def base64_encode_sp_creds
    to_encode = "#{ENV['SP_API_KEY']}:#{ENV['SP_API_PASSWORD']}"
    Base64::urlsafe_encode64(to_encode)
  end

  def payment_upload
    {
      transactionType: 'Payment',
      paymentMethod: {
        card: {
          cardIdentifier: params[:identifier],
          merchantSessionKey: params[:key]
        }
      },
      vendorTxCode: "test-#{@booking.id}-#{Time.now.strftime('%Y%m%d%H%M')}",
      amount: 1000,
      currency: 'GBP',
      description: 'Glen Nevis Holidays Booking',
      customerFirstName: @booking.first_name,
      customerLastName: @booking.last_name,
      billingAddress: {
        address1: '138 Kingsland Road',
        address2: '',
        city: 'London',
        postalCode: 'E2 8DY',
        country: 'GB'
      }
    }
  end

  def handleResponse(response)
    if (response['status']) == '3DAuth'
      # redirect to 3d secure page
      redirect_to home_path
    else
      redirect_to home_path
    end
  end
end
