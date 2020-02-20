require 'active_support'
class ApplicationController < ActionController::Base
  include Pundit

  before_action :authenticate_user!
  after_action :verify_authorized, except: :index, unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(current_user.nil? ? root_path : home_path)
  end

  private

  def skip_pundit?
    devise_controller?
  end

  def anytime_headers
    {
      Authorization: "Bearer #{ENV['ANYTIME_API_KEY']}",
      Accept: "application/json;version=1.1#{ ';sandbox' if Rails.env.development? }",
      'Content-Type': 'application/json'
    }
  end

  def default_url_options
    if Rails.env.production?
      {host: ENV['HOST']}
    else
      {}
    end
  end
end
