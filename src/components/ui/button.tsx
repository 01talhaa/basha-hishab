import {Slot} from 'radix-ui';
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import type {ButtonHTMLAttributes} from 'react';
export function Button({className,asChild=false,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{asChild?:boolean}){const Comp=asChild?Slot.Root:'button';return <Comp className={twMerge(clsx('button',className))} {...props}/>}
