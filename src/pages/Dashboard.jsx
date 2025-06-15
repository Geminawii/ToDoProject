import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import localforage from "localforage";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    (async () => {
      const stored = await localforage.getItem("userData");

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
        <Sidebar user={user} />

        <section className="flex-1 p-6 -mt-7">
          <MainContent 
            user={user} 
            searchTerm={searchTerm} 
            filter={filter} 
          />
        </section>

      </div>
    </main>
  )
};

export default Dashboard;
