defmodule Latte.BudgetSpreadsheet do
  require Logger

  @google_sheets_api "https://sheets.googleapis.com/v4/spreadsheets"

  def today_budget_expenses(sheet_name) do
    range = "#{sheet_name}!A1:D"

    with {:ok, token} <- get_token(),
         {:ok, response} <- make_read_request(range, token),
         values <- response["values"] do
      today_rows =
        Enum.filter(values, fn value ->
          today_date =
            Date.utc_today()
            |> Date.to_string()
            |> String.split("-")
            |> Enum.reverse()
            |> Enum.join("-")

          date_cell = List.first(value)

          date_cell == today_date
        end)
        |> Enum.map(fn value ->
          to_budget_expense(value)
        end)

      {:ok, today_rows}
    end
  end

  defp to_budget_expense(value) do
    %{
      date: Enum.at(value, 0),
      category: Enum.at(value, 1),
      product_name: Enum.at(value, 2),
      amount: Enum.at(value, 3)
    }
  end

  defp make_read_request(range, token) do
    spreadsheet_id = Application.get_env(:latte, :spreadsheet_id)
    url = "#{@google_sheets_api}/#{spreadsheet_id}/values/#{range}"

    headers = [
      {"Authorization", "Bearer #{token}"},
      {"Content-Type", "application/json"}
    ]

    Finch.build(:get, url, headers)
    |> Finch.request(Latte.Finch)
    |> case do
      {:ok, %Finch.Response{status: 200, body: body}} ->
        {:ok, Jason.decode!(body)}

      {:ok, %Finch.Response{status: status, body: body}} ->
        Logger.error("Failed to read spreadsheet: #{status} - #{body}")
        {:error, body}

      {:error, reason} ->
        Logger.error("HTTP request failed: #{inspect(reason)}")
        {:error, reason}
    end
  end

  def append_row(sheet_name, values) do
    range = "#{sheet_name}!A1"

    with {:ok, token} <- get_token(),
         {:ok, _response} <- make_append_request(range, values, token) do
      :ok
    else
      {:error, reason} -> {:error, reason}
    end
  end

  defp get_token() do
    case Goth.Token.for_scope("https://www.googleapis.com/auth/spreadsheets") do
      {:ok, %{token: token}} -> {:ok, token}
      error -> error
    end
  end

  defp make_append_request(range, values, token) do
    spreadsheet_id = Application.get_env(:latte, :spreadsheet_id)
    value_input_option = "RAW"

    url =
      "#{@google_sheets_api}/#{spreadsheet_id}/values/#{range}:append?valueInputOption=#{value_input_option}"

    headers = [
      {"Authorization", "Bearer #{token}"},
      {"Content-Type", "application/json"}
    ]

    body =
      %{
        "values" => [values]
      }
      |> Jason.encode!()

    Finch.build(:post, url, headers, body)
    |> Finch.request(Latte.Finch)
    |> case do
      {:ok, %Finch.Response{status: 200, body: body}} ->
        {:ok, Jason.decode!(body)}

      {:ok, %Finch.Response{status: status, body: body}} ->
        Logger.error("Failed to append row: #{status} - #{body}")
        {:error, body}

      {:error, reason} ->
        Logger.error("HTTP request failed: #{inspect(reason)}")
        {:error, reason}
    end
  end
end
