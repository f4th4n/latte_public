defmodule LatteWeb.Router do
  use LatteWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", LatteWeb do
    pipe_through :api
  end

  post "/product", LatteWeb.Controllers.ProductController, :get_product_from_audio
  post "/budget", LatteWeb.Controllers.BudgetController, :add_budget
  get "/today_expenses", LatteWeb.Controllers.BudgetController, :today_expenses

  if Application.compile_env(:latte, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: LatteWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
