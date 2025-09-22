import React, { useState, useEffect } from 'react';
import { Calendar, Upload, X, Check, AlertCircle, Tag, Star, Shield, Clock } from 'lucide-react';

const CreateCoupon = () => {
  const [storesData,setStoresData]=useState([])
  const [formData, setFormData] = useState({
    couponTitle: '',
    code: '',
    deepLink: '',
    metaKeywords: '',
    metaDescription: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    featured: false,
    exclusive: false,
    verified: false,
    expirySoon: false,
    storeName: '',
    termsConditions: '',
    shortDescription: '',
    bannerImage: null
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Toggle between select and custom input for store name
  const [storeInputType, setStoreInputType] = useState('select');
  const toggleStoreInput = () => {
    setStoreInputType((prev) => (prev === 'select' ? 'custom' : 'select'));
    setFormData((prev) => ({ ...prev, storeName: '', customStoreName: '' }));
  };

  // Sample store data
  const stores = [
    'Amazon', 'Walmart', 'Target', 'Best Buy', 'Nike', 'Adidas', 
    'Apple', 'Samsung', 'Dell', 'HP', 'Other'
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          bannerImage: 'Image size must be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({
          ...prev,
          bannerImage: file
        }));
        setErrors(prev => ({
          ...prev,
          bannerImage: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      bannerImage: null
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.couponTitle.trim()) {
      newErrors.couponTitle = 'Coupon title is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    }

    if (!formData.deepLink.trim()) {
      newErrors.deepLink = 'Deep link is required';
    } else if (!/^https?:\/\/.+/.test(formData.deepLink)) {
      newErrors.deepLink = 'Please enter a valid URL';
    }

    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required for SEO';
    } else if (formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be under 160 characters';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.storeName) {
      newErrors.storeName = 'Store selection is required';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required for modal display';
    }

    if (formData.featured && !formData.bannerImage) {
      newErrors.bannerImage = 'Banner image is required for featured coupons';
    }

    // If no end date, expiry soon should be enabled
    if (!formData.endDate && !formData.expirySoon) {
      newErrors.expirySoon = 'Enable "Expiry Soon" if no end date is provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(()=>{
getStoresData();
  },[])

  const getStoresData = async () => {
    let token = localStorage.getItem("adminToken");
    
    if (!token) {
      console.error('No admin token found');
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch("https://couponbackend.vercel.app/admin/api/stores", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
   console.log("GET STORES")
      console.log(data)
      setStoresData(data)
      // ... rest of the code
    } catch (e) {
      // ... error handling
      console.log(e.message)
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    
   
      try {
        // Create FormData for multipart/form-data (required for file uploads)
        const form_data = new FormData();
        
        // Append all form fields with backend property names
        form_data.append('title', formData.couponTitle);
        form_data.append('description', formData.shortDescription);
        form_data.append('code', formData.code);
        form_data.append('deepLink', formData.deepLink);
        
        // Handle metaKeywords array
        if (formData.metaKeywords) {
          const keywordsArray = formData.metaKeywords.split(',').map(keyword => keyword.trim());
          keywordsArray.forEach((keyword, index) => {
            form_data.append(`metaKeywords[${index}]`, keyword);
          });
        }
        
        form_data.append('metaDescription', formData.metaDescription);
        form_data.append('discountType', formData.discountType);
        form_data.append('discountValue', parseFloat(formData.discountValue));
        form_data.append('startDate', formData.startDate);
        form_data.append('endDate', formData.endDate);
        form_data.append('isFeatured', formData.featured);
        form_data.append('isExclusive', formData.exclusive);
        form_data.append('isVerified', formData.verified);
        form_data.append('isExpirySoon', formData.expirySoon);
        form_data.append('storeId', formData.storeName); // Assuming this contains the store ID
        form_data.append('termsConditions', formData.termsConditions);
        
        // Handle file upload
        if (formData.bannerImage) {
          form_data.append('bannerImage', formData.bannerImage);
        }
        
        // Add optional fields
        const couponType = formData.featured ? 'featured' : 
                          formData.exclusive ? 'exclusive' : 
                          formData.verified ? 'verified' : 'regular';
        form_data.append('couponType', couponType);
        form_data.append('displayTitle', formData.couponTitle);
        
        // Generate and append slug
        const slug = formData.couponTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        form_data.append('slug', slug);
        
        // Add createdBy if you have user context
        // form_data.append('createdBy', userId);
let token=localStorage.getItem('adminToken')
        // Make API call with FormData (don't set Content-Type header, let browser set it)
        const response = await fetch('https://couponbackend.vercel.app/admin/api/coupon', {
          method: 'POST',
          // Don't set Content-Type header for FormData - browser will set it with boundary
          headers: {
            // Add authentication headers if needed
            'Authorization': `Bearer ${token}`,
          },
          body: form_data
        });
  console.log(response)
        if (response.ok) {
          const result = await response.json();
          console.log('Coupon created successfully:', result);
          alert('Coupon saved successfully!');
          
          // Reset form after successful submission
          setFormData({
            couponTitle: '',
            code: '',
            deepLink: '',
            metaKeywords: '',
            metaDescription: '',
            discountType: 'percentage',
            discountValue: '',
            startDate: '',
            endDate: '',
            featured: false,
            exclusive: false,
            verified: false,
            expirySoon: false,
            storeName: '',
            termsConditions: '',
            shortDescription: '',
            bannerImage: null
          });
        } else {
          const errorData = await response.json();
          console.error('Error creating coupon:', errorData);
          alert(`Error: ${errorData.message || 'Failed to save coupon'}`);
        }
      } catch (error) {
        console.error('Network error:', error.message);
        alert('Network error: Unable to save coupon');
      }
    
  };
  // Auto-generate code from title
  const generateCode = () => {
    const code = formData.couponTitle
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 12);
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
        <p className="text-gray-600">Create and manage coupon codes with SEO optimization and frontend visibility controls</p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Title *
              </label>
              <input
                type="text"
                name="couponTitle"
                value={formData.couponTitle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.couponTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Summer Sale 50% Off"
              />
              {errors.couponTitle && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.couponTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code *
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="SUMMER50"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Generate
                </button>
              </div>
              {errors.code && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.code}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deep Link *
            </label>
            <input
              type="url"
              name="deepLink"
              value={formData.deepLink}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deepLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://store.com/promo/summer50"
            />
            {errors.deepLink && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.deepLink}
              </p>
            )}
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO & Frontend Display</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords <span className="text-gray-500">(shown on frontend)</span>
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="summer sale, discount, coupon, savings"
              />
              <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description *
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.metaDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Save big with our exclusive summer sale coupon. Get up to 50% off on selected items."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.metaDescription ? (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.metaDescription}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Optimal length: 120-160 characters</p>
                )}
                <span className={`text-sm ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.metaDescription.length}/160
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Store Name * <span className="text-gray-500">(shown on frontend)</span>
                </label>
                <button
                  type="button"
                  onClick={toggleStoreInput}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {storeInputType === 'select' ? 'Write custom store' : 'Select from list'}
                </button>
              </div>
              
              {storeInputType === 'select' ? (
                <select
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.storeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a store</option>
                  {storesData?.map((store) => (
                    <option key={store?._id} value={store?._id}>{store?.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="customStoreName"
                  value={formData.customStoreName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.storeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter custom store name"
                />
              )}
              
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.storeName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Discount Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Discount Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
                <option value="free-shipping">Free Shipping</option>
                <option value="bogo">Buy One Get One</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.discountValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                  min="0"
                />
                <span className="absolute right-3 top-2 text-gray-500">
                  {formData.discountType === 'percentage' ? '%' : formData.discountType === 'fixed' ? '$' : ''}
                </span>
              </div>
              {errors.discountValue && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Date Management */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Date Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {!formData.endDate && (
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="expirySoon"
                  checked={formData.expirySoon}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Mark as "Expiry Soon"
                </span>
              </label>
              {errors.expirySoon && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.expirySoon}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Status Toggles */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status & Visibility</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  Featured
                </div>
                <p className="text-xs text-gray-500">Show on homepage</p>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="exclusive"
                checked={formData.exclusive}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Shield className="w-4 h-4 mr-1 text-purple-500" />
                  Exclusive
                </div>
                <p className="text-xs text-gray-500">Limited offer</p>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  Verified
                </div>
                <p className="text-xs text-gray-500">Tested & working</p>
              </div>
            </label>
          </div>

          {formData.featured && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <Star className="w-4 h-4 inline mr-1" />
                Featured coupons will appear on the homepage with appropriate tags and require a banner image.
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Content</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description * <span className="text-gray-500">(for modal display)</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the offer for popup display"
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.shortDescription}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                name="termsConditions"
                value={formData.termsConditions}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter terms and conditions for this coupon..."
              />
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Banner Image {formData.featured && <span className="text-red-500 ml-1">*</span>}
          </h2>
          
          <div className="space-y-4">
            {!previewImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="banner-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload banner image
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB. Recommended: 1200x400px
                    </span>
                  </label>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {errors.bannerImage && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.bannerImage}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Publish Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;