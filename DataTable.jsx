import React from 'react';
import { Table, Button } from 'react-bootstrap';

function DataTable({ data, onDelete, onFilter }) {
    const handleFilterChange = (e) => {
    onFilter(e.target.value);
};
return (
    <>
    <input type="text" placeholder="Filter by name" onChange={handleFilterChange} />
    <Table striped bordered hover>
        <thead>
            <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Discount (%)</th>
            <th>Discounted Total</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.qty}</td>
                <td>{item.total}</td>
                <td>{item.discount}</td>
                <td>{item.discountedTotal.toFixed(2)}</td>
                <td>
                <Button variant="bi bi-trash-fill" onClick={() => onDelete(index)}></Button>
                </td>
            </tr>
        ))}
        </tbody>
        </Table>
    </>
    );
}

export default DataTable;

