class Admin::UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        raise Pundit::NotAuthorizedError
      end
    end
  end

  def home?
    user.admin?
  end

  def new?
    home?
  end

  def create?
    home?
  end

  def edit?
    home?
  end

  def update?
    home?
  end

  def destroy?
    home?
  end
end
