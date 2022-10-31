package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.DELETE("/api/url", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/api/url", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/random", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/>bitly", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.StaticFile("/", "./public/index.html")
	r.StaticFile("/js/main.js", "./public/js/main.js")
	r.StaticFile("/css/styles.css", "./public/css/styles.css")

	r.Run(":4000") // listen and serve on 0.0.0.0:8080
}
