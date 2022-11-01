# Project 1 report

Write the project report here. Do not include your personal
details (e.g. name or student number).

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
