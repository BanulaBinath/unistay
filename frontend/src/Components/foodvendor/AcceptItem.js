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

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? response.data : o))
      );
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
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
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
      <ItemSidebar />

      <div className="table-container">
        <h1>Accept Item</h1>
        {fetchError && <p className="error-message">{fetchError}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Email</th>
                <th>Room</th>
                <th>Phone</th>
                <th>Qty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="12">Loading...</td>
                </tr>
              )}

              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan="12">No orders</td>
                </tr>
              )}

              {!isLoading &&
                orders.map((order) => (
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
                        onClick={() =>
                          handleUpdateStatus(order._id, order.status)
                        }
                        disabled={actionOrderId === order._id}
                      >
                        {actionOrderId === order._id ? '...' : 'Update'}
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={actionOrderId === order._id}
                      >
                        {actionOrderId === order._id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AcceptItem;