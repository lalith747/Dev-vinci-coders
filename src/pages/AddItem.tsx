import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Camera, Tag, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const AddItem: React.FC = () => {
  const { user } = useAuth();
  const { addItem, categories } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    pointValue: '',
    tags: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'One Size'];

  // Mock image URLs for demo purposes
  const mockImages = [
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=400&h=400&fit=crop'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to list an item</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addMockImage = () => {
    if (images.length < 5) {
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setImages(prev => [...prev, randomImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.pointValue || parseInt(formData.pointValue) < 1) {
      newErrors.pointValue = 'Point value must be at least 1';
    }
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      addItem({
        ownerId: user.id,
        ownerName: user.username,
        ownerAvatar: user.avatar,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type || formData.category,
        size: formData.size,
        condition: formData.condition,
        pointValue: parseInt(formData.pointValue),
        status: 'pending_approval',
        images: images,
        tags: tags,
        location: user.location
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedPointValue = () => {
    const basePoints = {
      'Tops': 25,
      'Bottoms': 30,
      'Dresses': 35,
      'Outerwear': 45,
      'Shoes': 40,
      'Accessories': 20,
      'Activewear': 30,
      'Formal': 50
    };

    const conditionMultiplier = {
      'Like New': 1.2,
      'Excellent': 1.0,
      'Good': 0.8,
      'Fair': 0.6
    };

    const base = basePoints[formData.category as keyof typeof basePoints] || 25;
    const multiplier = conditionMultiplier[formData.condition as keyof typeof conditionMultiplier] || 1;
    
    return Math.round(base * multiplier);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List New Item</h1>
          <p className="text-gray-600">Share your unused clothing with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
            <p className="text-gray-600 mb-6">Add up to 5 photos to showcase your item</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Item ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={addMockImage}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </button>
              )}
            </div>

            {errors.images && (
              <p className="text-red-600 text-sm">{errors.images}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Denim Jacket"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g., Jacket, T-shirt, Sneakers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Size */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.size ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <p className="text-red-600 text-sm mt-1">{errors.size}</p>}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.condition ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
                {errors.condition && <p className="text-red-600 text-sm mt-1">{errors.condition}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your item in detail. Include brand, material, fit, and any special features..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="vintage, casual, summer (separate with commas)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-sm text-gray-500 mt-1">Add tags to help others find your item</p>
            </div>
          </div>

          {/* Points Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Point Value</h2>
            <p className="text-gray-600 mb-6">Set how many points this item is worth</p>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="pointValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Points *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="pointValue"
                    name="pointValue"
                    value={formData.pointValue}
                    onChange={handleInputChange}
                    min="1"
                    max="200"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.pointValue ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.pointValue && <p className="text-red-600 text-sm mt-1">{errors.pointValue}</p>}
              </div>

              {formData.category && formData.condition && (
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pointValue: suggestedPointValue().toString() }))}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Tag className="h-4 w-4" />
                    <span>Suggested: {suggestedPointValue()}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>List Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;