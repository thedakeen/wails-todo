package main

import (
	"encoding/json"
	"time"
)

type Task struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title     string    `json:"title"`
	Done      bool      `json:"done"`
	Priority  int8      `json:"priority" gorm:"default:2"`
	CreatedAt time.Time `json:"createdAt"`
	DoneAt    time.Time `json:"doneAt"`
	Deadline  time.Time `json:"deadline"`
}

func (t Task) MarshalJSON() ([]byte, error) {
	type Alias Task
	return json.Marshal(&struct {
		CreatedAt string `json:"createdAt"`
		Deadline  string `json:"deadline"`
		DoneAt    string `json:"doneAt,omitempty"`
		*Alias
	}{
		CreatedAt: t.CreatedAt.Format(time.RFC3339),
		Deadline:  t.Deadline.Format(time.RFC3339),
		DoneAt:    t.DoneAt.Format(time.RFC3339),
		Alias:     (*Alias)(&t),
	})
}
