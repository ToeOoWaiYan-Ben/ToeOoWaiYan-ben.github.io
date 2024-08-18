import { useState, useRef } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import productList from './accessory-product.json';
import DataTable from './components/DataTable.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const pRef = useRef();
  const qRef = useRef();
  const dRef = useRef(); // Reference for discount input

  const [selectedItem, setSelectedItem] = useState([]);
  const [filterSelectedItem, setFilterSelectedItem] = useState([]);
  const [price, setPrice] = useState(productList[0].price);
  const [totalCost, setTotalCost] = useState(0);
  const [grossPrice, setGrossPrice] = useState(0);
  const [vatPrice, setVatPrice] = useState(0);
  const [netPrice, setNetPrice] = useState(0);
  const [discount, setDiscount] = useState(0); // State for discount
  const [totalDiscount, setTotalDiscount] = useState(0); // State for total discount

  const handleAdd = (e) => {
    const pid = pRef.current.value;
    const q = parseInt(qRef.current.value);
    const d = parseFloat(dRef.current.value); // Get discount value
    const product = productList.find(p => p.id == pid);

    let itemIndex = filterSelectedItem.findIndex(item => item.id == pid);

    if (itemIndex > -1) {
      filterSelectedItem[itemIndex].qty += q;
      filterSelectedItem[itemIndex].total = filterSelectedItem[itemIndex].price * filterSelectedItem[itemIndex].qty;
      filterSelectedItem[itemIndex].discount = d;
      filterSelectedItem[itemIndex].discountedTotal = filterSelectedItem[itemIndex].total - d;
    } else {
      const newItem = {
        ...product,
        qty: q,
        discount: d,
        total: product.price * q,
        discountedTotal: product.price * q - d
      };
      selectedItem.push(newItem);
    }

    console.table(selectedItem);
    setSelectedItem([...selectedItem]);
    setFilterSelectedItem([...selectedItem]);

    const total = selectedItem.reduce((acc, item) => acc + item.total, 0);
    const gross = selectedItem.reduce((acc, item) => acc + item.discountedTotal, 0);
    const totalDiscountValue = total - gross;
    setTotalCost(total);
    setGrossPrice(gross);
    setTotalDiscount(totalDiscountValue);

    const vat = gross * 0.07;
    setVatPrice(vat.toFixed(1));

    const net = parseFloat(gross) + parseFloat(vat);
    setNetPrice(net.toFixed(1));
    setDiscount(d); // Update discount state
  };

  const handleProductChanged = (e) => {
    const pid = pRef.current.value;
    const product = productList.find(p => p.id == pid);
    const p = product.price;
    console.log(p);
    setPrice(p);
  };

  const deleteByIndex = (index) => {
    const updatedItems = [...selectedItem];
    const itemToRemove = updatedItems[index];

    if (itemToRemove) {
      itemToRemove.qty = Math.max(itemToRemove.qty - 1, 0);
    }
    itemToRemove.total = itemToRemove.qty * itemToRemove.price;
    itemToRemove.discountedTotal = itemToRemove.total - itemToRemove.discount;

    if (itemToRemove.qty === 0) {
      updatedItems.splice(index, 1);
    }

    setSelectedItem([...updatedItems]);
    setFilterSelectedItem([...updatedItems]);

    const updateTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
    const updateGross = updatedItems.reduce((acc, item) => acc + item.discountedTotal, 0);
    const updateTotalDiscount = updateTotal - updateGross;

    setTotalCost(updateTotal);
    setGrossPrice(updateGross);
    setTotalDiscount(updateTotalDiscount);

    const updateVat = updateGross * 0.07;
    setVatPrice(updateVat.toFixed(1));

    const updateNet = updateGross + parseFloat(updateVat);
    setNetPrice(updateNet.toFixed(1));
  };

  const filter = (keyword) => {
    const filterItem = selectedItem.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilterSelectedItem(filterItem);
  };

  const sortAscending = () => {
    const sorted = [...selectedItem].sort((a, b) => a.name.localeCompare(b.name));
    setSelectedItem(sorted);
    setFilterSelectedItem(sorted);
  };

  const sortDescending = () => {
    const sorted = [...selectedItem].sort((a, b) => b.name.localeCompare(a.name));
    setSelectedItem(sorted);
    setFilterSelectedItem(sorted);
  };

  const handleClear = () => {
    setSelectedItem([]);
    setFilterSelectedItem([]);
    setTotalCost(0);
    setGrossPrice(0);
    setVatPrice(0);
    setNetPrice(0);
    setTotalDiscount(0);
  };

  return (
    <>
      <Container>
        <br></br>
        <Row>
          <Col xs={1}>Product:</Col>
          <Col>
            <Form.Select ref={pRef} onChange={handleProductChanged}>
              {
                productList.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              }
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col xs={1}>Price:</Col>
          <Col>{price}</Col>
        </Row>

        <Row>
          <Col xs={1}>Quantity:</Col>
          <Col>
            <input type="number" ref={qRef} defaultValue={1} />
          </Col>
        </Row>

        <Row>
          <Col xs={1}>Discount ($):</Col> {/* Discount input field */}
          <Col>
            <input type="number" ref={dRef} defaultValue={0} onChange={(e) => setDiscount(parseFloat(e.target.value))} />
          </Col>
        </Row>

        <Button variant="secondary" onClick={handleAdd}>Add</Button>{' '}
        <Button variant="danger" onClick={handleClear}>Clear</Button> {/* Clear button */}

        <Container style={{ position: "absolute", left: "75%" }}>
          <Row>
            <Col>
              <Button variant="outline-dark" onClick={sortAscending}><i className="bi bi-arrow-down"></i></Button>{'  '}
              <Button variant="outline-dark" onClick={sortDescending}><i className="bi bi-arrow-up"></i></Button>
            </Col>
          </Row>
        </Container>

        <DataTable data={filterSelectedItem} onDelete={deleteByIndex} onFilter={filter}></DataTable>
        <br></br>
        <Container style={{ position: "relative", top: "70%", left: "80%", fontWeight: 'bold' }}>
          <Row>
            <Col>Total Amount = $ {totalCost}</Col>
          </Row>
          <Row>
            <Col>Total Discount = $ {totalDiscount.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col>Total Amount (after discount) = $ {grossPrice}</Col>
          </Row>
          <Row>
            <Col>Vat ( 7% ) = $ {vatPrice}</Col>
          </Row>
          <Row>
            <Col>Net Price = $ {netPrice}</Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default App;
