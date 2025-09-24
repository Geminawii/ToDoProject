import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import localforage from "localforage";

type User = any;

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<"all" | string>("all");

  useEffect(() => {
    (async () => {
      const stored = await localforage.getItem<User>("userData");
      if (stored) {
        setUser(stored);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-orange-50">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="flex mt-5">
        <div className="hidden lg:block sticky top-0 h-screen">
          <Sidebar/>
        </div>

        <section className="flex-1 p-6 -mt-7">
          <MainContent user={user} searchTerm={searchTerm} filter={filter as "all" | "completed" | "incomplete"}/>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
