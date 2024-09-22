import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';

export function PopoverContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Popover.Content side="top" className="z-[2000]">
      <div className={clsx('bg-black/80 text-white p-2 rounded-md text-xs flex flex-col gap-2 animate-overlayShow', className)}>{children}</div>
      <Popover.Arrow className="fill-black/80" />
    </Popover.Content>
  );
}
