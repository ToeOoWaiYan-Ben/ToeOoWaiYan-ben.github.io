import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const DataTable = ({ data, onDelete, onFilter }) => {
  const handleFilterChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Search by product name..."
        onChange={handleFilterChange}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount (%)</th>
            <th>Total</th>
            <th>Discounted Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>${item.price}</td>
              <td>{item.discount}%</td>
              <td>${item.total.toFixed(2)}</td>
              <td>${item.discountedTotal.toFixed(2)}</td>
              <td>
                <Button variant="danger" onClick={() => onDelete(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
