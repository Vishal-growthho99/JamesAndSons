'use client';

import { useActionState } from 'react';
import Link from 'next/link';

interface PageFormProps {
  page: any;
  isNew: boolean;
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export default function PageForm({ page, isNew, action }: PageFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="bg-surface border border-border p-6 space-y-6">
      {state?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[12px]">
          {state.error}
        </div>
      )}
      
      <input type="hidden" name="id" value={isNew ? 'new' : page?.id} />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Page Title</label>
          <input 
            name="title" 
            defaultValue={page?.title} 
            required 
            type="text" 
            className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-body text-[14px]"
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">URL Slug</label>
          <input 
            name="slug" 
            defaultValue={page?.slug} 
            required 
            type="text" 
            placeholder="e.g. about-us"
            className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-mono text-[12px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Page Content (HTML/Markdown)</label>
        <textarea 
          name="content" 
          defaultValue={page?.content} 
          required 
          rows={15}
          className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-mono text-[13px] leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">SEO Meta Title (Optional)</label>
          <input 
            name="metaTitle" 
            defaultValue={page?.metaTitle || ''} 
            type="text" 
            className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-body text-[14px]"
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">SEO Meta Description (Optional)</label>
          <textarea 
            name="metaDescription" 
            defaultValue={page?.metaDescription || ''} 
            rows={3}
            className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-body text-[13px]"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Visibility</label>
        <select name="isPublished" defaultValue={page ? String(page.isPublished) : 'true'} className="w-full bg-background border border-border px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors font-mono text-[12px] uppercase">
          <option value="true">Published (Public)</option>
          <option value="false">Draft (Hidden)</option>
        </select>
      </div>

      <div className="pt-8 flex justify-end gap-4">
        <Link href="/pages" className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted border border-border px-6 py-3 hover:bg-surface-muted transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50">
          {isPending ? 'Saving...' : (isNew ? 'Create Page' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
}
