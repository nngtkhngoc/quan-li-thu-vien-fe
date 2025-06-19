import { useState } from "react";
import type { BadgeDetails } from "../../../../types/Badge";

export default function CreateModal() {
  const BadgeForm = ({
    badge,
    onSave,
    onCancel,
  }: {
    badge?: BadgeDetails;
    onSave: (badge: Omit<BadgeDetails, "id" | "earnedBy">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: badge?.name || "",
      description: badge?.description || "",
      icon: badge?.icon_url || "🏆",
      xpRequired: badge?.xpRequired || 100,
      borrowedBookRequired: badge?.borrowedBooksRequired || 100,
      reviewsRequired: badge?.reviewsRequired || 100,
      category: badge?.category || "Reading",
    });

    const commonIcons = [
      "🏆",
      "📚",
      "⭐",
      "🎯",
      "🔥",
      "💎",
      "👑",
      "🚀",
      "⚡",
      "🌟",
      "🎖️",
      "🏅",
    ];

    // const categoryColors = {
    //   BOOK: "bg-blue-100 text-blue-800",
    //   COMMUNITY: "bg-emerald-100 text-emerald-800",
    //   ACHIEVEMENT: "bg-purple-100 text-purple-800",
    // };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      //   onSave(formData);
    };

    const categories = ["All", "Reading", "Community", "Achievement"];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {badge ? "Edit Badge" : "Create New Badge"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Bookworm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe how to earn this badge..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon *
              </label>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-2 text-2xl border rounded-lg hover:bg-gray-50 ${
                      formData.icon === icon
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Or enter custom emoji"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      //   category: e.target.value as Badge["category"],
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  XP Required *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.xpRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      xpRequired: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                {badge ? "Update" : "Create"} Badge
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}
