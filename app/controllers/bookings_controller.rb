class BookingsController < ApplicationController
  skip_after_action :verify_authorized
  skip_before_action :authenticate_user!, only: [:callback, :iframe_redirect]
  protect_from_forgery except: [:callback, :iframe_redirect]
  before_action :allow_iframe_requests if Rails.env.development?
  before_action :set_booking, only: [:print, :payment, :process_payment, :secure, :secure_form, :callback, :iframe_redirect, :show]

  def new
    @booking = Booking.new
    @categories = category_get.reverse
    @agents = agents_get.reverse
    @units = unit_post([0])
    @extras = extras_get.to_json
    @prices = extras_prices_post.to_json
    @mid_year = Date.today.beginning_of_year + 6.months
    attach_units_to_categories(@categories, @units)
  end

  def create
    @booking = Booking.new(booking_params)
    @booking.extras = convert_extras
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

  def show
    if @booking.transaction_id.present?
      response = RestClient.get("https://pi-test.sagepay.com/api/v1/transactions/#{@booking.transaction_id}", sp_headers)
      @payment_response = JSON.parse(response)
    end
  end

  def print
  end

  def payment
  end

  def iframe_redirect
  end

  def callback
    RestClient.post("https://pi-test.sagepay.com/api/v1/transactions/#{@booking.transaction_id}/3d-secure", {
      paRes: params[:PaRes]
    }.to_json, sp_headers)
    # status = JSON.parse(response.body)['status']
    if Rails.env.production?
      redirect_to iframe_redirect_booking_url @booking
    else
      redirect_to iframe_redirect_booking_path @booking
    end
  end

  def secure
    @url = params[:acs_url]
    @pa_req = params[:pa_req]
  end

  def secure_form
    @url = params[:acs_url]
    @pa_req = params[:pa_req]
    @hide_navbar = true
  end

  def process_payment
    @booking.set_payment_reference
    to_upload = payment_upload
    response = RestClient.post('https://pi-test.sagepay.com/api/v1/transactions',
                                to_upload.to_json, sp_headers)
    handleResponse(JSON.parse(response.body))
  # rescue => e
  #   redirect_to home_path
  end

  def fetch_merchant_key
    response = RestClient.post("https://pi-test.sagepay.com/api/v1/merchant-session-keys", {
                            vendorName: "#{ENV['SP_VENDOR']}"
                          }.to_json, sp_headers)
    render json: JSON.parse(response.body)
  end

  private

  def booking_params
    params.require(:booking).permit(:first_name,
                                    :last_name,
                                    :email,
                                    :arrival,
                                    :departure,
                                    :vehicle_reg,
                                    :adults,
                                    :children,
                                    :infants,
                                    :base_cents,
                                    :party_cents,
                                    :add_on_cents,
                                    :discount_cents,
                                    :price_cents,
                                    :unit_id,
                                    :subunit_id,
                                    :category_id,
                                    :marketing_source_id,
                                    :address1,
                                    :address2,
                                    :postcode,
                                    :extras,
                                    :city,
                                    :county,
                                    :country,
                                    :mobile_phone,
                                    :work_phone,
                                    :home_phone,
                                    :gdpr,
                                    :customer_note,
                                    :admin_note,
                                    :housekeeping_note,
                                    :customer_id)
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

  def category_get
    response = RestClient.get('https://api.anytimebooking.eu/category', anytime_headers)
    JSON.parse(response.body)
  end

  def extras_get
    response = RestClient.get('https://api.anytimebooking.eu/extras', anytime_headers)
    JSON.parse(response.body)
  end

  def extras_prices_post
    response = RestClient.post('https://api.anytimebooking.eu/extras/pricing', {
      from_date: Date.today.beginning_of_year,
      to_date: Date.today.end_of_year }.to_json,
      anytime_headers)
    JSON.parse(response.body)
  end

  def agents_get
    response = RestClient.get('https://api.anytimebooking.eu/agent', anytime_headers)
    JSON.parse(response.body)
  end

  def booking_put
    response = RestClient.put('https://api.anytimebooking.eu/booking', @booking.to_submit.to_json, anytime_headers)
    JSON.parse(response.body)
  end

  def attach_units_to_categories(categories, units)
    categories.map do |category|
      category['units'] = units.select { |unit| unit['category_id'] == category['id'] }
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
      vendorTxCode: @booking.payment_reference,
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
    @booking.update(transaction_id: response['transactionId'])
    if (response['status']) == '3DAuth'
      redirect_to secure_booking_path @booking, pa_req: response['paReq'], acs_url: response['acsUrl']
    else
      redirect_to home_path
    end
  end

  def sp_headers
    {
      Authorization: "Basic #{base64_encode_sp_creds}",
      'Content-type': 'application/json'
    }
  end

  def convert_extras
    array = booking_params[:extras].split("|")[1..-1].map do |extra|
      values = extra.split(',')
      value = (values[1].to_i != 0 && values[1] != "0") || values[1] == "0" ? values[1].to_i : values[1]
      { extra_id: values[0], value: value, cost: values[2].to_f }
    end
    array.to_json
  end

  def allow_iframe_requests
    def allow_iframe_requests
      response.headers.delete('X-Frame-Options')
    end
  end
end
