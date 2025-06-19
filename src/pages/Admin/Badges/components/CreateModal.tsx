/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { BadgeDetails } from "../../../../types/Badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBadge, updateBadge } from "../../../../api/badge.api";
import { toast } from "react-toastify";
import type { CreateOrUpdateBadgeRequest } from "../../../../types/Badge";

interface CreateModalProps {
  badge?: BadgeDetails;
  onCancel: () => void;
  setShowCreateModal: any;
}

export default function CreateModal({
  badge,
  onCancel,
  setShowCreateModal,
}: CreateModalProps) {
  const [formData, setFormData] = useState({
    id: badge?.id,
    name: badge?.name || "",
    description: badge?.description || "",
    icon: badge?.icon_url || "🏆",
    xpRequired: badge?.xpRequired || 100,
    borrowedBookRequired: badge?.borrowedBooksRequired || 100,
    reviewsRequired: badge?.reviewsRequired || 100,
    category: badge?.category || "BOOK",
    xpAwarded: badge?.xpAwarded || 100,
  });

  console.log(formData);

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
    "🌱",
  ];

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateOrUpdateBadgeRequest) => createBadge(data),
    onSuccess: () => {
      toast.success("Tạo huy hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["getAllBadges"] });
      setShowCreateModal(false);
    },
    onError: (err) => {
      toast.error("Tạo huy hiệu thất bại!");
      console.error("Create badge error", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateOrUpdateBadgeRequest;
    }) => updateBadge(id, data),
    onSuccess: () => {
      toast.success("Chỉnh sửa huy hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["getAllBadges"] });
      setShowCreateModal(false);
    },
    onError: (err) => {
      toast.error("Chỉnh sửa huy hiệu thất bại!");
      console.error("Update badge error", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (badge) {
      updateMutation.mutate({
        id: Number(formData.id),
        data: {
          name: formData.name,
          description: formData.description,
          icon_url: formData.icon,
          xpRequired: formData.xpRequired,
          borrowedBooksRequired: formData.borrowedBookRequired,
          reviewsRequired: formData.reviewsRequired,
          xpAwarded: formData.xpAwarded,
          category: formData.category,
        },
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description,
        icon_url: formData.icon,
        xpRequired: formData.xpRequired,
        borrowedBooksRequired: formData.borrowedBookRequired,
        reviewsRequired: formData.reviewsRequired,
        xpAwarded: formData.xpAwarded,
        category: formData.category,
      });
    }
  };

  const categories = [
    { name: "Đọc sách", value: "BOOK" },
    { name: "Cộng đồng", value: "COMMUNITY" },
    { name: "Thành tựu", value: "ACHIEVEMENT" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {badge ? "Chỉnh sửa huy hiệu" : "Tạo huy hiệu"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-3 space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="vd: Mọt sách"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Thêm mô tả về huy hiệu này..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biểu tượng *
            </label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-2 cursor-pointer text-2xl border rounded-lg hover:bg-gray-50 ${
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
              placeholder="Hoặc nhập một biểu tượng..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điểm yêu cầu *
              </label>
              <input
                type="number"
                min="0"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số sách yêu cầu *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.borrowedBookRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    borrowedBookRequired: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số đánh giá yêu cầu *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.reviewsRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reviewsRequired: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điểm thưởng *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.xpAwarded}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    xpAwarded: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              disabled={createMutation.isPending}
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {createMutation.isPending
                ? "Đang xử lý"
                : `${badge ? "Cập nhật" : "Tạo"} huy hiệu`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
