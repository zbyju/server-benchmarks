FROM golang:alpine

ENV GIN_MODE=release

WORKDIR /usr/app
COPY . /usr/app

RUN apk update && apk add --no-cache git
RUN go get ./...
RUN apk add --update nodejs npm
RUN npm install -g nodemon

EXPOSE 4000

CMD ["nodemon", "--exec", "go run main.go", "--signal", "SIGTERM"]
