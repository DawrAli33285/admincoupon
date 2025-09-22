import React, { useState, useMemo ,useEffect} from 'react';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  Edit2,
  Globe,
  Trash2,
  Plus,
  Power,
  PowerOff,
  Tag,
  Star,
  Shield,
  Clock,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";

const ManageCoupons = () => {
  const [coupons,setCoupons] = useState([
    {
      _id: "68c16623a6db3fd5c576a3e1",
      title: "Summer Sale Special",
      displayTitle: "Get 50% Off Everything",
      code: "SUMMER50",
      couponType: "featured",
      discountType: "percentage",
      discountValue: 50,
      description: "Amazing summer discount on all items",
      startDate: "2025-09-10T00:00:00.000Z",
      endDate: "2025-09-25T00:00:00.000Z",
      isActive: true,
      isFeatured: true,
      isExclusive: false,
      isVerified: true,
      isExpirySoon: false,
      bannerImage: "https://res.cloudinary.com/dbjwbveqn/image/upload/v1757505058/coupon-banners/bannerImage-1757505042118-506223613_rfy4ze.jpg",
      deepLink: "http://localhost:3000/coupons/create",
      storeId: {
        _id: '68c16485a6db3fd5c576a3c0',
        name: 'Amazon',
        logoUrl: 'https://res.cloudinary.com/dbjwbveqn/image/upload/v1757504606778-887356365_j6mv80.jpg'
      },
      tags: ['summersale', 'electronics'],
      clickCount: 125,
      slug: "summer-sale-special",
      priority: 1
    },
    {
      _id: "68c16623a6db3fd5c576a3e2",
      title: "Exclusive Deal",
      displayTitle: "Exclusive $25 Off",
      code: "EXCLUSIVE25",
      couponType: "exclusive",
      discountType: "fixed",
      discountValue: 25,
      description: "Exclusive discount for premium members",
      startDate: "2025-09-05T00:00:00.000Z",
      endDate: "2025-09-15T00:00:00.000Z",
      isActive: true,
      isFeatured: false,
      isExclusive: true,
      isVerified: true,
      isExpirySoon: true,
      bannerImage: null,
      deepLink: "https://example.com/deal",
      storeId: {
        _id: '68c16485a6db3fd5c576a3c1',
        name: 'Best Buy',
        logoUrl: 'https://example.com/bestbuy-logo.jpg'
      },
      tags: ['exclusive', 'electronics'],
      clickCount: 89,
      slug: "exclusive-deal",
      priority: 2
    }
  ]);

  const [categories] = useState([
    { _id: '1', name: 'Electronics' },
    { _id: '2', name: 'Fashion' },
    { _id: '3', name: 'Home & Garden' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  // Get unique stores from coupons
  const uniqueStores = useMemo(() => {
    return [...new Set(coupons.map(coupon => coupon.storeId.name))];
  }, [coupons]);

  // Filter coupons based on search and filters
  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon => {
      const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           coupon.storeId.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStore = !filterStore || coupon.storeId.name === filterStore;
      const matchesStatus = !filterStatus || 
                           (filterStatus === 'active' && coupon.isActive) ||
                           (filterStatus === 'inactive' && !coupon.isActive);
      
      return matchesSearch && matchesStore && matchesStatus;
    });
  }, [coupons, searchTerm, filterStore, filterStatus]);

  // Helper functions
  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const expiresSoon = (endDate, isExpirySoon) => {
    return isExpirySoon || (endDate && new Date(endDate) - new Date() < 7 * 24 * 60 * 60 * 1000);
  };

  const formatDiscount = (type, value) => {
    return type === 'percentage' ? `${value}% OFF` : `$${value} OFF`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  // Event handlers
  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId) 
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCoupons(
      selectedCoupons.length === filteredCoupons.length 
        ? [] 
        : filteredCoupons.map(c => c._id)
    );
  };

  const handleToggleStatus = (couponId) => {
    // In real app, this would make an API call
    console.log('Toggle status for coupon:', couponId);
  };

  const handleDelete =async (couponId) => {
    // In real app, this would make an API call
    console.log('Delete coupon:', couponId);

    try{
let token=localStorage.getItem("adminToken")
let response = await fetch(`https://couponbackend.vercel.app/admin/api/coupon/${couponId}`, { 
  method: "DELETE", // or POST/PUT/DELETE depending on your API 
  headers: {
    "Authorization": `Bearer ${token}`,   // attach token
    "Content-Type": "application/json"    // keep if sending/expecting JSON
  }
});

setCoupons((prev)=>{
  return prev.filter(u=>u._id!=couponId)
})

    }catch(e){

    }
  };

  
  useEffect(()=>{
    getCoupons();
      },[])
    
      const getCoupons=async()=>{
        try{
          
          let token = localStorage.getItem("adminToken");
    
          let response = await fetch("https://couponbackend.vercel.app/admin/api/coupons", {
            method: "GET", // or POST/PUT/DELETE depending on your API
            headers: {
              "Authorization": `Bearer ${token}`,   // attach token
              "Content-Type": "application/json"    // keep if sending/expecting JSON
            }
          });
          let data = await response.json();
         console.log(data)
         setCoupons(data)
        }catch(e){
    console.log(e.message)
        }
      }

      const handleBulkDelete = async () => {
        if (selectedCoupons.length === 0) return;
      
        console.log("Bulk delete coupons:", selectedCoupons);
      
        const token = localStorage.getItem("adminToken");
      
        try {
          // Run delete requests in parallel for better performance
          await Promise.all(
            selectedCoupons.map((id) =>
              fetch(`https://couponbackend.vercel.app/admin/api/coupon/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
            )
          );
      
          console.log("Bulk delete successful");
          setSelectedCoupons([]);
          setCoupons((prev) => prev.filter((coupon) => !selectedCoupons.includes(coupon._id)));

        } catch (error) {
          console.error("Error deleting coupons:", error);
        }
      };
      

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Tag className="w-7 h-7 text-blue-600" />
        Coupon Management
      </h1>
      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        <Plus className="w-4 h-4 mr-2" />
        Add Coupon
      </button>
    </div>

    {/* Filters */}
    <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search coupons..."
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
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={filterStore}
        onChange={(e) => setFilterStore(e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="">All Stores</option>
        {uniqueStores.map((store) => (
          <option key={store} value={store}>
            {store}
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
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterCategory("");
            setFilterStatus("");
            setFilterStore("");
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
    {selectedCoupons.length > 0 && (
      <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center">
        <span>{selectedCoupons.length} selected</span>
        <button
          onClick={handleBulkDelete}
          className="text-red-600 hover:text-red-800"
        >
          Delete Selected
        </button>
      </div>
    )}

    {/* Coupons Display */}
    {viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={selectedCoupons.includes(coupon._id)}
                onChange={() => handleSelectCoupon(coupon._id)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {coupon.code}
                  </span>
                  <span className="text-xs text-gray-500">{coupon.storeId.name}</span>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            {coupon.bannerImage && (
              <img
                src={coupon.bannerImage}
                alt={coupon.title}
                className="w-full h-20 object-cover rounded mb-3"
              />
            )}

            {/* Tags */}
            <div className="flex gap-1 mb-2 flex-wrap">
              {coupon.isFeatured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </span>
              )}
              {coupon.isExclusive && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Exclusive
                </span>
              )}
              {coupon.isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              )}
              {(expiresSoon(coupon.endDate, coupon.isExpirySoon) && !isExpired(coupon.endDate)) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Expires Soon
                </span>
              )}
              {isExpired(coupon.endDate) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>

            {/* Discount Info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                {coupon.discountType === 'percentage' && <Percent className="w-4 h-4 text-green-600" />}
                {coupon.discountType === 'fixed' && <DollarSign className="w-4 h-4 text-green-600" />}
                <span className="font-semibold text-green-600">
                  {formatDiscount(coupon.discountType, coupon.discountValue)}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {coupon.description || coupon.displayTitle}
              </p>
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
            </div>

            {/* Click Count */}
            <div className="text-xs text-gray-500 mb-3">
              {coupon.clickCount} clicks
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleToggleStatus(coupon._id)}
                className={`px-3 py-1 text-xs rounded-full transition ${
                  coupon.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {coupon.isActive ? (
                  <Power className="inline w-3 h-3 mr-1" />
                ) : (
                  <PowerOff className="inline w-3 h-3 mr-1" />
                )}
                {coupon.isActive ? "Active" : "Inactive"}
              </button>
              <div className="flex gap-2">
                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <a
                  href={coupon.deepLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(coupon._id)}
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
                    selectedCoupons.length === filteredCoupons.length &&
                    filteredCoupons.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">Coupon</th>
              <th className="p-3">Store</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedCoupons.includes(coupon._id)}
                    onChange={() => handleSelectCoupon(coupon._id)}
                  />
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{coupon.title}</div>
                    <div className="text-sm text-gray-500 font-mono">{coupon.code}</div>
                  </div>
                </td>
                <td className="p-3">{coupon.storeId.name}</td>
                <td className="p-3">
                  <span className="font-semibold text-green-600">
                    {formatDiscount(coupon.discountType, coupon.discountValue)}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <div>{formatDate(coupon.startDate)}</div>
                  <div className="text-gray-500">{formatDate(coupon.endDate)}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    coupon.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {coupon.isFeatured && <Star className="w-3 h-3 text-yellow-500" />}
                    {coupon.isExclusive && <Shield className="w-3 h-3 text-purple-500" />}
                    {coupon.isVerified && <span className="text-green-500 text-xs">✓</span>}
                  </div>
                </td>
                <td className="p-3 text-sm">{coupon.clickCount}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <a
                      href={coupon.deepLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(coupon._id)}
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
    {filteredCoupons.length === 0 && (
      <div className="text-center py-12">
        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
        <p className="text-gray-500 mb-4">
          {searchTerm || filterCategory || filterStatus || filterStore
            ? "Try adjusting your search or filter criteria"
            : "Get started by adding your first coupon"}
        </p>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </button>
      </div>
    )}
  </div>
  );
};

export default ManageCoupons;