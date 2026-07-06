import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm text-muted">
        We couldn&apos;t find that page. It may have been moved or never existed.
      </p>
      <Link href="/">
        <Button className="mt-8">Back home</Button>
      </Link>
    </div>
  );
}
