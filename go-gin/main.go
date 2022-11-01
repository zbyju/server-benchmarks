package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	gonanoid "github.com/matoous/go-nanoid"
)

type UrlRequestBody struct {
	Url string
}

type Link struct {
	url   string
	bitly string
}

func linkToJson(link Link) map[string]any {
	return map[string]any{
		"url":   string(link.url),
		"bitly": string(link.bitly),
	}
}

func generateBitly() string {
	id, err := gonanoid.Generate("abcdefghijklmnopqrstuvwxyz", 5)
	if err != nil {
		return "abcde"
	}
	return id
}

func deleteAll() {
	fmt.Println("Deleting")
}

func saveUrl(url string) Link {
	fmt.Println("Saving: ", url)
	link := getLinkByUrl(url)
	if link != nil {
		return *link
	}
	bitly := generateBitly()
	return Link{url, bitly}
}

func getRandom() Link {
	fmt.Println("Getting random")
	return Link{url: "http://google.com", bitly: "abcde"}
}

func getLinkByUrl(url string) *Link {
	fmt.Println("Getting by URL: ", url)
	return &Link{url: "http://google.com", bitly: "abcde"}
}

func getLinkByBitly(bitly string) *Link {
	fmt.Println("Getting by bitly: ", bitly)
	return &Link{url: "http://google.com", bitly: "abcde"}
}

func main() {
	r := gin.Default()

	r.DELETE("/api/url", func(c *gin.Context) {
		deleteAll()
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/api/url", func(c *gin.Context) {
		var requestBody UrlRequestBody
		if err := c.BindJSON(&requestBody); err != nil {
			c.String(400, "No url")
		}
		link := saveUrl(requestBody.Url)
		c.JSON(200, linkToJson(link))
	})

	r.POST("/random", func(c *gin.Context) {
		link := getRandom()
		c.JSON(200, linkToJson(link))
	})

	r.GET("/>bitly", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.StaticFile("/", "./public/index.html")
	r.StaticFile("/js/main.js", "./public/js/main.js")
	r.StaticFile("/css/styles.css", "./public/css/styles.css")

	r.Run()
}
