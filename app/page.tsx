import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic'

export default async function Home() {
  const todos = await prisma.todo.findMany();

  return (
    <main>
      <div className='min-h-screen flex flex-col items-center justify-center -mt-16'>
        <h1 className='text-4xl font-bold mb-8 '>Super Todo</h1>
        <div className='flex justify-center'>
          <Link
            href={'/new'}
            className='text-sm border border-white rounded-2xl p-2'>
            Create a new todo
          </Link>
        </div>
        <ol className='list-decimal list-inside mt-4' >
          {todos.map((todo) => (
            <li key={todo.id} className='mb-2'>
              {todo.title}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
