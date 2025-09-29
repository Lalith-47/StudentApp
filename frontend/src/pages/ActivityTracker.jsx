import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

const ActivityTracker = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    startDate: "",
    endDate: "",
    location: "",
    organizer: "",
    skills: "",
    achievements: "",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    "academic",
    "extracurricular",
    "volunteering",
    "internship",
    "leadership",
    "certification",
    "competition",
    "workshop",
    "conference",
    "seminar",
    "research",
    "project",
    "sports",
    "cultural",
    "other",
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get("/activities");
      if (response.data.success) {
        setActivities(response.data.data.activities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const response = await api.post("/activities", formData);
      if (response.data.success) {
        setShowCreateForm(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          subcategory: "",
          startDate: "",
          endDate: "",
          location: "",
          organizer: "",
          skills: "",
          achievements: "",
          tags: "",
        });
        fetchActivities();
      }
    } catch (error) {
      console.error("Error creating activity:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (activityId, files) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await api.post(
        `/activities/${activityId}/attachments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        fetchActivities();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const submitForApproval = async (activityId) => {
    try {
      const response = await api.post(`/activities/${activityId}/submit`);
      if (response.data.success) {
        fetchActivities();
      }
    } catch (error) {
      console.error("Error submitting for approval:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activity Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track and manage your achievements and activities
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            Add New Activity
          </Button>
        </div>

        {/* Create Activity Form */}
        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create New Activity
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter activity title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your activity in detail"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where did this take place?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer
                  </label>
                  <Input
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="Who organized this activity?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Leadership, Communication, Technical"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., innovation, teamwork, research"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Creating..." : "Create Activity"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Activities List */}
        <div className="space-y-6">
          {activities.map((activity) => (
            <Card key={activity._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : activity.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {activity.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Category:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {activity.category}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Start Date:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(activity.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Location:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activity.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Organizer:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activity.organizer || "N/A"}
                      </p>
                    </div>
                  </div>

                  {activity.skills && activity.skills.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.attachments && activity.attachments.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Attachments:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {attachment.originalName}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  {activity.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => submitForApproval(activity._id)}
                    >
                      Submit for Approval
                    </Button>
                  )}

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(activity._id, e.target.files)
                      }
                    />
                    <Button size="sm" variant="outline">
                      Upload Files
                    </Button>
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">No activities yet</h3>
              <p className="mb-4">
                Start tracking your achievements by adding your first activity.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Add Your First Activity
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityTracker;
