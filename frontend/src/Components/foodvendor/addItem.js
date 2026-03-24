import React, { useState } from 'react';
import './AddItem.css';
import { Link } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar';
import { addItem as addItemApi } from '../../services/itemApi';

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // <-- for preview
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file)); // <-- generate preview
    } else {
      setImagePreview(null);
    }
  };

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setItemName(value);
      setErrors((prev) => ({ ...prev, itemName: '' }));
    } else {
      setErrors((prev) => ({ ...prev, itemName: 'Item Name can only contain letters and spaces' }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s.,!?]*$/.test(value)) {
      setDescription(value);
      setErrors((prev) => ({ ...prev, description: '' }));
    } else {
      setErrors((prev) => ({ ...prev, description: 'Description can only contain letters and basic punctuation' }));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setErrors((prev) => ({ ...prev, price: '' }));
    } else {
      setErrors((prev) => ({ ...prev, price: 'Price must be a number and cannot contain letters or symbols' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemName.trim()) newErrors.itemName = 'Item Name is required';
    if (!itemImage) newErrors.itemImage = 'Item Image is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price || isNaN(price) || Number(price) <= 0) newErrors.price = 'Enter a valid price';
    if (!category) newErrors.category = 'Select a category';
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    if (validateForm()) {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('itemName', itemName.trim());
      formData.append('itemImage', itemImage);
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);

      addItemApi(formData)
        .then((response) => {
          setSubmitMessage(response?.message || 'Item added successfully');
          setItemName('');
          setItemImage(null);
          setImagePreview(null);
          setDescription('');
          setPrice('');
          setCategory('');
          setErrors({});
        })
        .catch((error) => {
          const message = error?.response?.data?.message
            || (error?.code === 'ERR_NETWORK' ? 'Cannot connect to backend. Please start the server on port 5000.' : 'Failed to add item');
          setSubmitError(message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
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
            <ul>
              <li><Link to="/addItem"><button>Add Item</button></Link></li>
              <li><Link to="/ItemManagement"><button>Manage Item</button></Link></li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            {submitMessage && <p className="success-message">{submitMessage}</p>}
            {submitError && <p className="error-message">{submitError}</p>}

            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                placeholder="e.g. Delicious Burger"
                value={itemName}
                onChange={handleItemNameChange}
                disabled={isSubmitting}
              />
              {errors.itemName && <span className="error">{errors.itemName}</span>}
            </div>

            <div className="form-group">
              <label>Item Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
              {errors.itemImage && <span className="error">{errors.itemImage}</span>}

              {/* Image preview */}
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                placeholder="Tell us about the item..."
                value={description}
                onChange={handleDescriptionChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label>Price (RS)</label>
              <input
                type="text"
                placeholder="0.00"
                value={price}
                onChange={handlePriceChange}
                disabled={isSubmitting}
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">--Select--</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Item...' : 'Add Item to Menu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;