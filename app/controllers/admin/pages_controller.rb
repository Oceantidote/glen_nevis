class Admin::PagesController < ApplicationController
  def home
    authorize [:admin, current_user]
    @users = policy_scope([:admin, User])
  end
end
