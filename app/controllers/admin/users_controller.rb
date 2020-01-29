class Admin::UsersController < ApplicationController
  before_action :set_user, only: [:edit, :update, :destroy]

  def new
    @user = User.new
    authorize [:admin, @user]
  end

  def create
    @user = User.new(user_params)
    authorize [:admin, @user]
    if @user.save
      redirect_to admin_root_path
    else
      render :new
    end
  end

  def edit
  end

  def update
    if params.dig(:user, :password).blank?
      if @user.update(email: params.dig(:user, :email))
        redirect_to admin_root_path
      else
        render :edit
      end
    else
      if @user.update(user_params)
        redirect_to admin_root_path
      else
        render :edit
      end
    end
  end

  def destroy
    if @user.admin?
      redirect_to admin_root_path, notice: 'You can\'t delete the admin user'
    else
      @user.destroy
      redirect_to admin_root_path
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def set_user
    @user = User.find(params[:id])
    authorize [:admin, @user]
  end
end
