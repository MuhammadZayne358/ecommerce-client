import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import {  getCategoryById, updateCategory } from "../../api/categoryApi";
import { ArrowLeft, Save } from "lucide-react";

const EditCategory = () => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const[loading, setLoading] = useState(true);
    const[saving, setSaving] = useState(false);
    const[error, setError] = useState("");

    useEffect(() => {
        const loadCategory =async() => {
            if(!id) {
                setError("Invalid category ID.");
                setLoading(false);
                return;
            }
            try{
                const response = await getCategoryById(Number(id));

                setName(response.name);
                setDescription(response.description || "");
                setIsActive(response.isActive);
            }catch (err: any){
                setError(
                    err.response?.data?.message ||
                    "Failed to load category."
                );
            } finally {
                setLoading(false);
            }
        };
        loadCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if(!name.trim()){
            setError("Category name is required.");
            return;
        }
        if(!id) {
            setError("Invalid category ID.");
            return;
        }
        try{
            setSaving(true);

            await updateCategory(Number(id),{
                name: name.trim(),
                description: description.trim(),
                isActive,
            });
            navigate("/admin/categories");
        } catch (err: any){
            setError(
                err.response?.data?.message ||
                "Failed to update category."
            );
        } finally {
            setSaving(false);
        }
    };

    if(loading){
         return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Loading category...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Category
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update category information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Category Status
              </p>
              <p className="text-sm text-gray-500">
                Inactive categories can be hidden from customers.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {isActive ? "Active" : "Inactive"}
              </span>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />

              {saving ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
