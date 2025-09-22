import { useState } from "react";
import { X, Settings, Globe, Upload, Search, Calendar } from "lucide-react";

const EditStoreModal = ({ store, categories, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: store.name || "",
    storeTitle: store.storeTitle || "",
    storeDealInfo: store.storeDealInfo || "",
    description: store.description || "",
    slug: store.slug || "",
    websiteUrl: store.websiteUrl || "",
    affiliateUrl: store.affiliateUrl || "",
    category: store.category?._id || "",
    metaTitle: store.metaTitle || "",
    metaDescription: store.metaDescription || "",
    metaKeywords: store.metaKeywords || "",
    networkName: store.networkName || "",
    isActive: store.isActive || false,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSave = () => {
    const updatedStore = {
      ...store,
      ...formData,
      logo: selectedFile || store.logoUrl,
    };
    onUpdate(updatedStore);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Store</h2>
              <p className="text-gray-600 mt-1">Update store information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Store Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Store Title"
                    value={formData.storeTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, storeTitle: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Deal Info (e.g., 50% off)"
                    value={formData.storeDealInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storeDealInfo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500"
                  />

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Store Logo
                </h3>
                <div className="border-2 border-dashed p-6 rounded-lg text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-16 h-16 mx-auto rounded-lg object-cover"
                      />
                    ) : store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt="Current logo"
                        className="w-16 h-16 mx-auto rounded-lg object-cover"
                      />
                    ) : (
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    )}
                    <p className="text-sm text-gray-600 mt-2">Upload Logo</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Links */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-600" />
                  URLs & Links
                </h3>
                <input
                  type="text"
                  placeholder="Slug (SEO URL)"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Website URL"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Affiliate URL"
                  value={formData.affiliateUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, affiliateUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SEO */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-orange-600" />
                  SEO Settings
                </h3>
                <input
                  type="text"
                  placeholder="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 mb-4 border rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Meta Keywords"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaKeywords: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Network Name"
                  value={formData.networkName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      networkName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <label className="flex items-center mt-4 space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active Status</span>
                </label>
              </div>

              {/* Created Info */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Store Info
                </h4>
                <p className="text-sm text-gray-600">
                  Created:{" "}
                  {new Date(store.createdAt).toLocaleDateString("en-US")}
                </p>
                <p className="text-sm text-gray-600">ID: {store._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoreModal;
