'use client';

import { deleteBlogPost } from './actions';
import { useTransition } from 'react';

export default function DeleteBlogButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to delete this post?')) {
          startTransition(() => {
             // deleteBlogPost is a server action
             deleteBlogPost(id);
          });
        }
      }}
      disabled={isPending}
      className="font-mono text-[10px] text-red-500/70 hover:text-red-500 lowercase disabled:opacity-50"
    >
      {isPending ? 'deleting...' : 'delete'}
    </button>
  );
}
