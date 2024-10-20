sleep 2 # wait for the database to start

npx prisma db push

echo "Starting server..."

exec npm run start