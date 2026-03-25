import React, { useEffect, useState } from 'react';
import './AcceptItem.css';
import ItemSidebar from '../foodvendor/itemsidebar';
import { deleteVendorOrder, getVendorOrders, updateVendorOrderStatus } from '../../services/orderApi';

function AcceptItem() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionOrderId, setActionOrderId] = useState('');

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const normalizedStatus = String(currentStatus || 'Pending').toLowerCase();
    const nextStatus = normalizedStatus === 'pending' ? 'Accepted' : 'Pending';

    try {
      setActionOrderId(orderId);
      setFetchError('');
      const response = await updateVendorOrderStatus(orderId, nextStatus);

      setOrders((prevOrders) => prevOrders.map((order) => (
        order._id === orderId ? response.data : order
      )));
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionOrderId('');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    try {
      setActionOrderId(orderId);
      setFetchError('');
      await deleteVendorOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to delete order');
    } finally {
      setActionOrderId('');
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const response = await getVendorOrders();
      setOrders(response?.data || []);
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="accept-item-container">
      {/* Sidebar */}
      <ItemSidebar />

      {/* Main content */}
      <div className="table-container">
        <h1>Accept Item</h1>
        {fetchError && <p className="error-message">{fetchError}</p>}

        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Email</th>
              <th>Room Number</th>
              <th>Phone Number</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Time</th>
              <th>Live Location</th>
              <th>Status / Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="12">Loading orders...</td>
              </tr>
            )}
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan="12">No orders yet</td>
              </tr>
            )}
            {!isLoading && orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId}</td>
                <td>{order.itemName}</td>
                <td>Rs.{Number(order.totalPrice || 0).toFixed(2)}</td>
                <td>{order.email}</td>
                <td>{order.roomNumber}</td>
                <td>{order.phone}</td>
                <td>{order.quantity}</td>
                <td>{order.orderDate}</td>
                <td>{order.time}</td>
                <td>{order.liveLocation || '-'}</td>
                <td>{order.status || 'Pending'}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateStatus(order._id, order.status || 'Pending')}
                    disabled={actionOrderId === order._id}
                  >
                    {actionOrderId === order._id ? 'Working...' : 'Update'}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={actionOrderId === order._id}
                  >
                    {actionOrderId === order._id ? 'Working...' : 'Delete'}
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

export default AcceptItem;