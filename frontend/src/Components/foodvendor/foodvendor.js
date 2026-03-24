import React, { useEffect, useState } from 'react';
import './foodvendor.css';
import { Link, useNavigate } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar';
import { deleteItem as deleteItemApi, getItems } from '../../services/itemApi';

function FoodVendor() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionItemId, setActionItemId] = useState('');

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const response = await getItems();
      setItems(response?.data || []);
    } catch (error) {
      setFetchError(
        error?.response?.data?.message
        || (error?.code === 'ERR_NETWORK' ? 'Cannot connect to backend. Please start the server on port 5000.' : 'Failed to load items')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdate = (itemId) => {
    navigate(`/updateItem/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    setActionItemId(itemId);
    setFetchError('');

    try {
      await deleteItemApi(itemId);
      setItems((previousItems) => previousItems.filter((item) => item._id !== itemId));
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to delete item');
    } finally {
      setActionItemId('');
    }
  };

  return (
    <div>
      <ItemSidebar />

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <h2>Unistay</h2>
          <h3>Food Item Management System</h3>
        </div>

        <ul className="top-buttons">
          <li><Link to="/addItem"><button>Add Item</button></Link></li>
          <li><Link to="/ItemManagement"><button>Manage Item</button></Link></li>
        </ul>

        {fetchError && <p className="error-message">{fetchError}</p>}

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Price (RS)</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="6">Loading items...</td>
              </tr>
            )}

            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan="6">No items available</td>
              </tr>
            )}

            {!isLoading &&
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{Number(item.price).toFixed(2)}</td>
                  <td className={item.category === 'active' ? 'status-active' : 'status-inactive'}>
                    {item.category}
                  </td>
                  <td>
                    <img
                      src={`${imageBaseUrl}${item.itemImage}`}
                      alt={item.itemName}
                      width="60"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-update"
                      onClick={() => handleUpdate(item._id)}
                      disabled={actionItemId === item._id}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(item._id)}
                      disabled={actionItemId === item._id}
                    >
                      {actionItemId === item._id ? 'Working...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FoodVendor;