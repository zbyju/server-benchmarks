package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"

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

func generateBitly() *string {
	id, err := gonanoid.Generate("abcdefghijklmnopqrstuvwxyz", 10)
	if err != nil {
		return nil
	}
	return &id
}

func deleteAll(db *sql.DB) {
	db.Exec("TRUNCATE links;")
}

func saveUrl(url string, db *sql.DB) *Link {
	link := getLinkByUrl(url, db)
	if link != nil {
		return link
	}
	bitly := generateBitly()
	if bitly == nil {
		return nil
	}
	existing := getLinkByBitly(*bitly, db)
	for existing != nil {
		bitly = generateBitly()
		if bitly == nil {
			return nil
		}
		existing = getLinkByBitly(*bitly, db)
	}
	bitlyStr := ">" + (*bitly)
	_, err := db.Exec("INSERT INTO links(url, bitly) VALUES($1 , $2)", url, bitlyStr)

	if err != nil {
		return nil
	}

	return &Link{url, bitlyStr}
}

func getRandom(db *sql.DB) *Link {
	rows, err := db.Query("SELECT * FROM links ORDER BY RANDOM() LIMIT 1")

	if err != nil {
		return nil
	}
	if rows.Next() == false {
		return nil
	}
	var url string
	var bitly string
	rows.Scan(&url, &bitly)

	return &Link{url: url, bitly: bitly}
}

func getLinkByUrl(url string, db *sql.DB) *Link {
	rows, err := db.Query("SELECT * FROM links WHERE url=$1;", url)

	if err != nil {
		return nil
	}
	if rows.Next() == false {
		return nil
	}
	var urlDb string
	var bitly string
	rows.Scan(&urlDb, &bitly)

	return &Link{url: urlDb, bitly: bitly}
}

func getLinkByBitly(bitly string, db *sql.DB) *Link {
	bitly = ">" + bitly
	rows, err := db.Query("SELECT * FROM links WHERE bitly=$1;", bitly)

	if err != nil {
		return nil
	}
	if rows.Next() == false {
		return nil
	}
	var url string
	var bitlyDb string
	rows.Scan(&url, &bitlyDb)

	return &Link{url: url, bitly: bitlyDb}
}

func main() {
	r := gin.Default()

	connStr := "postgresql://username:password@dab-p1-database-gin/database?sslmode=disable"
	// Connect to database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	r.DELETE("/api/url", func(c *gin.Context) {
		deleteAll(db)
		c.String(200, "Deleted")
	})

	r.POST("/api/url", func(c *gin.Context) {
		var requestBody UrlRequestBody
		if err := c.BindJSON(&requestBody); err != nil {
			c.String(400, "No url")
		}
		link := saveUrl(requestBody.Url, db)
		if link == nil {
			c.String(500, "Internal error")
		}
		c.JSON(200, linkToJson(*link))
	})

	r.POST("/random", func(c *gin.Context) {
		link := getRandom(db)
		if link == nil {
			c.JSON(404, gin.H{
				"url": "",
			})
		}
		c.JSON(200, linkToJson(*link))
	})

	r.GET("/>:bitly", func(c *gin.Context) {
		bitly := c.Param("bitly")
		link := getLinkByBitly(bitly, db)
		if link == nil {
			c.String(404, "Not found")
		} else {
			c.Redirect(302, link.url)
		}
	})

	r.StaticFile("/", "./public/index.html")
	r.StaticFile("/js/main.js", "./public/js/main.js")
	r.StaticFile("/css/styles.css", "./public/css/styles.css")

	r.Run()
}
