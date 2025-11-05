#!/bin/sh
# Entrypoint: wait for MongoDB, then run seed script once and start the server.
# It will retry connecting to Mongo a few times before giving up.

set -e

MONGO_URI="${MONGO_URI:-mongodb://mongo:27017/vista}"
MAX_RETRIES=20
SLEEP_SECONDS=3
i=0

echo "Waiting for MongoDB at $MONGO_URI ..."
while [ $i -lt $MAX_RETRIES ]; do
  # simple check by using node one-liner to attempt connection
  node -e "const mongoose=require('mongoose'); mongoose.connect(process.env.MONGO_URI || '$MONGO_URI').then(()=>{console.log('mongo-ok'); process.exit(0)}).catch(()=>process.exit(1))" && break
  i=$((i+1))
  echo "Mongo not ready yet... retry $i/$MAX_RETRIES"
  sleep $SLEEP_SECONDS
done

if [ $i -ge $MAX_RETRIES ]; then
  echo "MongoDB not available after retries. Proceeding anyway."
else
  echo "MongoDB reachable. Running seed script (safe to run multiple times)."
  # run seed script (it deletes and inserts homestays)
  node seed.js || echo "Seed script failed (continuing to start server)"
fi

# Finally start the server (use nodemon in dev mode as in Dockerfile)
exec npm run dev
