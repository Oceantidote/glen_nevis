class BookingsController < ApplicationController
  skip_after_action :verify_authorized
  skip_before_action :authenticate_user!, only: [:callback, :iframe_redirect]
  protect_from_forgery except: [:callback, :iframe_redirect]
  before_action :allow_iframe_requests if Rails.env.development?
  before_action :set_booking, only: [:print, :payment, :process_payment, :secure, :secure_form, :callback, :iframe_redirect, :show]



  def new
    @countries = COUNTRIES
    @booking = Booking.new
    @categories = category_get.reverse
    @referrals = referrals_get.reverse
    @discounts = discounts_post.to_json
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
      data = booking_put
      @booking.update(anytime_booking_id: data['booking_id'], anytime_booking_reference: data['booking_ref'])
      if !@booking.payment_type.match?(/paid/)
        redirect_to payment_booking_path(@booking)
      else
        payment_put
        redirect_to booking_path(@booking)
      end
    else
      @categories = category_get.reverse
      @referrals = referrals_get.reverse
      @units = unit_post([0])
      @discounts = discounts_post.to_json
      @extras = extras_get.to_json
      @prices = extras_prices_post.to_json
      @mid_year = Date.today.beginning_of_year + 6.months
      attach_units_to_categories(@categories, @units)
      render :new
    end
  end

  def show
    @units = unit_post([0])
    @booking_unit = @units.find{|r| r['id'] == @booking.unit_id}['name']
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
    @hide_navbar = true
  end

  def callback
    RestClient.post("https://pi-test.sagepay.com/api/v1/transactions/#{@booking.transaction_id}/3d-secure", {
      paRes: params[:PaRes]
    }.to_json, sp_headers)
    # status = JSON.parse(response.body)['status']
    if Rails.env.production?
      payment_put
      redirect_to iframe_redirect_booking_url @booking
    else
      payment_put
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
    begin
      response = RestClient.post('https://pi-test.sagepay.com/api/v1/transactions',
                                  to_upload.to_json, sp_headers)
      handleResponse(JSON.parse(response.body))
    rescue
      flash[:notice] = "AMEX, Diners Club, JCB and Paypal are not supported payment types"
      redirect_to request.referrer
    end
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
                                    :customer_id,
                                    :print,
                                    :nights,
                                    :payment_type,
                                    :pitch_name)
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

  def payment_put
      response = RestClient.put('https://api.anytimebooking.eu/payment', @booking.to_pay.to_json, anytime_headers)
    rescue => e
      raise
  end

  def category_get
    response = RestClient.get('https://api.anytimebooking.eu/category', anytime_headers)
    JSON.parse(response.body)
  end

  def extras_get
    puts anytime_headers
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

  def discounts_post
    response = RestClient.post('https://api.anytimebooking.eu/discount', {}.to_json,
      anytime_headers)
    JSON.parse(response.body)
  end

  def referrals_get
    response = RestClient.post('https://api.anytimebooking.eu/referral',{}, anytime_headers)
    JSON.parse(response.body)
  end

  def booking_put
    response = RestClient.put('https://api.anytimebooking.eu/booking', @booking.to_submit.to_json, anytime_headers)
    JSON.parse(response.body)
  rescue => e
    raise
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
      amount: @booking.amount_to_pay,
      currency: 'GBP',
      description: 'Glen Nevis Holidays Booking',
      customerFirstName: @booking.first_name,
      customerLastName: @booking.last_name,
      billingAddress: {
        address1: @booking.address1,
        address2: @booking.address2,
        city: @booking.city,
        postalCode: @booking.postcode,
        country: ISO3166::Country.find_country_by_name(@booking.country).alpha2
      }
    }
  end

  def handleResponse(response)
    @booking.update(transaction_id: response['transactionId'])
    if (response['status']) == '3DAuth'
      redirect_to secure_booking_path @booking, pa_req: response['paReq'], acs_url: response['acsUrl']
    else
      payment_put
      redirect_to booking_path(@booking)
    end
  end

  def sp_headers
    {
      Authorization: "Basic #{base64_encode_sp_creds}",
      'Content-type': 'application/json'
    }
  end

  def convert_extras
    array = booking_params[:extras].split("|")[1..-1]&.map do |extra|
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

  COUNTRIES = [
    "United Kingdom",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo (Democratic Republic of the)",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czech Republic",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (Democratic People's Republic of)",
    "Korea (Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia (the former Yugoslav Republic of)",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United States Minor Outlying Islands",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands"
  ]
end
