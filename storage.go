package main

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"time"
)

// Storage struct implements TaskRepository
type Storage struct {
	db *gorm.DB
}

// NewStorage initializes the database connection
func NewStorage() (*Storage, error) {
	const op = "storage.sqlite.New"

	db, err := gorm.Open(sqlite.Open("todo.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	err = db.AutoMigrate(&Task{})
	if err != nil {
		return nil, err
	}

	return &Storage{db: db}, nil
}

// GetTasks retrieves all tasks from the database
func (s *Storage) GetTasks() ([]Task, error) {
	const op = "storage.GetTasks"

	var tasks []Task
	result := s.db.Order("created_at desc").Find(&tasks)
	if result.Error != nil {
		return nil, fmt.Errorf("%s:%w", op, result.Error)
	}
	return tasks, nil
}

// CreateTask adds a new task to the database
func (s *Storage) CreateTask(title string, deadline time.Time, priority int8) (Task, error) {
	const op = "storage.CreateTask"

	task := Task{
		Title:     title,
		Done:      false,
		Priority:  priority,
		CreatedAt: time.Now(),
		Deadline:  deadline.UTC(),
	}

	err := s.db.Create(&task).Error
	if err != nil {
		return Task{}, fmt.Errorf("%s:%w", op, err)
	}
	return task, nil
}

// ToggleTask updates the done status of a task
func (s *Storage) ToggleTask(id uint) (Task, error) {
	const op = "storage.ToggleTask"

	var task Task
	result := s.db.First(&task, id)
	if result.Error != nil {
		return Task{}, fmt.Errorf("%s:%w", op, result.Error)
	}

	if task.Done {
		task.DoneAt = time.Time{}
	} else {
		task.DoneAt = time.Now()
	}

	task.Done = !task.Done
	result = s.db.Save(&task)

	if result.Error != nil {
		return Task{}, fmt.Errorf("%s:%w", op, result.Error)
	}

	return task, nil
}

// DeleteTask removes a task from the database
func (s *Storage) DeleteTask(id uint) error {
	const op = "storage.DeleteTask"

	result := s.db.Delete(&Task{}, id)
	if result.Error != nil {
		return fmt.Errorf("%s:%w", op, result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("task not found")
	}

	return nil
}
