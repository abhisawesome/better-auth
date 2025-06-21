## Backend

```
nvm use --lts
npm init
ls
npm i express dotenv cors
npm i -D typescript ts-node nodemon
git init
nvm use --lts
cd backend
ls
npx tsc --init
npm run dev
npm i --save-dev @types/express
npm run dev
npm install better-auth
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite --output ../generated/prisma
npx prisma migrate dev --name init
npm install @prisma/client
npx @better-auth/cli generate
npx prisma db push
npx prisma studio
```