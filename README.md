# Latte

Budgeting app with voice input. Using OpenAI and Google API.

<img src="ss.jpg?raw=true" width="350">

# Backend

## Start

Generate service_account.json from google console. Put that in backend/service_account.json.

```
. .env && iex -S mix phx.server
```

## Example Request

### Get Product Details from Audio

```bash
curl --location 'http://localhost:4000/product' \
--form 'audio_file=@"/home/user/audio.mp3"' \
--form 'categories="FOOD, SNACK, GROCERIES, TRANSPORTASI, HIBURAN, HOME SERVICES, FASHION, FURNITURE, SEDEKAH, BILLS, MEDICINE"'
```

### Add Budget

```bash
curl --location 'http://localhost:4000/budget' \
--form 'product_name="Chiki"' \
--form 'amount="15000"' \
--form 'category="FOOD"'
```

# Frontend

## Start

Update endpoint in `frontend/config.json`, fill it with backend URL.

```
npm run start
```
