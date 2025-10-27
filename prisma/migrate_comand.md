-- create new migrate --
npx prisma migrate dev --name migration_name

-- migrate --
npx prisma migrate deploy

-- delete db data and migrate --
npx prisma migrate reset

-- seed --
npm run seed


