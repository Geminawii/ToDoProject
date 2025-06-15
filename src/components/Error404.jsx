import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-orange-50 text-center p-6">
      <h1 className="text-4xl font-bold text-orange-900">404 - Page Not Found</h1>
      <p className="text-orange-800 text-lg">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate("/dashboard")} className="mt-4">
        Go to Dashboard
      </Button>
    </div>
  );
}