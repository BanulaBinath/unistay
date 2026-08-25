import React, { useState, useRef, useEffect } from 'react';
import './AddItem.css';
import { Link, useNavigate } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar';
import { addItem as addItemApi } from '../../services/itemApi';
import { useAuth } from '../../context/AuthContext';

function AddItem() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, itemImage: '' }));
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.fullName || user?.name || user?.email || "Vendor";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="vendor-wrapper">
      <ItemSidebar />

      <div className="vendor-main">
        <div className="vendor-header">
          <div>
            <h2 className="vendor-title">Add Item</h2>
            <p className="vendor-subtitle">Add new item to your menu</p>
          </div>
          {/* Profile Button */}
          <div className="vendor-profile-wrap" ref={profileRef}>
            <button
              className="vendor-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
            >
              <div className="vendor-avatar">{initials}</div>
              <div className="vendor-profile-info">
                <span className="vendor-profile-name">{displayName}</span>
                <span className="vendor-profile-role">Food Vendor</span>
              </div>
              <span className="vendor-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="vendor-profile-dropdown">
                <div className="vendor-dropdown-header">
                  <div className="vendor-avatar vendor-avatar-lg">{initials}</div>
                  <div>
                    <p className="vendor-dropdown-name">{displayName}</p>
                    <p className="vendor-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/vendor/food/dashboard'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </button>
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/ItemManagement'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Items
                </button>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item danger" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="vendor-actions">
          <Link to="/addItem" className="vendor-action-btn vendor-action-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Link>
          <Link to="/ItemManagement" className="vendor-action-btn vendor-action-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Manage Items
          </Link>
        </div>

        {submitMessage && <div className="vendor-success">{submitMessage}</div>}
        {submitError && <div className="vendor-error">{submitError}</div>}

        <div className="vendor-form-card">
          <form onSubmit={handleSubmit} className="vendor-form">

            <div className="vendor-form-field">
              <label className="vendor-form-label">Item Name</label>
              <input
                type="text"
                className="vendor-form-input"
                value={itemName}
                onChange={handleItemNameChange}
                disabled={isSubmitting}
                placeholder="Enter item name"
              />
              {errors.itemName && <span className="vendor-error-text">{errors.itemName}</span>}
            </div>

            <div className="vendor-form-field">
              <label className="vendor-form-label">Item Image</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="vendor-file-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {itemImage ? itemImage.name : 'Choose Image'}
              </button>
              {errors.itemImage && <span className="vendor-error-text">{errors.itemImage}</span>}

              {imagePreview && (
                <div className="vendor-image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="vendor-form-field">
              <label className="vendor-form-label">Description</label>
              <textarea
                className="vendor-form-textarea"
                rows="4"
                value={description}
                onChange={handleDescriptionChange}
                disabled={isSubmitting}
                placeholder="Enter item description"
              ></textarea>
              {errors.description && <span className="vendor-error-text">{errors.description}</span>}
            </div>

            <div className="vendor-form-field">
              <label className="vendor-form-label">Price (RS)</label>
              <input
                type="text"
                className="vendor-form-input"
                value={price}
                onChange={handlePriceChange}
                disabled={isSubmitting}
                placeholder="0.00"
              />
              {errors.price && <span className="vendor-error-text">{errors.price}</span>}
            </div>

            <div className="vendor-form-field">
              <label className="vendor-form-label">Category</label>
              <select
                className="vendor-form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.category && <span className="vendor-error-text">{errors.category}</span>}
            </div>

            <button type="submit" className="vendor-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="vendor-btn-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                  </svg>
                  Adding Item...
                </>
              ) : (
                'Add Item to Menu'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;