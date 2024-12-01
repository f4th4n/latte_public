defmodule Latte.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      LatteWeb.Telemetry,
      Latte.Repo,
      {DNSCluster, query: Application.get_env(:latte, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Latte.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Latte.Finch},
      # Start a worker by calling: Latte.Worker.start_link(arg)
      # {Latte.Worker, arg},
      # Start to serve requests, typically the last entry
      LatteWeb.Endpoint,
      {Goth, name: Latte.Goth}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Latte.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LatteWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
