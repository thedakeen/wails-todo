package main

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewStorage() (*gorm.DB, error) {
	const op = "storage.sqlite.New"

	db, err := gorm.Open(sqlite.Open("todo.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("%s:%w", op, err)
	}

	err = db.AutoMigrate(&Task{})
	return db, err
}
