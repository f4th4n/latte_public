defmodule LatteWeb.Controllers.BudgetController do
  use LatteWeb, :controller

  require Logger

  def today_expenses(conn, _params) do
    sheet_name = Application.get_env(:latte, :sheet_name)

    with {:ok, expenses} <- Latte.BudgetSpreadsheet.today_budget_expenses(sheet_name) do
      conn
      |> put_resp_content_type("application/json")
      |> json(%{data: expenses})
    end
  end

  def add_budget(conn, %{
        "product_name" => product_name,
        "amount" => amount,
        "category" => category
      }) do
    with {:ok, budget} <- create_budget(product_name, amount, category) do
      conn
      |> put_resp_content_type("application/json")
      |> json(%{
        status: "success",
        data: budget
      })
    else
      error ->
        Logger.error("[BudgetController] error: #{inspect(error)}")

        conn
        |> put_resp_content_type("application/json")
        |> json(%{error: "Failed to add budget"})
    end
  end

  defp create_budget(product_name, amount_str, category) do
    amount = String.to_integer(amount_str)
    sheet_name = Application.get_env(:latte, :sheet_name)

    today =
      Date.utc_today()
      |> Date.to_string()
      |> String.split("-")
      |> Enum.reverse()
      |> Enum.join("-")

    case Latte.BudgetSpreadsheet.append_row(sheet_name, [today, category, product_name, amount]) do
      :ok -> {:ok, %{amount: amount, category: category, id: :rand.uniform(1000)}}
      error -> error
    end
  end
end
