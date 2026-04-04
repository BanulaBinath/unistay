import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import  './updateitem.css';
import ItemSidebar from '../foodvendor/itemsidebar';
import { getItemById, updateItem as updateItemApi } from '../../services/itemApi';

function UpdateItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        setSubmitError('');

        const response = await getItemById(id);
        const item = response?.data;

        setItemName(item?.itemName || '');
        setDescription(item?.description || '');
        setPrice(String(item?.price ?? ''));
        setCategory(item?.category || '');
        setImagePreview(item?.itemImage ? `${imageBaseUrl}${item.itemImage}` : '');
      } catch (error) {
        setSubmitError(error?.response?.data?.message || 'Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, imageBaseUrl]);

  const handleItemNameChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z\s]*$/.test(value)) {
      setItemName(value);
      setErrors((prev) => ({ ...prev, itemName: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        itemName: 'Item Name can only contain letters and spaces'
      }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z\s.,!?]*$/.test(value)) {
      setDescription(value);
      setErrors((prev) => ({ ...prev, description: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        description: 'Only letters and basic punctuation allowed'
      }));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setErrors((prev) => ({ ...prev, price: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        price: 'Price must be a valid number'
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file || null);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!itemName.trim()) {
      newErrors.itemName = 'Item Name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Enter a valid price';
    }

    if (!category) {
      newErrors.category = 'Select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('itemName', itemName.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);

      if (itemImage) {
        formData.append('itemImage', itemImage);
      }

      await updateItemApi(id, formData);

      navigate('/ItemManagement');
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <ItemSidebar />

      <div className="main-content">
        <div className="card">

          <div className="management-header">
            <div>
              <h2>Unistay</h2>
              <h3>Food Item Management System</h3>
            </div>

           
          </div>

          {isLoading ? (
            <p>Loading item...</p>
          ) : (
            <form onSubmit={handleSubmit}>

              {submitError && <p className="error-message">{submitError}</p>}

              {/* Item Name */}
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={handleItemNameChange}
                  disabled={isSubmitting}
                />
                {errors.itemName && <span className="error">{errors.itemName}</span>}
              </div>

              <div className="form-group">
                <label>Item Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />

                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={imagePreview}
                      alt="Item preview"
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={handleDescriptionChange}
                  disabled={isSubmitting}
                ></textarea>
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price (RS)</label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  disabled={isSubmitting}
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">--Select--</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Item'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateItem;