# Aalto University - CS-E4770 - Project 1

This is a repository for the CS-E4770 (Designing and Building Scalable Web Applications) course's first project. The goal of this project is to build a https://bitly.com clone in a language + framework of our choosing, then using the same language, but a different framework implement the same application, finally implement the same application again in a different language. The main objective is to then compare the performance of these three implementations.

I decided to use **Node.js + Express**, **Node.js + Fastify** and **Go + Gin**.

It is important to note that this was the first time I've used Go and it shows on the quality of the code.

---

*Disclaimer*

As the main purpose of this project was to get familiar with performance testing and the whole application is for only this purpose, I did not focus on writing very clean or performent code (the possible improvements are discussed later in the report). The main focus was on keeping the code and the structure of the application as simple as possible.

## Implementation

I tried to keep the implementations as similar as possbile to each other, especially the design of the endpoints (these endpoints are not exactly trying to satisfy the REST architecture).

**Endpoints**:

- **INDEX** - `GET /` - index page - serves `index.html`, `styles.css` and `main.js`
- **SEND** - `POST /api/url` - adds a url to the database and returns the url with the bitly version
- `DELETE /api/url` - deletes all the links in the database
- **REDIRECT** - `/>:bitly` - redirects to the url behind the bitly code
- **RANDOM** - `/random` - returns a url to a random website from the database

## How to run the application

To run any of the three applications, you will need docker and then by simply opening any of the three folders (`node-express`, `node-fastify` and `go-gin`) in your terminal, you can then run: `docker-compose up --build`.

To run the k6 scripts, you will need k6 installed and then when opening the `k6` folder in the terminal you can run any of these commands to start the benchmark for the respective endpoints:

```
yarn k6:index
yarn k6:send
yarn k6:redirect
yarn k6:random
```

Obviously to run the k6 scripts you need to run one of the applications first (it will run on port 4000) so that k6 can send requests to it.

## Methodology

I tried to make the tests as atomic as possible, they will delete all the links before and after the test and create their own random data every time.

I ran the tests on my Macbook Pro (Intel chip) in one session (right after each other) to try to minimize other applications/load affecting the results.

The results were collected from 5 runs from which I always picked the best run as that seemed like a good way of reducing the randomness, but still keeping the data collecting very simple.

The tests were run using the following parameters:

```
Default postgress settings
Logging turned off

K6 - VUS=10
K6 - Duration=10s
```

## Results

I tested the performance using k6 and will be showing:

- Average request per second
- Times waiting for a response in ms
     - Average
     - Median
     - p90 value
     - p95 value
     - p99 value

The results are shown in the #Data section at the end of this report or in the following tables:

![Results](/report/results.png)


Although I'm a terrible Go developer (as this literally my first project written in Go) it is the most performent implementation by far; apart from storing new URLs in the database, in which case it is just slightly worse than the fastify implementation. I suspect this has something to do with bad configuration when connectiong to the database.

I was also very surprised as to how much logging to the console slowed down the application, in some cases it was more slowing down the application by more than 50%. At first I was very confused about the results of the Fastify and Gin implementations as they were much slower than expect compared to Express, which I later figured was caused by the default configuration of these frameworks, which make it so that every request gets logged into the console.

## Developer time

I have used Express a lot in the past and so I was very confident with what I was doing. I thought that my experience with Fastify will be similar, but ran into a lot of trouble when trying to serve static files.

I ended up having to add the little `>` for the redirection endpoint so that Fastify would be able to tell the difference between `/` and `/:bitly` endpoints. I tried other approaches as well but was not successful.

Much like with Express I had no trouble with Gin and I can imagine everything would be pretty smooth if I had the same experience with the language and framework.

# Improvements

The most obvious improvement would be to use a caching mechanism in a form of a in-memory database - Redis would be a really good candidate for that.

Another improvement would be to customize the configuration of the PostgreSQL database to suite the needs of the application. Something is obviously wrong there when it comes to the Go implementation. 

Some other minor changes could be done to the code, especially when it comes to my Go implementation as I have no prior experience with Go, I'm certain the performance can be optimized in that regard.

# Conclusion

I've used Node.js and Go to implement a bitly clone three different times using Express, Fastify and Gin. The results conclusively say that Go was by far the fastest, especially when reading and retrieving data. Fastify and Express implementations were more comparable, but Fastify was overall slightly better than Express.

When it came to developer time I would say that express was the easiest to use (this is very biased as I have used it extensively before), followed by Gin and Fastify was more problematic.

# Data

## Express

### Index

```
http_req_waiting...............: avg=11.3ms med=10.81ms p(90)=15.07ms p(95)=16.64ms p(99)=20.63ms
http_reqs......................: 8649 857.744676/s
```

### Random

```
http_req_waiting...............: avg=9.69ms med=8.95ms p(90)=14.81ms p(95)=18.06ms p(99)=28.64ms
http_reqs......................: 10156 812.117177/s
```

### Redirect

```
http_req_waiting...............: avg=9.58ms med=9.01ms p(90)=14.45ms p(95)=16.9ms p(99)=26.75ms
http_reqs......................: 10119 808.791371/s
```

### Send

```
iteration_duration.............: avg=10.49ms med=10.12ms p(90)=13.62ms p(95)=15.05ms p(99)=19.29ms
iterations.....................: 9499 949.117659/s
```

## Fastify

### Index

```
http_req_waiting...............: avg=10.26ms med=9.67ms p(90)=14.03ms p(95)=15.83ms p(99)=20.61ms
http_reqs......................: 9500 942.200476/s
```

### Random

```
http_req_waiting...............: avg=8.48ms med=7.1ms p(90)=13.29ms p(95)=17.07ms p(99)=30.81ms
http_reqs......................: 11517 972.620581/s
```

### Redirect

```
http_req_waiting...............: avg=8.51ms med=7.13ms p(90)=13.23ms p(95)=16.86ms p(99)=34.28ms
http_reqs......................: 11362 946.910303/s
```

### Send

```
http_req_waiting...............: avg=7.78ms med=7.55ms p(90)=10.06ms p(95)=10.98ms p(99)=13.24ms
http_reqs......................: 12103 1209.606963/s
```

## Go Gin

### Index

```
http_req_waiting...............: avg=7.29ms med=6.91ms p(90)=10.35ms p(95)=11.63ms p(99)=14.57ms 
http_reqs......................: 13284 1328.439468/s
```

### Random

```
http_req_waiting...............: avg=2.78ms med=2.63ms p(90)=3.74ms p(95)=4.23ms p(99)=5.62ms
http_reqs......................: 31030 2492.419467/s
```

### Redirect

```
http_req_waiting...............: avg=2.79ms med=2.64ms p(90)=3.79ms p(95)=4.31ms p(99)=5.65ms
http_reqs......................: 30073 2423.569929/s
```

### Send

```
http_req_waiting...............: avg=8.53ms med=7.93ms p(90)=12.22ms p(95)=13.85ms p(99)=18.29ms
http_reqs......................: 11218 1118.80819/s
```
