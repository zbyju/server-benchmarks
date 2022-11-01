FROM golang:alpine

ENV GIN_MODE=release
ENV PORT=4000

WORKDIR /usr/app
COPY go.mod ./go.mod 
COPY go.sum ./go.sum

RUN apk update && apk add --no-cache git
RUN go get ./...
RUN apk add --update nodejs npm
RUN npm install -g nodemon

EXPOSE 4000

# nodemon --legacy-watch <working-dir> -e go --exec "go run main.go"
# CMD ["nodemon", "--legacy-watch", "-e", "go", "--exec", "go run main.go", "--signal", "SIGTERM"]
CMD ["go", "run", "main.go"]
