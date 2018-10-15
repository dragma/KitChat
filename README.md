# KitChat
powerfull and simple node chat server

## start db
```
docker-compose up mongo -d
```

## build and start server
# build kitchat-server
```
cd kitchat-server
yarn
yarn build:watch
```
# start test server
```
cd server
yarn
yarn dev
```
## build and start client
# build client
```
cd kitchat-client
yarn
yarn build:watch
```

# start test app
```
cd app
yarn
yarn start
```