package main

import (
	"context"
	"fmt"
	"gorm.io/gorm"
	"strings"
	"time"
)

type App struct {
	db  *gorm.DB
	ctx context.Context
}

// TODO: Error handling

func NewAppService() (*App, error) {
	db, err := NewStorage()
	if err != nil {
		return nil, err
	}

	return &App{db: db}, nil
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetAllTasks() []Task {
	var tasks []Task
	a.db.Order("created_at desc").Find(&tasks)
	return tasks
}

func (a *App) AddTask(title string, deadline time.Time, priority int8) (Task, error) {
	if priority < 1 || priority > 3 {
		return Task{}, fmt.Errorf("invalid priority value")
	}

	if deadline.Before(time.Now().UTC().Truncate(24 * time.Hour)) {
		return Task{}, fmt.Errorf("invalid deadline")
	}

	if strings.TrimSpace(title) == "" {
		return Task{}, fmt.Errorf("title cannot be empty")
	}

	task := Task{
		Title:     title,
		Done:      false,
		Priority:  priority,
		CreatedAt: time.Now(),
		Deadline:  deadline.UTC(),
	}

	err := a.db.Create(&task).Error
	if err != nil {
		return Task{}, fmt.Errorf("database error: %v", err)
	}
	return task, nil
}

func (a *App) ToggleTask(id uint) Task {
	var task Task
	a.db.First(&task, id)

	if task.Done {
		task.DoneAt = time.Time{}
	} else {
		task.DoneAt = time.Now()
	}

	task.Done = !task.Done

	a.db.Save(&task)

	return task
}

func (a *App) DeleteTask(id uint) error {
	result := a.db.Delete(&Task{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("task not found")
	}

	return nil
}
