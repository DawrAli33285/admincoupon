import React, { useState } from 'react';
import {
  Upload,
  Eye,
  ChevronRight,
  Settings,
  Tag,
  Search,
  HelpCircle,
  Plus,
  Trash2,
  X,
  Globe
} from 'lucide-react';

const CreateStore = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    storeTitle: '',
    storeDealInfo: '',
    description: '',
    headingText: '',
    slug: '',
    websiteUrl: '',
    affiliateUrl: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    networkName: '',
    isActive: true,
    createdDate: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { _id: '1', name: 'Clothing & Accessories' },
    { _id: '2', name: 'Departmental Stores' },
    { _id: '3', name: 'Health & Beauty' },
    { _id: '4', name: 'Baby & Kids' },
    { _id: '5', name: 'Gifts & Crafts' },
    { _id: '6', name: 'Computer and Softwares' },
    { _id: '7', name: 'Electronics & Appliances' },
    { _id: '8', name: 'Food & Restaurants' },
    { _id: '9', name: 'Sports & Outdoors' },
    { _id: '10', name: 'Travel & Holidays' },
    { _id: '11', name: 'Internet Services' },
    { _id: '12', name: 'Flowers & Gifts' },
    { _id: '13', name: 'Home & Garden' },
    { _id: '14', name: 'Jewelry & Watches' },
    { _id: '15', name: 'Books & Stationery' },
    { _id: '16', name: 'Toys & Games' },
    { _id: '17', name: 'Automotive' },
    { _id: '18', name: 'Pet Supplies' },
    { _id: '19', name: 'Entertainment' },
    { _id: '20', name: 'Financial Services' },
    { _id: '21', name: 'Education & Learning' },
    { _id: '22', name: 'Others' }
  ];

  const steps = [
    { id: 1, title: 'Store Details', description: 'Add store name & details', icon: Settings },
    { id: 2, title: 'Store Gallery', description: 'Upload store logo', icon: Upload },
    { id: 3, title: 'Store Categories', description: 'Add store category & URLs', icon: Tag },
    { id: 4, title: 'SEO Settings', description: 'Add meta details & SEO', icon: Search },
    { id: 5, title: 'FAQ & Advanced', description: 'Add FAQs & network details', icon: HelpCircle }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from store name
    if (field === 'name' && value) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }
  
      // Create FormData for multipart/form-data (required for file uploads)
      const form_data = new FormData();
      
      // Append all form fields with backend property names
      form_data.append('name', formData.name);
      form_data.append('storeTitle', formData.storeTitle);
      form_data.append('dealInfo', formData.storeDealInfo); // Frontend: storeDealInfo -> Backend: dealInfo
      form_data.append('description', formData.description);
      form_data.append('storeAbout', formData.headingText); // Frontend: headingText -> Backend: storeAbout
      form_data.append('slug', formData.slug);
      form_data.append('websiteUrl', formData.websiteUrl);
      form_data.append('affiliateUrl', formData.affiliateUrl);
      form_data.append('category', formData.category);
      form_data.append('metaTitle', formData.metaTitle);
      form_data.append('metaDescription', formData.metaDescription);
      
      // Handle metaKeywords array
      if (formData.metaKeywords) {
        const keywordsArray = formData.metaKeywords.split(',').map(keyword => keyword.trim());
        keywordsArray.forEach((keyword, index) => {
          if (keyword) { // Only add non-empty keywords
            form_data.append(`metaKeywords[${index}]`, keyword);
          }
        });
      }
      
      form_data.append('networkName', formData.networkName);
      form_data.append('isActive', formData.isActive);
      
      // Handle file upload (logo)
      if (selectedFile) {
        form_data.append('logo', selectedFile); // Assuming the backend expects 'logo' field name
      }
      
      // Handle FAQs array
      const validFaqs = faqs.filter(faq => faq.question.trim() && faq.answer.trim());
      validFaqs.forEach((faq, index) => {
        form_data.append(`faq[${index}][question]`, faq.question.trim());
        form_data.append(`faq[${index}][answer]`, faq.answer.trim());
      });
  
      console.log('Submitting store data...');
      
      // Make API call with FormData
      const response = await fetch('http://localhost:5000/admin/api/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header for FormData - browser will set it with boundary
        },
        body: form_data
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Store created successfully:', result);
      alert('Store created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        storeTitle: '',
        storeDealInfo: '',
        description: '',
        headingText: '',
        slug: '',
        websiteUrl: '',
        affiliateUrl: '',
        category: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        networkName: '',
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0]
      });
      
      // Reset file and FAQs if you have state setters for them
      // setSelectedFile(null);
      // setFaqs([{ question: '', answer: '' }]);
  
    } catch (error) {
      console.error('Error creating store:', error);
      
      // Handle specific error cases
      if (error.message.includes('401')) {
        alert('Authentication failed. Please login again.');
      } else if (error.message.includes('400')) {
        alert(`Validation error: ${error.message}`);
      } else {
        alert(`Error creating store: ${error.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      storeTitle: '',
      storeDealInfo: '',
      description: '',
      headingText: '',
      slug: '',
      websiteUrl: '',
      affiliateUrl: '',
      category: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      networkName: '',
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0]
    });
    setSelectedFile(null);
    setShowPreview(false);
    setFaqs([{ question: '', answer: '' }]);
    setCurrentStep(1);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter store name"
                />
                <p className="text-sm text-gray-500 mt-1">A store name is required and recommended to be unique.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Title
                </label>
                <input
                  type="text"
                  value={formData.storeTitle}
                  onChange={(e) => handleInputChange("storeTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Display title for store"
                />

                {/* Live Preview */}
                {formData.storeTitle && (
                  <h1 className="mt-4 text-2xl font-bold text-gray-900">
                    {formData.storeTitle}
                  </h1>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Deal Info</label>
              <input
                type="text"
                value={formData.storeDealInfo}
                onChange={(e) => handleInputChange('storeDealInfo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Up to 50% off, Free shipping, Special offers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading Text</label>
              <input
                type="text"
                value={formData.headingText}
                onChange={(e) => handleInputChange('headingText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter heading text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Description / About</label>
              <div className="border border-gray-300 rounded-lg">
                <div className="border-b border-gray-200 px-4 py-2 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border-none bg-transparent focus:ring-0 focus:outline-none">
                      <option>Normal</option>
                    </select>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <button type="button" className="p-1 hover:bg-gray-200 rounded"><strong>B</strong></button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded"><em>I</em></button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded"><u>U</u></button>
                    </div>
                  </div>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border-none focus:ring-0 focus:outline-none resize-none h-32"
                  placeholder="Improve store visibility by adding a compelling description."
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFile ? 'Change Logo' : 'Upload Logo'}
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFile ? selectedFile.name : 'Choose a logo image for your store (PNG, JPG up to 2MB)'}
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (SEO URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="store-url-slug"
                />
                <p className="text-sm text-gray-500 mt-1">yoursite.com/{formData.slug || 'store-slug'}</p>
              </div>
              <div>
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active Status</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://store-website.com"
                />
                <p className="text-sm text-gray-500 mt-1">Shown on frontend</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate URL</label>
                <input
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) => handleInputChange('affiliateUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://affiliate-link.com"
                />
                <p className="text-sm text-gray-500 mt-1">Shown on frontend</p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                maxLength={60}
                placeholder="SEO title for search engines"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                maxLength={160}
                placeholder="Brief description for search results"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-sm text-gray-500 mt-1">Admin only - not shown on frontend</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Name</label>
              <input
                type="text"
                value={formData.networkName}
                onChange={(e) => handleInputChange('networkName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Internal network identifier"
              />
              <p className="text-sm text-gray-500 mt-1">Admin only - not shown on frontend</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Created Date</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-medium">
                {new Date(formData.createdDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <p className="text-sm text-gray-500 mt-1">Admin only - not shown on frontend</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">FAQ Section</label>
                <button
                  type="button"
                  onClick={addFaq}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter question"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-20 resize-none"
                        placeholder="Enter answer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 py-4 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Store Form</h1>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Steps Navigation */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center cursor-pointer ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mr-3 ${isActive ? 'border-blue-600 bg-blue-50' :
                        isCompleted ? 'border-green-600 bg-green-50' :
                          'border-gray-300 bg-gray-50'
                        }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="hidden md:block">
                        <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-300 mx-2 hidden md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
            {renderStepContent()}
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
              <div className="flex gap-3">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    Create Store
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Store Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                {/* Store Header */}
                <div className="flex items-start mb-8 p-6 bg-gray-50 rounded-lg">
                  {selectedFile && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt={formData.name}
                      className="w-20 h-20 rounded-lg object-cover mr-6 border shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.name || 'Store Name'}</h2>
                    <p className="text-lg text-gray-600 mb-2">{formData.storeTitle || 'Store Title'}</p>
                    {formData.storeDealInfo && (
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {formData.storeDealInfo}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">/{formData.slug || 'store-slug'}</p>
                  </div>
                </div>

                {/* Store Description */}
                {formData.description && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">About This Store</h4>
                    <p className="text-gray-700 leading-relaxed">{formData.description}</p>
                  </div>
                )}

                {/* Store Links */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {formData.websiteUrl && (
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium inline-flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Visit Store
                    </button>
                  )}
                  {formData.affiliateUrl && (
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-medium inline-flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Shop Now
                    </button>
                  )}
                </div>

                {/* FAQ Section */}
                {faqs.some(faq => faq.question.trim() && faq.answer.trim()) && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h4>
                    <div className="space-y-4">
                      {faqs.filter(faq => faq.question.trim() && faq.answer.trim()).map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h5 className="font-medium text-gray-900">{faq.question}</h5>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Preview */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">SEO Preview</h4>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                      {formData.metaTitle || 'Meta Title'}
                    </div>
                    <div className="text-green-700 text-sm mt-1">
                      yoursite.com/{formData.slug || 'store-slug'}
                    </div>
                    <div className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {formData.metaDescription || 'Meta description will appear here in search results...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStore;