# KitChat
powerfull and simple node chat server

## Start single node

### start db
```
docker-compose up mongo -d
```

### build and start server
#### build kitchat-server
```
cd kitchat-server
yarn
yarn build:watch
```
#### start test server
```
cd server
yarn
yarn dev:single
```
### build and start client
#### build client
```
cd kitchat-client
yarn
yarn build:watch
```

#### start test app
```
cd app
yarn
yarn start
```

## Start multiple node

### start db
```
docker-compose up mongo redis -d
```

### build and start server
#### build kitchat-server
```
cd kitchat-server
yarn
yarn build:watch
```
#### start test server
```
cd server
yarn
yarn dev:multiples
```
### build and start client
#### build client
```
cd kitchat-client
yarn
yarn build:watch
```

#### start test app
```
cd app
yarn
yarn start
```