defmodule LatteWeb.Controllers.ProductController do
  use LatteWeb, :controller

  require Logger

  alias Latte.SpeechToText
  alias Latte.Products

  def get_product_from_audio(conn, %{"audio_file" => audio_file, "categories" => categories}) do
    File.copy!(audio_file.path, "/tmp/media.m4a")

    with :ok <- validate_audio_file(audio_file),
         {:ok, output_file} <-
           convert_to_m4a(audio_file.path, audio_file.path <> ".m4a")
           |> IO.inspect(label: "convert_to_m4a/2"),
         {:ok, %{text: transcription}} <-
           SpeechToText.generate(output_file) |> IO.inspect(label: "transcription"),
         {:ok, name, price, category} <- Products.get_product_price(transcription, categories) do
      conn
      |> put_resp_content_type("application/json")
      |> json(%{
        status: "success",
        data: %{
          name: name,
          price: price,
          category: category,
          transcription: transcription
        }
      })
    else
      error ->
        Logger.error(
          "[ProductController] error: #{inspect(error)}, audio: #{inspect(audio_file)}"
        )

        conn
        |> put_resp_content_type("application/json")
        |> json(%{error: "unknown error"})
    end
  end

  def get_product_from_audio(conn, params) do
    Logger.error("[error] params: #{inspect(params)}")

    conn
    |> put_resp_content_type("application/json")
    |> json(%{error: "Invalid audio file or transcription."})
  end

  defp convert_to_m4a(input_file, output_file) do
    args = [
      "-i",
      input_file,
      "-vn",
      "-acodec",
      "aac",
      "-b:a",
      "128k",
      output_file
    ]

    {output, exit_code} = System.cmd("ffmpeg", args, stderr_to_stdout: true)

    case exit_code do
      0 ->
        {:ok, output_file}

      _ ->
        {:error, output}
    end
  end

  defp get_filename(%Plug.Upload{path: path, filename: filename}) do
    File.copy(path, path <> filename)
    path <> filename
  end

  defp validate_audio_file(_), do: :ok

  # defp validate_audio_file(%Plug.Upload{content_type: content_type})
  #      when content_type in ["audio/mpeg", "audio/wav", "audio/mp3"] do
  #   :ok
  # end

  # defp validate_audio_file(_),
  #   do: {:error, "Invalid audio file format. Please upload an MP3 or WAV file."}
end
