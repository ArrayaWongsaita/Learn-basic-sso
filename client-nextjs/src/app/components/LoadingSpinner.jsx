export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="p-8 text-center">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-800 font-medium text-lg tracking-wide">
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
}
