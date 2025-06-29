import { ChatInterface } from '../dashboard/components/chat-interface';

export default function LogActivityPage() {
  return (
    <div className="flex flex-col h-full">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Log Sales Activity</h1>
            <p className="text-foreground">
                Use this chat to log your sales activities. AI will analyze and store them.
            </p>
        </div>
        <div className="flex-1">
            <ChatInterface />
        </div>
    </div>
  );
}
