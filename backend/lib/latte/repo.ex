defmodule Latte.Repo do
  use Ecto.Repo,
    otp_app: :latte,
    adapter: Ecto.Adapters.Postgres
end
