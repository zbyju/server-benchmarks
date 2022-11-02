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
     - Maximum
     - p90 value
     - p95 value

The results are shown in the following tables:

![Index](/report/index.png)
![Send](/report/send.png)
![Redirect](/report/redirect.png)
![Random](/report/random.png)

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
http_req_waiting...............: avg=11.54ms min=0s med=9.85ms max=1.01s p(90)=13.78ms p(95)=15.62ms 
http_reqs......................: 8454 840.353279/s
```

### Random

```
http_req_waiting...............: avg=9.34ms min=1.55ms med=8.84ms max=124.79ms p(90)=13.84ms p(95)=16.45ms 
http_reqs......................: 10466 850.582451/s
```

### Redirect

```
http_req_waiting...............: avg=9.23ms min=1.48ms med=8.4ms max=126.22ms p(90)=14.27ms p(95)=17.24ms 
     http_reqs......................: 10501 849.913504/s
```

### Send

```
http_req_waiting...............: avg=10.21ms min=3.19ms med=9.82ms max=50ms p(90)=13.34ms p(95)=14.7ms  
http_reqs......................: 9356 932.746229/s
```

## Fastify

### Index

```
http_req_waiting...............: avg=10.27ms min=0s med=9.79ms max=58.24ms p(90)=13.84ms p(95)=15.25ms
http_reqs......................: 9464 941.76206/s
```

### Random

```
http_req_waiting...............: avg=8.78ms min=925.33µs med=7.34ms max=219.48ms p(90)=13.78ms p(95)=17.94ms 
http_reqs......................: 11100 935.340027/s
```

### Redirect

```
http_req_waiting...............: avg=8.65ms min=1.18ms med=7.4ms max=160.27ms p(90)=13.53ms p(95)=17.21ms 
http_reqs......................: 11093 934.52634/s
```

### Send

```
http_req_waiting...............: avg=7.77ms min=2.36ms med=7.52ms max=36.63ms p(90)=10.12ms p(95)=11.16ms 
http_reqs......................: 12025 1199.251856/s
```

## Go Gin

### Index

```
http_req_waiting...............: avg=7.11ms min=0s med=6.66ms max=29.05ms p(90)=10.25ms p(95)=11.6ms  
http_reqs......................: 13600 1360.313603/s
```

### Random

```
http_req_waiting...............: avg=2.73ms min=1.02ms med=2.58ms max=40.37ms p(90)=3.68ms p(95)=4.15ms  
http_reqs......................: 31497 2573.014482/s
```

### Redirect

```
http_req_waiting...............: avg=3.08ms min=959.76µs med=2.59ms max=1.01s p(90)=3.74ms p(95)=4.27ms  
http_reqs......................: 30036 2288.219012/s
```

### Send

```
http_req_waiting...............: avg=8.48ms min=2.09ms med=7.94ms max=28.28ms p(90)=12.13ms p(95)=13.86ms 
http_reqs......................: 11267 1123.589898/s
```
