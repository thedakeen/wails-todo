package main

import (
	"context"
	"gorm.io/gorm"
	"time"
)

type App struct {
	db  *gorm.DB
	ctx context.Context
}

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

func (a *App) AddTask(title string, deadline time.Time) Task {
	task := Task{
		Title:     title,
		Done:      false,
		CreatedAt: time.Now(),
		Deadline:  deadline.UTC(),
	}
	a.db.Create(&task)
	return task
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
