import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const CourseForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    credits: initialData?.credits || 3,
    department: initialData?.department || "",
    semester: initialData?.semester || "Fall",
    academicYear: initialData?.academicYear || "2024-2025",
    schedule: {
      days: initialData?.schedule?.days || [],
      startTime: initialData?.schedule?.startTime || "",
      endTime: initialData?.schedule?.endTime || "",
      location: initialData?.schedule?.location || "",
      room: initialData?.schedule?.room || "",
      online: initialData?.schedule?.online || false,
      meetingLink: initialData?.schedule?.meetingLink || "",
    },
    settings: {
      allowLateSubmissions: initialData?.settings?.allowLateSubmissions || true,
      latePenalty: initialData?.settings?.latePenalty || 10,
      requireAttendance: initialData?.settings?.requireAttendance || true,
      attendanceWeight: initialData?.settings?.attendanceWeight || 10,
      enableDiscussions: initialData?.settings?.enableDiscussions || true,
      enableAnnouncements: initialData?.settings?.enableAnnouncements || true,
    },
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const semesters = ["Fall", "Spring", "Summer", "Winter"];

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Course title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else if (value.trim().length > 200) {
          newErrors.title = "Title cannot exceed 200 characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "code":
        if (!value.trim()) {
          newErrors.code = "Course code is required";
        } else if (!/^[A-Z]{2,4}[0-9]{3,4}$/.test(value.trim().toUpperCase())) {
          newErrors.code =
            "Code must be in format: ABC123 (2-4 letters, 3-4 numbers)";
        } else {
          delete newErrors.code;
        }
        break;

      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else if (value.trim().length > 2000) {
          newErrors.description = "Description cannot exceed 2000 characters";
        } else {
          delete newErrors.description;
        }
        break;

      case "credits":
        if (!value || value < 1 || value > 10) {
          newErrors.credits = "Credits must be between 1 and 10";
        } else {
          delete newErrors.credits;
        }
        break;

      case "department":
        if (!value.trim()) {
          newErrors.department = "Department is required";
        } else if (value.trim().length < 2) {
          newErrors.department = "Department must be at least 2 characters";
        } else {
          delete newErrors.department;
        }
        break;

      case "academicYear":
        if (!/^\d{4}-\d{4}$/.test(value)) {
          newErrors.academicYear = "Academic year must be in format: YYYY-YYYY";
        } else {
          delete newErrors.academicYear;
        }
        break;

      case "startTime":
      case "endTime":
        if (value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          newErrors[name] = "Time must be in HH:MM format";
        } else if (
          formData.schedule.startTime &&
          formData.schedule.endTime &&
          new Date(`2000-01-01T${formData.schedule.startTime}:00`) >=
            new Date(`2000-01-01T${formData.schedule.endTime}:00`)
        ) {
          newErrors.endTime = "End time must be after start time";
        } else {
          delete newErrors[name];
        }
        break;

      case "latePenalty":
        if (value < 0 || value > 100) {
          newErrors.latePenalty = "Late penalty must be between 0 and 100";
        } else {
          delete newErrors.latePenalty;
        }
        break;

      case "attendanceWeight":
        if (value < 0 || value > 100) {
          newErrors.attendanceWeight =
            "Attendance weight must be between 0 and 100";
        } else {
          delete newErrors.attendanceWeight;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("schedule.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("settings.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [field]:
            type === "checkbox"
              ? checked
              : type === "number"
              ? parseInt(value)
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) : value,
      }));
    }

    // Validate field on change
    if (
      touched[name] ||
      name.startsWith("schedule.") ||
      name.startsWith("settings.")
    ) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleDayToggle = (day) => {
    const newDays = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter((d) => d !== day)
      : [...formData.schedule.days, day];

    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: newDays,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      if (key === "schedule") {
        Object.keys(formData.schedule).forEach((subKey) => {
          allTouched[`schedule.${subKey}`] = true;
        });
      }
      if (key === "settings") {
        Object.keys(formData.settings).forEach((subKey) => {
          allTouched[`settings.${subKey}`] = true;
        });
      }
    });
    setTouched(allTouched);

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    // Check if form is valid
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? "Edit Course" : "Create New Course"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter course title"
                  error={touched.title && errors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Code *
                </label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g., CS101"
                  className="uppercase"
                  error={touched.code && errors.code}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department *
                </label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Computer Science"
                  error={touched.department && errors.department}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credits *
                </label>
                <Input
                  name="credits"
                  type="number"
                  value={formData.credits}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min="1"
                  max="10"
                  error={touched.credits && errors.credits}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year *
                </label>
                <Input
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 2024-2025"
                  error={touched.academicYear && errors.academicYear}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter course description"
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.schedule.days.includes(day)
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <Input
                    name="schedule.startTime"
                    type="time"
                    value={formData.schedule.startTime}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={touched["schedule.startTime"] && errors.startTime}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <Input
                    name="schedule.endTime"
                    type="time"
                    value={formData.schedule.endTime}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={touched["schedule.endTime"] && errors.endTime}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <Input
                  name="schedule.location"
                  value={formData.schedule.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Campus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room
                </label>
                <Input
                  name="schedule.room"
                  value={formData.schedule.room}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 101"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="schedule.online"
                  checked={formData.schedule.online}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  This is an online course
                </span>
              </label>

              {formData.schedule.online && (
                <div className="mt-2">
                  <Input
                    name="schedule.meetingLink"
                    value={formData.schedule.meetingLink}
                    onChange={handleInputChange}
                    placeholder="Meeting link (Zoom, Teams, etc.)"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Course Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Late Penalty (%)
                </label>
                <Input
                  name="settings.latePenalty"
                  type="number"
                  value={formData.settings.latePenalty}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min="0"
                  max="100"
                  error={touched["settings.latePenalty"] && errors.latePenalty}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attendance Weight (%)
                </label>
                <Input
                  name="settings.attendanceWeight"
                  type="number"
                  value={formData.settings.attendanceWeight}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min="0"
                  max="100"
                  error={
                    touched["settings.attendanceWeight"] &&
                    errors.attendanceWeight
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.allowLateSubmissions"
                  checked={formData.settings.allowLateSubmissions}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Allow late submissions
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.requireAttendance"
                  checked={formData.settings.requireAttendance}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Require attendance
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.enableDiscussions"
                  checked={formData.settings.enableDiscussions}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable discussions
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.enableAnnouncements"
                  checked={formData.settings.enableAnnouncements}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable announcements
                </span>
              </label>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Update Course" : "Create Course"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CourseForm;

