import * as fs from 'fs';
import * as path from 'path';

export interface ScheduledTask {
    id: string;
    command: string;
    scheduleTime: string; // HH:mm
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
}

const SCHEDULE_FILE = path.join(process.cwd(), 'schedule.json');

export function scheduleTask(command: string, time: string): ScheduledTask {
    const tasks = loadTasks();
    
    const newTask: ScheduledTask = {
        id: Math.random().toString(36).substring(7),
        command,
        scheduleTime: time,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    
    console.log(`[AGENDADOR] Tarefa agendada: "${command}" para às ${time}`);
    return newTask;
}

export function checkDueTasks(): ScheduledTask[] {
    const tasks = loadTasks();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const dueTasks = tasks.filter(t => t.status === 'pending' && t.scheduleTime <= currentTime);
    
    if (dueTasks.length > 0) {
        console.log(`[AGENDADOR] ${dueTasks.length} tarefas encontradas para execução agora.`);
    }

    return dueTasks;
}

export function completeTask(taskId: string, success: boolean) {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex >= 0) {
        tasks[taskIndex].status = success ? 'completed' : 'failed';
        saveTasks(tasks);
    }
}

function loadTasks(): ScheduledTask[] {
    if (!fs.existsSync(SCHEDULE_FILE)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8'));
    } catch (e) {
        return [];
    }
}

function saveTasks(tasks: ScheduledTask[]) {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}
