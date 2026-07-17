'use client';

import { CodeBlock } from '@/components/CodeBlock';

type Props = {
  children: string;
};

export function CliCommand({ children }: Props) {
  return <CodeBlock>{children}</CodeBlock>;
}
