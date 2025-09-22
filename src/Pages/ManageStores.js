import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Edit2,
  Globe,
  Trash2,
  Plus,
  Power,
  PowerOff,
  Building2,
  Star,
  Eye,
  ExternalLink,
  Calendar,
  HelpCircle,
} from "lucide-react";

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStore, setShowAddStore] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // Form state for add/edit store
  const [storeForm, setStoreForm] = useState({
    name: "",
    storeTitle: "",
    slug: "",
    dealInfo: "",
    description: "",
    storeAbout: "",
    websiteUrl: "",
    affiliateUrl: "",
    category: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    networkName: "",
    isActive: true,
    isFeatured: false,
    faq: [{ question: "", answer: "" }]
  });

  // Fetch stores and categories on component load
  useEffect(() => {
    getStores();
    extractCategories();
  }, []);

  const getStores = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem("adminToken");
      let response = await fetch("https://couponbackend.vercel.app/admin/api/stores", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      console.log("Stores data:", data);
      setStores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching stores:", e.message);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from stores
  const extractCategories = () => {
    const uniqueCategories = [...new Set(stores.map(store => store.category).filter(Boolean))];
    setCategories(uniqueCategories);
  };

  // Update categories when stores change
  useEffect(() => {
    extractCategories();
  }, [stores]);

  // Toggle store active/inactive
  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const store = stores.find(s => s._id === id);
      const updatedStatus = !store.isActive;

      const response = await fetch(`https://couponbackend.vercel.app/admin/api/updatestore/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: updatedStatus })
      });

      if (response.ok) {
        setStores(prev => prev.map(s => s._id === id ? { ...s, isActive: updatedStatus } : s));
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating store status:", error);
      alert("Error updating store status");
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const store = stores.find(s => s._id === id);
      const updatedFeatured = !store.isFeatured;

      const response = await fetch(`https://couponbackend.vercel.app/admin/api/updatestore/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isFeatured: updatedFeatured })
      });

      if (response.ok) {
        setStores(prev => prev.map(s => s._id === id ? { ...s, isFeatured: updatedFeatured } : s));
      } else {
        throw new Error("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      alert("Error updating featured status");
    }
  };

  // Delete single store
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        let token = localStorage.getItem("adminToken");
        let response = await fetch(`https://couponbackend.vercel.app/admin/api/deletestore/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          setStores(prev => prev.filter(s => s._id !== id));
          setSelectedStores(prev => prev.filter(storeId => storeId !== id));
        } else {
          throw new Error("Failed to delete store");
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        alert("Error deleting store");
      }
    }
  };

  // Select / Deselect stores
  const handleSelectStore = (id) => {
    setSelectedStores(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStores.length === filteredStores.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(filteredStores.map(s => s._id));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedStores.length === 0) return;

    if (window.confirm(`Delete ${selectedStores.length} selected store(s)?`)) {
      const token = localStorage.getItem("adminToken");

      try {
        await Promise.all(
          selectedStores.map(async (id) => {
            const response = await fetch(`https://couponbackend.vercel.app/admin/api/deletestore/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) throw new Error(`Failed to delete store ${id}`);
          })
        );

        setStores(prev => prev.filter(s => !selectedStores.includes(s._id)));
        setSelectedStores([]);
      } catch (error) {
        console.error("Error deleting stores:", error);
        alert("Error deleting some stores");
      }
    }
  };

  // Add/Edit Store Functions
  const handleAddStore = () => {
    setStoreForm({
      name: "",
      storeTitle: "",
      slug: "",
      dealInfo: "",
      description: "",
      storeAbout: "",
      websiteUrl: "",
      affiliateUrl: "",
      category: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      networkName: "",
      isActive: true,
      isFeatured: false,
      faq: [{ question: "", answer: "" }]
    });
    setEditingStore(null);
    setShowAddStore(true);
  };

  const handleEditStore = (store) => {
    setStoreForm({
      name: store.name || "",
      storeTitle: store.storeTitle || "",
      slug: store.slug || "",
      dealInfo: store.dealInfo || "",
      description: store.description || "",
      storeAbout: store.storeAbout || "",
      websiteUrl: store.websiteUrl || "",
      affiliateUrl: store.affiliateUrl || "",
      category: store.category || "",
      metaTitle: store.metaTitle || "",
      metaDescription: store.metaDescription || "",
      metaKeywords: store.metaKeywords ? store.metaKeywords.join(", ") : "",
      networkName: store.networkName || "",
      isActive: store.isActive !== undefined ? store.isActive : true,
      isFeatured: store.isFeatured !== undefined ? store.isFeatured : false,
      faq: store.faq && store.faq.length > 0 ? store.faq : [{ question: "", answer: "" }]
    });
    setEditingStore(store._id);
    setShowAddStore(true);
  };

  const handleSubmitStore = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(storeForm).forEach(key => {
        if (key === 'metaKeywords') {
          // Convert comma-separated string to array
          const keywordsArray = storeForm[key].split(',').map(k => k.trim()).filter(k => k);
          formData.append(key, JSON.stringify(keywordsArray));
        } else if (key === 'faq') {
          formData.append(key, JSON.stringify(storeForm[key].filter(faq => faq.question && faq.answer)));
        } else {
          formData.append(key, storeForm[key]);
        }
      });

      const url = editingStore 
        ? `https://couponbackend.vercel.app/admin/api/updatestore/${editingStore}`
        : 'https://couponbackend.vercel.app/admin/api/store';

      const response = await fetch(url, {
        method: editingStore ? 'PATCH' : 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        await getStores(); // Refresh the stores list
        setShowAddStore(false);
        setEditingStore(null);
      } else {
        throw new Error("Failed to save store");
      }
    } catch (error) {
      console.error("Error saving store:", error);
      alert("Error saving store");
    }
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaq = [...storeForm.faq];
    updatedFaq[index][field] = value;
    setStoreForm(prev => ({ ...prev, faq: updatedFaq }));
  };

  const addFaq = () => {
    setStoreForm(prev => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }]
    }));
  };

  const removeFaq = (index) => {
    setStoreForm(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filtering
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.networkName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filterCategory || store.category === filterCategory;

    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "active" && store.isActive) ||
      (filterStatus === "inactive" && !store.isActive);

    const matchesFeatured =
      filterFeatured === "" ||
      (filterFeatured === "featured" && store.isFeatured) ||
      (filterFeatured === "not-featured" && !store.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-600" />
          Store Management
        </h1>
        <button 
          onClick={handleAddStore}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </button>
      </div>

      {/* Add/Edit Store Modal */}
      {showAddStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingStore ? 'Edit Store' : 'Add New Store'}
              </h2>
              <form onSubmit={handleSubmitStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.name}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Store Title *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.storeTitle}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, storeTitle: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.slug}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.category}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* URLs */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">URLs</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <input
                    type="url"
                    value={storeForm.websiteUrl}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Affiliate URL</label>
                  <input
                    type="url"
                    value={storeForm.affiliateUrl}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, affiliateUrl: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Descriptions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={storeForm.description}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Store About</label>
                  <textarea
                    value={storeForm.storeAbout}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, storeAbout: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Deal Info</label>
                  <input
                    type="text"
                    value={storeForm.dealInfo}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, dealInfo: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* SEO */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">SEO Settings</h3>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={storeForm.metaTitle}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea
                    value={storeForm.metaDescription}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Meta Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={storeForm.metaKeywords}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, metaKeywords: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Network */}
                <div>
                  <label className="block text-sm font-medium mb-1">Network Name</label>
                  <input
                    type="text"
                    value={storeForm.networkName}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, networkName: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* FAQ Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">FAQ</h3>
                  {storeForm.faq.map((faq, index) => (
                    <div key={index} className="mb-4 p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">FAQ {index + 1}</label>
                        {storeForm.faq.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mb-2"
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        rows="2"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="text-blue-600 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add FAQ
                  </button>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={storeForm.isActive}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={storeForm.isFeatured}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStore(false);
                      setEditingStore(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingStore ? 'Update Store' : 'Add Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same as before */}
      {/* Filters, Bulk Actions, Stores Display, etc. */}
      {/* ... (The rest of your existing JSX code for filters, grid/table view, etc.) */}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Stores</option>
          <option value="featured">Featured</option>
          <option value="not-featured">Not Featured</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("");
              setFilterStatus("");
              setFilterFeatured("");
            }}
            className="flex items-center justify-center border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Filter className="w-4 h-4 mr-1" /> Clear
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded ${
              viewMode === "table" ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStores.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center">
          <span>{selectedStores.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Stores Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store._id)}
                  onChange={() => handleSelectStore(store._id)}
                  className="w-4 h-4"
                />
                <img
                  src={store.logoUrl || "https://via.placeholder.com/60"}
                  alt={store.name}
                  className="w-12 h-12 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{store.name}</h3>
                    {store.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{store.storeTitle}</p>
                </div>
              </div>

              {/* Slug */}
              <p className="text-xs text-gray-400 mb-2">/{store.slug}</p>

              {/* Deal Info */}
              {store.dealInfo && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                  <p className="text-sm font-medium text-orange-800">{store.dealInfo}</p>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {store.description}
              </p>

              {/* Category and Network */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {store.category}
                </span>
                {store.networkName && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {store.networkName}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {store.clickCount || 0} clicks
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(store.createdAt)}
                </div>
                {store.faq && store.faq.length > 0 && (
                  <div className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    {store.faq.length} FAQs
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(store._id)}
                    className={`px-2 py-1 text-xs rounded-full transition ${
                      store.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {store.isActive ? (
                      <Power className="inline w-3 h-3 mr-1" />
                    ) : (
                      <PowerOff className="inline w-3 h-3 mr-1" />
                    )}
                    {store.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(store._id)}
                    className={`px-2 py-1 text-xs rounded-full transition ${
                      store.isFeatured
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Star className={`inline w-3 h-3 mr-1 ${store.isFeatured ? 'fill-current' : ''}`} />
                    {store.isFeatured ? "Featured" : "Feature"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditStore(store)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                  {store.affiliateUrl && (
                    <a
                      href={store.affiliateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(store._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedStores.length === filteredStores.length &&
                      filteredStores.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3">Store</th>
                <th className="p-3">Category</th>
                <th className="p-3">Network</th>
                <th className="p-3">Status</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(store._id)}
                      onChange={() => handleSelectStore(store._id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={store.logoUrl || "https://via.placeholder.com/60"}
                        alt={store.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{store.name}</span>
                          {store.isFeatured && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{store.storeTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{store.category}</td>
                  <td className="p-3">{store.networkName || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      store.isActive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">{store.clickCount || 0}</td>
                  <td className="p-3 text-sm">{formatDate(store.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditStore(store)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <a
                        href={store.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                      {store.affiliateUrl && (
                        <a
                          href={store.affiliateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(store._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredStores.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCategory || filterStatus || filterFeatured
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first store"}
          </p>
          <button 
            onClick={handleAddStore}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Store
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageStores;