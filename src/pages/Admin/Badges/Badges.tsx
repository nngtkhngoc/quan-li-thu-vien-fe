import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { deleteBadge, getBadges } from "../../../api/badge.api";
import StatsCard from "./components/StatsCard";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import BadgeGrid from "./components/BadgeGrid";
import { toast } from "react-toastify";

import DeleteConfirmModal from "./components/DeleteModal";
import CreateModal from "./components/CreateModal";

export type Category = {
  name: string;
  value: string;
};

export default function Badges() {
  const { data: totalBadges, isLoading: isTotalLoading } = useQuery({
    queryKey: ["getAllBadges"],
    queryFn: () => getBadges(),
  });

  const isLoading = isTotalLoading;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<number | null>(null);

  const categories = [
    { name: "Đọc sách", value: "BOOK" },
    { name: "Cộng đồng", value: "COMMUNITY" },
    { name: "Thành tựu", value: "ACHIEVEMENT" },
  ];

  const filteredBadges = totalBadges?.data.filter((badge) => {
    const matchesSearch =
      badge.badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || badge.badge.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBadges"] });
      toast.success("Xóa huy hiệu thành công!");
      setShowDeleteModal(false);
    },
    onError: (err) => {
      console.error("Delete error", err);
      toast.error("Xóa huy hiệu thất bại!");
    },
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý huy hiệu</h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý huy hiệu cho người dùng
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo huy hiệu
        </button>
      </div>

      <StatsCard badges={totalBadges?.data ?? []} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />

      <BadgeGrid
        filteredBadges={filteredBadges ?? []}
        setDeleteBadge={setShowDeleteModal}
        setSelectedBadgeId={setSelectedBadgeId}
        setShowEditModal={setShowEditModal}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (selectedBadgeId !== null) {
            deleteMutation.mutate(selectedBadgeId);
          }
        }}
        isPending={deleteMutation.isPending}
      />

      {showAddModal && (
        <CreateModal
          onCancel={() => setShowAddModal(false)}
          setShowCreateModal={setShowAddModal}
        />
      )}

      {showEditModal && (
        <CreateModal
          badge={showEditModal}
          onCancel={() => setShowEditModal(null)}
          setShowCreateModal={setShowAddModal}
        />
      )}
    </div>
  );
}
