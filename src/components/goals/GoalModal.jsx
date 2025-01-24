import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { goalCategories } from "../../utils/goalConfig";
import { showToast } from "../Toast";

const GoalModal = ({
  isOpen,
  onClose,
  initialGoal = null,
  addGoal,
  updateGoal,
}) => {
  // Format date helper function
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: initialGoal?.title || "",
    category: initialGoal?.category || "",
    target: initialGoal?.target || "",
    Progress: initialGoal?.Progress || 0,
    duedate: initialGoal?.duedate || "",
    description: initialGoal?.description || "",
  });

  useEffect(() => {
    if (initialGoal) {
      setFormData({
        title: initialGoal.title || "",
        category: initialGoal.category || "",
        target: initialGoal.target || "",
        Progress: initialGoal.Progress || 0,
        duedate: formatDateForInput(initialGoal.duedate),
        description: initialGoal.description || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        target: "",
        Progress: 0,
        duedate: "",
        description: "",
      });
    }
  }, [initialGoal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: formData.title,
        category: formData.category,
        target: parseInt(formData.target),
        Progress: initialGoal ? parseInt(formData.Progress) : 0,
        duedate: formData.duedate,
        description: formData.description,
      };

      if (initialGoal) {
        await updateGoal(initialGoal.$id, data);
        showToast("Goal updated successfully", "success");
      } else {
        await addGoal(data);
        showToast("Goal created successfully", "success");
      }
      onClose();
    } catch (error) {
      console.error("Error saving goal:", error);
      showToast("Failed to save goal", "error");
    }
  };

  const handleProgressUpdate = (newProgress) => {
    setFormData((prev) => ({
      ...prev,
      Progress: Math.min(Math.max(0, newProgress), prev.target),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-6 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100">
            {initialGoal ? "Update Goal" : "Create New Goal"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(goalCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Target
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                min="0"
              />
            </div>

            {initialGoal && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Current Progress
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.Progress}
                    onChange={(e) =>
                      handleProgressUpdate(parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min="0"
                    max={formData.target}
                  />
                  <div className="text-sm text-slate-400">
                    {((formData.Progress / formData.target) * 100).toFixed(0)}%
                  </div>
                </div>

                {/* Quick Progress Update Buttons */}
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() =>
                        handleProgressUpdate((formData.target * percent) / 100)
                      }
                      className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={formData.duedate}
              onChange={(e) =>
                setFormData({ ...formData, duedate: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            >
              {initialGoal ? "Save Changes" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
