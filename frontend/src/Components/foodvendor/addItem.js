import React, { useState } from 'react';
import './AddItem.css';
import { Link, useNavigate } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar';
import { addItem as addItemApi } from '../../services/itemApi';

function AddItem() {
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
      setImagePreview(URL.createObjectURL(file));
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
      setErrors((prev) => ({ ...prev, description: 'Description can only contain letters and punctuation' }));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setErrors((prev) => ({ ...prev, price: '' }));
    } else {
      setErrors((prev) => ({ ...prev, price: 'Price must be a number' }));
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

          setTimeout(() => {
            navigate('/ItemManagement');
          }, 600);
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            (error?.code === 'ERR_NETWORK'
              ? 'Cannot connect to backend. Start server on port 5000.'
              : 'Failed to add item');

          setSubmitError(message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="additem-wrapper">
      <ItemSidebar />

      <div className="additem-content">
        <div className="additem-card">

          <div className="additem-header">
            <div>
              <h2>Unistay</h2>
              <h3>Food Item Management System</h3>
            </div>

            <ul className="additem-top-buttons">
              <li><Link to="/addItem"><button>Add Item</button></Link></li>
              <li><Link to="/ItemManagement"><button>Manage Item</button></Link></li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>

            {submitMessage && <p className="additem-success">{submitMessage}</p>}
            {submitError && <p className="additem-error">{submitError}</p>}

            <div className="additem-field">
              <label>Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={handleItemNameChange}
                disabled={isSubmitting}
              />
              {errors.itemName && <span className="additem-error-text">{errors.itemName}</span>}
            </div>

            <div className="additem-field">
              <label>Item Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
              {errors.itemImage && <span className="additem-error-text">{errors.itemImage}</span>}

              {imagePreview && (
                <div className="additem-preview-box">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="additem-field">
              <label>Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={handleDescriptionChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.description && <span className="additem-error-text">{errors.description}</span>}
            </div>

            <div className="additem-field">
              <label>Price (RS)</label>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                disabled={isSubmitting}
              />
              {errors.price && <span className="additem-error-text">{errors.price}</span>}
            </div>

            <div className="additem-field">
              <label>Category</label>
              <select
                className="additem-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">--Select--</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.category && <span className="additem-error-text">{errors.category}</span>}
            </div>

            <button type="submit" className="additem-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Item...' : 'Add Item to Menu'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;