defmodule Latte.SpeechToText do
  @moduledoc false

  def generate(file_path) do
    OpenAI.audio_transcription(file_path, model: "whisper-1", language: "id")
  end
end
