package main

import (
	"context"
	"fmt"
	"strings"
	"time"
)

type TaskProvider interface {
	GetTasks() ([]Task, error)
	CreateTask(title string, deadline time.Time, priority int8) (Task, error)
	ToggleTask(id uint) (Task, error)
	DeleteTask(id uint) error
}

type App struct {
	taskProvider TaskProvider
	ctx          context.Context
}

func NewAppService(taskProvider TaskProvider) (*App, error) {
	return &App{taskProvider: taskProvider}, nil
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetAllTasks() ([]Task, error) {
	return a.taskProvider.GetTasks()
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

	return a.taskProvider.CreateTask(title, deadline, priority)
}

func (a *App) ToggleTask(id uint) (Task, error) {
	return a.taskProvider.ToggleTask(id)
}

func (a *App) DeleteTask(id uint) error {
	return a.taskProvider.DeleteTask(id)
}
