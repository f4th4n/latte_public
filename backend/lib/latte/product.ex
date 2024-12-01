defmodule Latte.Products do
  require Logger

  @model "gpt-4o-mini"

  def get_product_price(text, categories) do
    text_response =
      OpenAI.chat_completion(
        model: @model,
        messages: [
          %{
            role: "system",
            content:
              "Kamu adalah asisten yang dapat menemukan nama produk, harga, dan kategori di dalam teks. Jika tidak ditemukan, return empty string untuk nama produk, return empty string untuk kategori, dan return 0 untuk harga. Kategori yang diberikan adalah #{categories}."
          },
          %{role: "user", content: text}
        ],
        response_format: %{
          type: :json_schema,
          json_schema: %{
            name: "product",
            schema: %{
              type: "object",
              properties: %{
                name: %{type: :string},
                category: %{type: :string},
                price: %{type: :number}
              }
            }
          }
        }
      )

    with {:ok, %{choices: [%{"message" => %{"content" => content}} | _tail]}} <-
           text_response,
         {:ok, %{"name" => name, "category" => category, "price" => price}} <-
           Jason.decode(content) do
      {:ok, name, price, category}
    else
      e ->
        Logger.error("error: #{inspect(e)}")
        {:error, :not_found}
    end
  end
end
