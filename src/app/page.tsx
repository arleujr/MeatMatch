export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight">
          Meat<span className="text-primary">Match</span>
        </h1>
        <p className="text-text-muted text-lg max-w-md mx-auto">
          The intelligent way to plan your BBQ, calculate items, and split the bill.
        </p>
      </div>

      {/* Temporary visual test for our surface container */}
      <div className="w-full bg-surface border border-surface-hover rounded-2xl p-6 shadow-xl mt-8">
        <div className="flex items-center justify-between">
          <span className="text-text-muted font-medium">System Status</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            Engine Ready
          </span>
        </div>
      </div>
    </div>
  );
}