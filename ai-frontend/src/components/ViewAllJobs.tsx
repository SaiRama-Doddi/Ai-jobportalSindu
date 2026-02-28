import { useEffect, useState } from "react";
import axios from "axios";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  experience?: string;
  salary?: string;
};

export default function ViewAllJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<Job[]>("http://localhost:8081/api/jobs");
        setJobs(res.data);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {job.company} • {job.location}
              </p>

              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                {job.experience && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {job.experience}
                  </span>
                )}
                {job.salary && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {job.salary}
                  </span>
                )}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
