# BFHL API (Node + Express)

## Local run
```bash
npm install
npm start
```
POST http://localhost:3000/bfhl
Body (JSON):
```json
{ "data": ["a","1","334","4","R","$"] }
```

## Environment
Set before deploy:
- FULL_NAME=your_full_name_lowercase_with_underscores
- DOB_DDMMYYYY=17091999
- EMAIL=john@xyz.com
- ROLL_NUMBER=ABCD123

## Deploy (Render)
- Push this repo to GitHub.
- Create new Web Service, connect the repo.
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables above.
- After deploy, POST to: `https://<your-service>.onrender.com/bfhl`
