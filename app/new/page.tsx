import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import Form from 'next/form';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function NewTodo() {
  async function createTodo(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;

    await prisma.todo.create({ data: { title } });
    revalidatePath('/');
    redirect('/');
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Create New Todo</h1>
      <Form action={createTodo} className='space-y-6'>
        <div>
          <label htmlFor='title' className='block text-lg mb-2'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Enter your post title'
            className='w-full px-4 py-2 border rounded-lg'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600'>
          Create Todo
        </button>
      </Form>

      <div className='text-center mt-10'>
        <Link href='/' className='text-sm'>
          Go to main Page
        </Link>
      </div>
    </div>
  );
}
