import { Button } from '@repo/ui';


export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <Button className={'px-4 py-2 bg-blue-500 rounded text-white'} appName='Next.js'>Click Me</Button>
    </main>
  );
}
