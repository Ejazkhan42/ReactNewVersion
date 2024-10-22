// Note.js (Server Component)
import { getTasks } from '../../database/db';

export default async function Note() {
  const tasks = await getTasks();

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <span>{task.name}</span>
        </div>
      ))}
    </div>
  );
}

